package eu.jakobo

import org.apache.commons.csv.CSVFormat
import java.nio.file.Files
import java.nio.file.Path
import java.util.Random
import java.util.stream.IntStream

class PersonQueue(val queue: List<Person>, val random: Random = Random()) : Iterable<Person> {
    companion object {
        fun readPeopleFromCsv(filePath: Path): PersonQueue {
            val personQueueBuilder = PersonQueueBuilder()

            Files.newBufferedReader(filePath).use { reader ->
                val csvFormat = CSVFormat.DEFAULT.builder()
                    .setHeader()
                    .setSkipHeaderRecord(true)
                    .build()

                val records = csvFormat.parse(reader)
                for (record in records) {
                    personQueueBuilder.addPerson(record.get("person_id"), record.get("rankings").toInt())
                }
            }
            return personQueueBuilder.build()
        }
    }

    class PersonQueueBuilder {
        private val queue: MutableList<Person> = mutableListOf()

        fun addPerson(personId: String, expectedRankings: Int): PersonQueueBuilder {
            IntStream.range(0, expectedRankings)
                .forEach { queue.add(Person(personId)) }
            return this
        }

        fun build(): PersonQueue {
            return PersonQueue(queue.toList())
        }
    }

    fun shuffle(): PersonQueue {
        val shuffledQueue = queue.toMutableList()
        shuffledQueue.shuffle(random)
        return PersonQueue(shuffledQueue.toList(), random)
    }

    override fun iterator(): Iterator<Person> {
        return queue.iterator()
    }

    fun queueSize(): Int {
        return queue.size
    }
}