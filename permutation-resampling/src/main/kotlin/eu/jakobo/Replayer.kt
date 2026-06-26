package eu.jakobo

import java.nio.file.Files
import java.nio.file.Path
import java.sql.Connection
import java.sql.ResultSet
import java.util.Random
import java.util.UUID

class Replayer(val people: PersonQueue, val conn: Connection, val csvPath: Path) {
    val resetPersonRankingsPs = conn.prepareStatement("UPDATE person SET rankings = 0;")
    val resetHabitatRankingsPs = conn.prepareStatement("UPDATE habitat SET mu = 1500, rankings = 0;")
    val fetchHabitatRankingsPs = conn.prepareStatement("SELECT demographic, demographic_value, habitat_id, question_id, mu, rankings FROM habitat")

    val replay = Replay(conn, Random())

    fun replay(numberOfReplays: Int) {
        conn.autoCommit = false
        try {
            for (i in 1..numberOfReplays) {
                val numberOfPersonRowsReset = resetPersonRankingsPs.executeUpdate()
                val numberOfHabitatRowsReset = resetHabitatRankingsPs.executeUpdate()
                println("Resetting rankings to 0 on $numberOfPersonRowsReset rows.")
                println("Resetting habitat rankings on $numberOfHabitatRowsReset rows.")

                replay.resample(people.shuffle())

                fetchHabitatRankingsPs.executeQuery().use { rs ->
                    storeRankingPermutationResample(rs)
                }
                conn.commit()
                println("Wrote replay $i to $csvPath")
            }
        } finally {
            conn.autoCommit = true
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