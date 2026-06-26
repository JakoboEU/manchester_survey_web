package eu.jakobo

import com.github.dockerjava.api.model.HostConfig
import org.testcontainers.containers.PostgreSQLContainer
import java.nio.file.Path
import java.sql.DriverManager
import kotlin.io.path.createDirectories

const val BACKUP_TO_USE = "20260608"
const val NUMBER_OF_PERMUTATIONS = 2

fun main() {
    println("Starting postgres.")

    val postgres = PostgreSQLContainer("postgres:16-alpine")
        .withCommand(
            "postgres",
            "-c", "fsync=off",
            "-c", "shared_buffers=1GB",
            "-c", "work_mem=64MB",
            "-c", "maintenance_work_mem=512MB",
            "-c", "effective_cache_size=4GB",
            "-c", "synchronous_commit=off"
        )
        .withDatabaseName("elo_simulation")
        .withUsername("sim_user")
        .withPassword("sim_pass")
        .withCreateContainerCmdModifier { cmd ->
            val hc = cmd.hostConfig ?: HostConfig.newHostConfig()
            hc
                .withNanoCPUs(4_000_000_000L) // 4 CPUs
                .withMemory(8L * 1024 * 1024 * 1024) // 8 GB
                .withShmSize(2L * 1024 * 1024 * 1024)
            cmd.withHostConfig(hc)
        }

    postgres.start()

    println("Postgres started.")

    try {
        val conn = DriverManager.getConnection(
            postgres
                .withUrlParam("prepareThreshold", "1")
                .withUrlParam("reWriteBatchedInserts", "true")
                .jdbcUrl,
            postgres.username,
            postgres.password)
        val bootstrapDb = BootstrapDb(conn)
        bootstrapDb.bootstrap(BACKUP_TO_USE)

        val csvPath = Path.of("..", "supabase", "backups", BACKUP_TO_USE, "resampled")
        csvPath.createDirectories()
        val replayer = Replayer(conn, csvPath)
        replayer.replay(NUMBER_OF_PERMUTATIONS)
    } finally {
        postgres.stop()
    }
}