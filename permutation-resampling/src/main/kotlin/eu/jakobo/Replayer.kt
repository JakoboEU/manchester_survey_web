package eu.jakobo

import java.sql.Connection
import java.util.Random

class Replayer(val people: PersonQueue, val conn: Connection) {
    fun replay(numberOfReplays: Int) {
        val random = Random()
        println("Resetting rankings to 0 on " + conn.prepareStatement("UPDATE person SET rankings = 0;").executeUpdate() + " rows.")
        println("Resetting habitat rankings on " + conn.prepareStatement("UPDATE habitat SET mu = 1500, rankings = 0;").executeUpdate() + " rows.")

        for (i in 1..numberOfReplays) {
            val replay = Replay(people.shuffle(), conn, random)
            replay.performRankings();
        }

        conn.prepareStatement("SELECT demographic,demographic_value,habitat_id,question_id,mu,rankings FROM habitat").executeQuery().use {
rs ->
            while (rs.next()) {
                val demographic = rs.getString("demographic")
                val demographicValue = rs.getString("demographic_value")
                val habitatId = rs.getInt("habitat_id")
                val questionId = rs.getString("question_id")
                val mu = rs.getDouble("mu")
                val rankings = rs.getInt("rankings")
                println("$demographic,$demographicValue,$habitatId,$questionId,$mu,$rankings")
            }
        }
    }
}