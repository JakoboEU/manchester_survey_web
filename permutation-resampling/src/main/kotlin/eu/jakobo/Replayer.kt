package eu.jakobo

import java.nio.file.Files
import java.nio.file.Path
import java.sql.Connection
import java.sql.ResultSet
import java.util.UUID

class Replayer(val conn: Connection, val csvPath: Path) {

    fun replay(numberOfReplays: Int) {
        conn.autoCommit = true
        val runResampleCall = conn.prepareCall("CALL run_single_resample_fully_internal();")
        val fetchRankingsPs = conn.prepareStatement("SELECT demographic, demographic_value, habitat_id, question_id, mu, rankings FROM habitat")

        for (i in 1..numberOfReplays) {
            runResampleCall.execute()

            // Read results out to your CSV
            fetchRankingsPs.executeQuery().use { rs ->
                storeRankingPermutationResample(rs)
            }
            println("Finished resample run $i")
        }
    }

    private fun storeRankingPermutationResample(rs: ResultSet) {
        val filePath = csvPath.resolve("${UUID.randomUUID()}.csv")
        Files.newBufferedWriter(filePath).use { writer ->
            writer.write("demographic,demographic_value,habitat_id,question_id,mu,rankings")
            writer.newLine()

            while (rs.next()) {
                val demographic = rs.getString("demographic") ?: ""
                val demographicValue = rs.getString("demographic_value") ?: ""
                val habitatId = rs.getInt("habitat_id")
                val questionId = rs.getString("question_id") ?: ""
                val mu = rs.getDouble("mu")
                val rankings = rs.getInt("rankings")

                writer.write("$demographic,$demographicValue,$habitatId,$questionId,$mu,$rankings")
                writer.newLine()
            }
        }
    }
}