package eu.jakobo

import org.postgresql.copy.CopyManager
import org.postgresql.core.BaseConnection
import java.io.StringReader
import java.nio.file.Files
import java.nio.file.Path
import java.sql.Connection

class BootstrapDb(val conn: Connection) {
    fun bootstrap() {
        conn.createStatement().execute(loadDataFromFile("tables.sql"))
        conn.createStatement().execute(loadDataFromFile("apply_habitat_elo.sql"))
        conn.createStatement().execute(loadDataFromFile("next_pair_for_person2.sql"))

        copyCsvIntoTable(
            conn = conn,
            csvFileName = "demographics.csv",
            tableName = "demographics",
            columns = listOf("demographic", "demographic_value")
        )

        copyCsvIntoTable(
            conn = conn,
            csvFileName = "questions.csv",
            tableName = "questions",
            columns = listOf("question_id")
        )

        copyCsvIntoTable(
            conn = conn,
            csvFileName = "habitat.csv",
            tableName = "habitat",
            columns = listOf("demographic","demographic_value","habitat_id","question_id")
        )
    }

    private fun loadDataFromFile(filename: String): String? {
        val sqlPath = Path.of("..", "data", filename).normalize()
        require(Files.exists(sqlPath)) { "Missing file at: ${sqlPath.toAbsolutePath()}" }
        val createTableSql = Files.readString(sqlPath)
        return createTableSql
    }

    private fun copyCsvIntoTable(
        conn: java.sql.Connection,
        csvFileName: String,
        tableName: String,
        columns: List<String>
    ) {
        val csvContent = loadDataFromFile(csvFileName)
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