package eu.jakobo

import java.util.stream.Stream
import kotlin.math.abs
import kotlin.math.pow

const val k: Double = 24.0

data class Hierarchy(val questionId: QuestionId, val hierarchy: List<Ranking>) {
    fun getQuestions(): Stream<Question> {
        return hierarchy.flatMap { ranking1 ->
            hierarchy
                .filter { ranking2 -> ranking1.habitatId < ranking2.habitatId }
                .map { ranking2 ->
                    Question(
                        questionId,
                        ranking1.habitatId,
                        ranking2.habitatId,
                        abs(ranking1.mu - ranking2.mu)
                    )
                }
        }.stream()
    }

    fun update(answer: Answer) {
        val winner = hierarchy.find{ it.habitatId == answer.winner }!!
        val loser = hierarchy.find{ it.habitatId == answer.loser }!!
        val expectedWin = 1.0 / (1.0 + 10.0.pow((loser.mu - winner.mu) / 400.0))

        val deltaWinner = k * (1.0 - expectedWin)
        val deltaLoser = -k * expectedWin

        winner.mu += deltaWinner
        winner.rankings += 1
        loser.mu += deltaLoser
        loser.rankings += 1
    }

    fun getResults(demographicValue: DemographicValue): Stream<ResultRow> {
        return hierarchy.stream().map { ranking ->
            ResultRow(
                demographicValue.demographic,
                demographicValue.value,
                ranking.habitatId,
                questionId.questionId,
                ranking.mu,
                ranking.rankings
            )
        }
    }
}