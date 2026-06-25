package eu.jakobo

import org.testcontainers.containers.PostgreSQLContainer
import java.io.StringReader
import java.nio.file.Files
import java.nio.file.Path
import java.sql.DriverManager
import kotlin.jvm.java
import org.postgresql.copy.CopyManager
import org.postgresql.core.BaseConnection

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
        bootstrapDb.bootstrap()

        println(
            conn.prepareStatement("SELECT * FROM demographics;").executeQuery()
        )
    } finally {
        postgres.stop()
    }
}