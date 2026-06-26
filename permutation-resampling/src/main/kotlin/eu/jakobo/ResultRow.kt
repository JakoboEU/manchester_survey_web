package eu.jakobo

data class ResultRow(
    val demographic: String,
    val demographicValue: String,
    val habitatId: Int,
    val questionId: String,
    val mu: Double,
    val rankings: Int)