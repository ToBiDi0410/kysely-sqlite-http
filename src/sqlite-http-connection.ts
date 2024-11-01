import { CompiledQuery, DatabaseConnection, QueryResult } from "kysely";
import { SqliteHttpDriver } from "./sqlite-http-driver.js";

export class SqliteHttpConnection implements DatabaseConnection {

    driver: SqliteHttpDriver;

    constructor(driver: SqliteHttpDriver) {
      this.driver = driver;
    }

    async executeQuery<R>(compiledQuery: CompiledQuery): Promise<QueryResult<R>> {
      if(this.driver.config.debug) console.log(`[SqliteHttpConnection]`, `Query run: '${compiledQuery.sql}' with`, compiledQuery.parameters);
      if(compiledQuery.sql.split(" ")[0] != "select") throw new Error("Dialect does not support query type (only supports [SELECT])");
      if(!this.driver.worker) throw new Error("Database not ready");
      const res = await (this.driver.worker.db as any).exec(compiledQuery.sql, compiledQuery.parameters);
      if(this.driver.config.debug) console.log(`[SqliteHttpConnection]`, `Query result`, res);
      const transformedRes = this.transformRes<R>(res);
      if(this.driver.config.debug) console.log(`[SqliteHttpConnection]`, `Transformed result`, transformedRes);
      return transformedRes;
    }

    transformRes<R>(result: any): QueryResult<R> {
      const rows:any[] = [];
      if(result.length > 0) {
        const rowResult = result[0];
        for(let rowNum = 0; rowNum < rowResult.values.length; rowNum++) {
          const obj:any = {};
          for(let columnNum=0; columnNum<rowResult.columns.length; columnNum++) {
            obj[rowResult.columns[columnNum]] = rowResult.values[rowNum][columnNum];
          }
          rows.push(obj);
        }
      }
      return {
        rows,
      };
    }

    rowToObject(row: any) {
      const obj:any = {};
      for(let i=0; i<row.columns.length; i++) {
        obj[row.columns[i]] = row.values[i];
      }
      return obj;
    }

    streamQuery<R>(compiledQuery: CompiledQuery, chunkSize?: number): AsyncIterableIterator<QueryResult<R>> {
      throw new Error("Dialect does not support query streaming");
    }
}