package eu.jakobo

import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.shaded.com.google.common.collect.ImmutableList
import java.sql.DriverManager

fun main() {
    println("Starting postgres.")

    val postgres = PostgreSQLContainer("postgres:16-alpine") // Uses official production image
        .withDatabaseName("elo_simulation")
        .withUsername("sim_user")
        .withPassword("sim_pass")

    postgres.start()
    println("Postgres started.")

    try {
        val conn = DriverManager.getConnection(postgres.jdbcUrl, postgres.username, postgres.password)
        val bootstrapDb = BootstrapDb(conn)
        bootstrapDb.bootstrap("20260608")

        val personQueueBuilder = PersonQueue.PersonQueueBuilder()
        conn.prepareStatement("SELECT person_id, rankings FROM person;").executeQuery().use { rs ->
            while (rs.next()) {
                val personId = rs.getString("person_id")
                val rankings = rs.getInt("rankings")
                personQueueBuilder.addPerson(personId, rankings)
            }
        }
        val personQueue = personQueueBuilder.build()
        println("Loaded " + personQueue.queueSize() + " rankings to perform onto queue.")

        val replayer = Replayer(personQueue, conn)
        replayer.replay(1)
    } finally {
        postgres.stop()
    }
}