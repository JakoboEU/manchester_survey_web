package eu.jakobo

import org.postgresql.copy.CopyManager
import org.postgresql.core.BaseConnection
import java.io.StringReader
import java.nio.file.Files
import java.nio.file.Path
import java.sql.Connection

class BootstrapDb(val conn: Connection) {
    fun bootstrap(backupDirectory: String) {
        conn.createStatement().use { stmt ->
            stmt.execute(loadDataFromFile("tables.sql"))
            stmt.execute(loadDataFromFile("indexes.sql"))
            stmt.execute(loadDataFromFile("apply_habitat_elo.sql"))
            stmt.execute(loadDataFromFile("next_pair_for_person2.sql"))

            // Create the permanent reference table for simulation shuffling
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS person_baseline (
                    person_id UUID PRIMARY KEY,
                    rankings BIGINT DEFAULT 0
                );
            """.trimIndent())

            stmt.execute(loadDataFromFile("run_single_resample_fully_internal.sql"))
        }

        copyCsvIntoTable(
            conn = conn,
            csvContent = loadDataFromFile("demographics.csv"),
            tableName = "demographics",
            columns = listOf("demographic", "demographic_value")
        )

        copyCsvIntoTable(
            conn = conn,
            csvContent = loadDataFromFile("questions.csv"),
            tableName = "questions",
            columns = listOf("question_id")
        )

        copyCsvIntoTable(
            conn = conn,
            csvContent = loadDataFromFile("habitat.csv"),
            tableName = "habitat",
            columns = listOf("demographic","demographic_value","habitat_id","question_id")
        )

        copyCsvIntoTable(
            conn = conn,
            csvContent = loadBackupFromFile("person.csv", backupDirectory),
            tableName = "person",
            columns = listOf("person_id","rankings")
        )

        copyCsvIntoTable(
            conn = conn,
            csvContent = loadBackupFromFile("person.csv", backupDirectory),
            tableName = "person_baseline",
            columns = listOf("person_id", "rankings")
        )

        copyCsvIntoTable(
            conn = conn,
            csvContent = loadBackupFromFile("person_demographics.csv", backupDirectory),
            tableName = "person_demographics",
            columns = listOf("person_id", "demographic","demographic_value")
        )
    }

    private fun loadBackupFromFile(filename: String, backupDirectory: String): String {
        val filePath = Path.of("..", "supabase", "backups", backupDirectory, filename).normalize()
        require(Files.exists(filePath)) { "Missing file at: ${filePath.toAbsolutePath()}" }
        return Files.readString(filePath)
    }

    private fun loadDataFromFile(filename: String): String {
        val filePath = Path.of("..", "data", filename).normalize()
        require(Files.exists(filePath)) { "Missing file at: ${filePath.toAbsolutePath()}" }
        return Files.readString(filePath)
    }

    private fun copyCsvIntoTable(
        conn: Connection,
        csvContent: String,
        tableName: String,
        columns: List<String>
    ) {
        val copySql = buildString {
            append("COPY ")
            append(tableName)
            append(" (")
            append(columns.joinToString(", "))
            append(") FROM STDIN WITH (FORMAT csv, HEADER true)")
        }

        val pgConn = conn.unwrap(BaseConnection::class.java)
        val copyManager = CopyManager(pgConn)
        StringReader(csvContent).use { reader ->
            copyManager.copyIn(copySql, reader)
        }
    }
}