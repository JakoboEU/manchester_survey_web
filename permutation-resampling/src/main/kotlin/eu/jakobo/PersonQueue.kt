package eu.jakobo

import org.testcontainers.shaded.com.google.common.collect.ImmutableList
import java.util.Random
import java.util.stream.IntStream

class PersonQueue(val queue: ImmutableList<String>) {

    class PersonQueueBuilder {
        private val queue: MutableList<String> = mutableListOf()

        fun addPerson(personId: String, expectedRankings: Int): PersonQueueBuilder {
            IntStream.range(0, expectedRankings)
                .forEach { queue.add(personId) }
            return this
        }

        fun build(): PersonQueue {
            queue.shuffle(Random())
            return PersonQueue(ImmutableList.copyOf(queue))
        }
    }

    fun personIdAt(index: Int): String {
        return queue[index]
    }

    fun queueSize(): Int {
        return queue.size
    }
}