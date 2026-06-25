package eu.jakobo

import org.testcontainers.shaded.com.google.common.collect.ImmutableList
import java.util.Random
import java.util.stream.IntStream

class PersonQueue(val queue: ImmutableList<String>, val random: Random = Random()) : Iterable<String> {

    class PersonQueueBuilder {
        private val queue: MutableList<String> = mutableListOf()

        fun addPerson(personId: String, expectedRankings: Int): PersonQueueBuilder {
            IntStream.range(0, expectedRankings)
                .forEach { queue.add(personId) }
            return this
        }

        fun build(): PersonQueue {
            return PersonQueue(ImmutableList.copyOf(queue))
        }
    }

    fun shuffle(): PersonQueue {
        val shuffledQueue = queue.toMutableList()
        shuffledQueue.shuffle(random)
        return PersonQueue(ImmutableList.copyOf(shuffledQueue), random)
    }

    override fun iterator(): Iterator<String> {
        return queue.iterator()
    }

    fun queueSize(): Int {
        return queue.size
    }
}