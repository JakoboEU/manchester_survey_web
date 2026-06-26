package eu.jakobo

import org.apache.commons.csv.CSVFormat
import java.nio.file.Files
import java.nio.file.Path

class PersonDemographics(val demographicsByPerson: Map<String, List<DemographicValue>>) {
    companion object {
        fun readPersonDemographics(filePath: Path): PersonDemographics {
            data class Tuple (val personId: String, val demographic: String, val demographicValue: String) {}

            Files.newBufferedReader(filePath).use { reader ->
                val csvFormat = CSVFormat.DEFAULT.builder()
                    .setHeader()
                    .setSkipHeaderRecord(true)
                    .build()

                val tuples = mutableListOf<Tuple>()
                val records = csvFormat.parse(reader)
                for (record in records) {
                    tuples.add(Tuple(
                        record.get("person_id"),
                        record.get("demographic"),
                        record.get("demographic_value")
                    ))
                }

                return PersonDemographics(tuples.groupBy(
                        keySelector = { it.personId },
                        valueTransform = { DemographicValue(it.demographic, it.demographicValue) }
                    )
                )
            }
        }
    }

    fun getDemographicsForPerson(person: Person): List<DemographicValue> {
        return this.demographicsByPerson[person.personId] ?: emptyList()
    }
}