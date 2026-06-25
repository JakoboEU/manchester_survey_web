package eu.jakobo

import org.testcontainers.containers.PostgreSQLContainer
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

        val personQueue = PersonQueue()
        conn.prepareStatement("SELECT person_id, rankings FROM person;").executeQuery().use { rs ->
            while (rs.next()) {
                val personId = rs.getString("person_id")
                val rankings = rs.getInt("rankings")
                personQueue.addPerson(personId, rankings)
            }
        }

        println("Loaded " + personQueue.queueSize() + " rankings to perform onto queue.")
        println("Resetting rankings to 0 on " + conn.prepareStatement("UPDATE person SET rankings = 0;").executeUpdate() + " rows.")
    } finally {
        postgres.stop()
    }
}