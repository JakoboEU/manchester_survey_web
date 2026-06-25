package eu.jakobo

import org.testcontainers.containers.PostgreSQLContainer
import java.nio.file.Path
import java.sql.DriverManager
import kotlin.io.path.createDirectories

const val BACKUP_TO_USE = "20260608"

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
        bootstrapDb.bootstrap(BACKUP_TO_USE)

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

        val csvPath = Path.of("..", "supabase", "backups", BACKUP_TO_USE, "resampled")
        csvPath.createDirectories()
        val replayer = Replayer(personQueue, conn, csvPath)
        replayer.replay(3)
    } finally {
        postgres.stop()
    }
}