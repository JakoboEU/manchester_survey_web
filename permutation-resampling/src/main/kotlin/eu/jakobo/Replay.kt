package eu.jakobo

import java.sql.Connection
import java.util.Random

class Replay(val conn: Connection, val random: Random) {

    fun resample(people: PersonQueue) {
        val lastQuestionByPerson = mutableMapOf<Person,String>()

        conn.prepareStatement(
            "SELECT habitat1_id, habitat2_id, question_id FROM next_pair_for_person2(?::uuid, ?::text)"
        ).use { nextPairwiseChoicePs ->
            conn.prepareStatement(
                "SELECT apply_habitat_elo_rpc(?::uuid, ?::text, ?::int, ?::int)"
            ).use { updatePairwiseChoicePs ->
                for (p in people) {
                    nextPairwiseChoicePs.setObject(1, p.toString())
                    nextPairwiseChoicePs.setString(2, lastQuestionByPerson[p])

                    nextPairwiseChoicePs.executeQuery().use { nextPairwiseChoiceRs ->
                        if (nextPairwiseChoiceRs.next()) {
                            val habitat1 = nextPairwiseChoiceRs.getInt(1)
                            val habitat2 = nextPairwiseChoiceRs.getInt(2)
                            val questionId = nextPairwiseChoiceRs.getString(3)

                            val winner = if (random.nextBoolean()) habitat1 else habitat2
                            val loser = if (winner == habitat1) habitat2 else habitat1

                            updatePairwiseChoicePs.setObject(1, p.toString())
                            updatePairwiseChoicePs.setString(2, questionId)
                            updatePairwiseChoicePs.setInt(3, winner)
                            updatePairwiseChoicePs.setInt(4, loser)
                            updatePairwiseChoicePs.execute()

                            lastQuestionByPerson[p] = questionId
                        }
                    }
                }
            }
        }
    }
}