package eu.jakobo

import java.nio.file.Files
import java.nio.file.Path
import java.sql.Connection
import java.sql.ResultSet
import java.util.Random
import java.util.UUID

class Replayer(val people: PersonQueue, val conn: Connection, val csvPath: Path) {
    val random = Random()

    fun replay(numberOfReplays: Int) {
        for (i in 1..numberOfReplays) {
            val numberOfPersonRowsReset = conn.prepareStatement("UPDATE person SET rankings = 0;").executeUpdate()
            val numberOfHabitatRowsReset = conn.prepareStatement("UPDATE habitat SET mu = 1500, rankings = 0;").executeUpdate()
            println("Resetting rankings to 0 on $numberOfPersonRowsReset rows.")
            println("Resetting habitat rankings on $numberOfHabitatRowsReset rows.")

            val replay = Replay(people.shuffle(), conn, random)
            replay.resample()

            conn.prepareStatement(
                "SELECT demographic, demographic_value, habitat_id, question_id, mu, rankings FROM habitat"
            ).executeQuery().use { rs ->
                storeRankingPermutationResample(rs)
            }

            println("Wrote replay $i to $csvPath")
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