package eu.jakobo

import java.util.stream.Stream

class DemographicHierarchies(val hierarchies: List<Hierarchy>) {
    companion object {
        fun create(): DemographicHierarchies {
            return DemographicHierarchies(
                QuestionId.entries.map { questionId ->
                    Hierarchy(questionId, (0 until 9).map { Ranking(it, 1500.0, 0) })
                }
            )
        }
    }

    fun getQuestions(): Stream<Question> {
        return hierarchies.stream().flatMap { it.getQuestions() }
    }

    fun update(answer: Answer) {
        hierarchies.find { it.questionId == answer.questionId }!!.update(answer)
    }

    fun getResults(demographicValue: DemographicValue): Stream<ResultRow> {
        return hierarchies.stream().flatMap { it.getResults(demographicValue) }
    }
}