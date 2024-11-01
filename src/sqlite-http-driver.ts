import { Driver } from 'kysely';
import { SqliteHttpConfig } from "./sqlite-http-dialect-config.js";
import { SqliteHttpConnection } from './sqlite-http-connection.js';
import { createDbWorker } from 'sql.js-httpvfs';

const workerUrl = new URL(
  "../../../node_modules/sql.js-httpvfs/dist/sqlite.worker.js",
  import.meta.url,
);

const wasmUrl = new URL(
  "../../../node_modules/sql.js-httpvfs/dist/sql-wasm.wasm",
  import.meta.url,
);

export class SqliteHttpDriver implements Driver {

    readonly config: SqliteHttpConfig;
    worker?: Awaited<ReturnType<typeof createDbWorker>>;

    constructor(config: SqliteHttpConfig) {
      this.config = config;
    }

    async init(): Promise<void> {
      if(this.config.debug) console.log(`[SqliteHttpDriver]`, `Initializing driver...`);
      if(this.config.debug) console.log(`[SqliteHttpDriver]`, `Creating worker with configs...`, this.config.fileConfigs, this.config.maxBytesToRead);
      this.worker = await createDbWorker(
        this.config.fileConfigs,
        workerUrl.toString(),
        wasmUrl.toString(),
        this.config.maxBytesToRead
      );
      if(this.config.debug) console.log(`[SqliteHttpDriver]`, `Created worker!`);
      if(this.config.debug) console.log(`[SqliteHttpDriver]`, `Driver is ready!`);
    }
  
    async acquireConnection(): Promise<SqliteHttpConnection> {
      return new SqliteHttpConnection(this);
    }
  
    async beginTransaction(): Promise<void> {
      throw new Error("Dialect does not support transactions");
    }
  
    async commitTransaction(): Promise<void> {
      throw new Error("Dialect does not support transactions");
    }
  
    async rollbackTransaction(): Promise<void> {
      throw new Error("Dialect does not support transactions");
    }
  
    async releaseConnection(): Promise<void> {}
  
    async destroy(): Promise<void> {
      throw new Error("Dialect cannot be destroyed");
    }
}