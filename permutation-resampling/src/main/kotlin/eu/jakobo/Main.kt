package eu.jakobo

import org.apache.commons.csv.CSVFormat
import java.nio.file.Files
import java.nio.file.Path
import org.apache.commons.csv.CSVPrinter
import java.util.UUID
import java.util.stream.Stream
import kotlin.io.path.createDirectories

const val BACKUP_TO_USE = "20260608"
const val NUMBER_OF_PERMUTATIONS = 100

private fun dataFile(filename: String) : Path {
    val filePath = Path.of("..", "data", filename).normalize()
    require(Files.exists(filePath)) { "Missing file at: ${filePath.toAbsolutePath()}" }
    return filePath
}

private fun backupFile(filename: String, backupDirectory: String): Path {
    val filePath = Path.of("..", "supabase", "backups", backupDirectory, filename).normalize()
    require(Files.exists(filePath)) { "Missing file at: ${filePath.toAbsolutePath()}" }
    return filePath
}

private fun loadAllDemographics(): List<DemographicValue> {
    Files.newBufferedReader(dataFile("demographics.csv")).use { reader ->
        val csvFormat = CSVFormat.DEFAULT.builder()
            .setHeader()
            .setSkipHeaderRecord(true)
            .build()

        val tuples = mutableListOf<DemographicValue>()
        val records = csvFormat.parse(reader)
        for (record in records) {
            tuples.add(
                DemographicValue(
                    record.get("demographic"),
                    record.get("demographic_value")
                )
            )
        }
        return tuples;
    }
}

const val RESAMPLES = 2

fun main() {

    val personQueue = PersonQueue.readPeopleFromCsv(backupFile("person.csv", BACKUP_TO_USE))
    val personDemographics = PersonDemographics.readPersonDemographics(backupFile("person_demographics.csv", BACKUP_TO_USE))
    val allDemographics = loadAllDemographics()

    val csvPath = Path.of("..", "supabase", "backups", BACKUP_TO_USE, "resampled")
    csvPath.createDirectories()

    for (i in 1..RESAMPLES) {
        val rankings = Rankings.buildHierarchies(allDemographics)
        val people = personQueue.shuffle()

        println("Starting ${i}th run of ${people.queueSize()} rankings")
        for (person in people) {
            val demographics = personDemographics.getDemographicsForPerson(person)
            val nextQuestion = rankings.getNextQuestion(demographics)
            rankings.update(nextQuestion.randomAnswer(), demographics)
        }

        val filePath: Path = csvPath.resolve("${UUID.randomUUID()}.csv")
        rankings.getResults().writeToCsv(filePath)
    }
}

fun Stream<ResultRow>.writeToCsv(filePath: Path) {
    // Define headers explicitly using the builder pattern
    val csvFormat = CSVFormat.DEFAULT.builder()
        .setHeader("demographic", "demographic_value", "habitat_id", "question_id", "mu", "rankings")
        .build()

    // Open FileWriter and CSVPrinter using 'use' for automatic resource management
    Files.newBufferedWriter(filePath).use { fileWriter ->
        CSVPrinter(fileWriter, csvFormat).use { csvPrinter ->
            for (row in this) {
                csvPrinter.printRecord(
                    row.demographic,
                    row.demographicValue,
                    row.habitatId,
                    row.questionId,
                    row.mu,
                    row.rankings
                )
            }
        }
    }
}
