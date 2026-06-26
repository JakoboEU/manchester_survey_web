package eu.jakobo

import org.testcontainers.shaded.com.google.common.collect.ImmutableList
import java.util.Random
import java.util.stream.IntStream

class PersonQueue(val queue: ImmutableList<Person>, val random: Random = Random()) : Iterable<Person> {

    class PersonQueueBuilder {
        private val queue: MutableList<Person> = mutableListOf()

        fun addPerson(personId: String, expectedRankings: Int): PersonQueueBuilder {
            IntStream.range(0, expectedRankings)
                .forEach { queue.add(Person(personId)) }
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

    override fun iterator(): Iterator<Person> {
        return queue.iterator()
    }

    fun queueSize(): Int {
        return queue.size
    }
}