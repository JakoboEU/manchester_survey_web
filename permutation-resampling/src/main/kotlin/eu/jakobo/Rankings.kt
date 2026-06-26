package eu.jakobo

import java.util.stream.Stream

class Rankings(val rankings: Map<DemographicValue, DemographicHierarchies>) {
    fun getNextQuestion(demographics: List<DemographicValue>): Question {
        val candidates = rankings.filter {
            demographics.contains(it.key)
        }.values.stream().flatMap {
            it.getQuestions()
        }.sorted().toList()

        val minMu = candidates.min().muDiff
        return candidates.filter { it.muDiff == minMu }
            .shuffled()
            .first()
    }

    fun update(answer: Answer, demographics: List<DemographicValue>) {
        rankings.filter {
            demographics.contains(it.key)
        }.values.forEach { it.update(answer)}
    }

    fun getResults() : Stream<ResultRow> {
        return rankings.entries.stream().flatMap { entry ->
            entry.value.getResults(entry.key)
        }
    }

    companion object {
        fun buildHierarchies(allDemographics: List<DemographicValue>):Rankings {
            val rankings = mutableMapOf<DemographicValue, DemographicHierarchies>()
            for (demographic in allDemographics) {
                rankings[demographic] = DemographicHierarchies.create()
            }
            return Rankings(rankings)
        }
    }
}
