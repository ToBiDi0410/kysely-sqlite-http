import { DatabaseConnection } from "kysely";
import { SplitFileConfig } from "sql.js-httpvfs/dist/sqlite.worker.js";

export interface SqliteHttpConfig {
    fileConfigs: SplitFileConfig[],
    maxBytesToRead: number,
    debug?: boolean,
    onCreateConnection?: (connection: DatabaseConnection) => Promise<void>
}