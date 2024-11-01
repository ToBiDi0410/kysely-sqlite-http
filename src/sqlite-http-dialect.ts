import { DatabaseIntrospector, Dialect, DialectAdapter, Driver, Kysely, QueryCompiler, SqliteAdapter, SqliteIntrospector, SqliteQueryCompiler } from "kysely";
import { SqliteHttpConfig } from "./sqlite-http-dialect-config.js";
import { SqliteHttpDriver } from "./sqlite-http-driver.js";

export class SqliteHttpDialect implements Dialect {

    readonly #config: SqliteHttpConfig;
  
    constructor(config: SqliteHttpConfig) {
      this.#config = Object.assign({}, config);
    }
  
    createDriver(): Driver {
      return new SqliteHttpDriver(this.#config);
    }
  
    createQueryCompiler(): QueryCompiler {
      return new SqliteQueryCompiler();
    }
    
    createAdapter(): DialectAdapter {
      return new SqliteAdapter();
    }
  
    createIntrospector(db: Kysely<any>): DatabaseIntrospector {
      return new SqliteIntrospector(db);
    }
}