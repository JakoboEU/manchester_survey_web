package eu.jakobo

data class Question(val questionId: QuestionId, val habitat1Id: Int, val habitat2Id: Int, val muDiff: Double) : Comparable<Question> {
    override fun compareTo(other: Question): Int {
        return this.muDiff.compareTo(other.muDiff)
    }

    fun randomAnswer(): Answer {
        return if (Math.random() < 0.5) {
            Answer(questionId, habitat1Id, habitat2Id)
        } else {
            Answer(questionId, habitat2Id, habitat1Id)
        }
    }
}