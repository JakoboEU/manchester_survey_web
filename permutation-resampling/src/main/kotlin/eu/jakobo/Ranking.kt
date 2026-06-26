package eu.jakobo

data class Ranking(val habitatId: Int, var mu: Double, var rankings: Int) {

    fun appendMu(muDelta: Double) : Ranking {
        return Ranking(this.habitatId, this.mu + muDelta, this.rankings + 1)
    }
}