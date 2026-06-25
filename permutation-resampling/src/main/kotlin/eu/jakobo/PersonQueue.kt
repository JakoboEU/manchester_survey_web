package eu.jakobo

import java.util.stream.IntStream

class PersonQueue {
    val queue: MutableList<String> = mutableListOf()

    fun addPerson(personId: String, expectedRankings: Int) {
        IntStream.range(0, expectedRankings)
            .forEach { queue.add(personId) }
    }

    fun queueSize(): Int {
        return queue.size
    }
}