package eu.jakobo

import org.testcontainers.containers.PostgreSQLContainer
import java.nio.file.Files
import java.nio.file.Path
import java.sql.DriverManager

fun main() {
    println("Starting postgres.")

    val postgres = PostgreSQLContainer("postgres:16-alpine") // Uses official production image
        .withDatabaseName("elo_simulation")
        .withUsername("sim_user")
        .withPassword("sim_pass")

    postgres.start()
    println("Postgres started.")

    val sqlPath = Path.of("..", "data", "tables.sql").normalize()
    require(Files.exists(sqlPath)) { "Missing SQL file at: ${sqlPath.toAbsolutePath()}" }
    val createTableSql = Files.readString(sqlPath)

    print(createTableSql)
    try {
        val conn = DriverManager.getConnection(postgres.jdbcUrl, postgres.username, postgres.password)
        conn.createStatement().execute(createTableSql)
    } finally {
        postgres.stop()
    }
}