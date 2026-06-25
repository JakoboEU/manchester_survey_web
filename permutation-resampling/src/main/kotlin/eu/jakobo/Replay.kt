package eu.jakobo

import java.sql.Connection
import java.util.Random

class Replay(val people: PersonQueue, val conn: Connection, val random: Random) {
    fun performRankings() {
        val lastQuestion = mutableMapOf<String,String>()

        for (p in people) {
            conn.prepareStatement(
                "SELECT habitat1_id, habitat2_id, question_id " +
                        "FROM next_pair_for_person2(?::uuid, ?::text)"
            ).use { ps ->
                ps.setObject(1, p)
                ps.setString(2, lastQuestion[p])

                ps.executeQuery().use { rs ->
                    if (rs.next()) {
                        val habitat1 = rs.getInt(1)
                        val habitat2 = rs.getInt(2)
                        val questionId = rs.getString(3)

                        val winner = if (random.nextBoolean()) habitat1 else habitat2
                        val loser = if (winner == habitat1) habitat2 else habitat1

                        conn.prepareStatement(
                            "SELECT apply_habitat_elo_rpc(?::uuid, ?::text, ?::int, ?::int)"
                        ).use { eloPs ->
                            eloPs.setObject(1, p)
                            eloPs.setString(2, questionId)
                            eloPs.setInt(3, winner)
                            eloPs.setInt(4, loser)
                            eloPs.execute()
                        }

                        lastQuestion[p] = questionId
                    }
                }
            }
        }
    }
}