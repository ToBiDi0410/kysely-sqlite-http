# Kysely SQLite HTTP

Kysely SQLite HTTP allows you to run queries on a remote sqlite database without fetching the entire database by only fetching fragments relevant to the query.
It wraps the [sql.js-httpvfs](https://github.com/phiresky/sql.js-httpvfs) library and provides a simple kysely-compatible interface that is similar to the interface of [sql.js-httpvfs](https://github.com/phiresky/sql.js-httpvfs).

# Features
- 🧵 Runs the queries in a web worker so queries do not block the main thread
- 📂 Only fetches data relevant to the queries, which reduces bandwidth usage
- 🚀 Speeds up queries on remote HTTP(S) databases drastically
- 🔎 Uses SQLite speed-optimizations (such as indices for queries)
- 🛠️ Works with Kysely for creating type-safe queries

# Usage
## Example code
```javascript
import { Kysely } from 'kysely';
import { SqliteHttpDialect } from 'kysely-sqlite-http';
import { type Database } from './database.ts'; //Your database definition

const dialect = new SqliteHttpDialect({
    debug: true,
    /* These options match the ones needed for sql.js-httpvfs */
    maxBytesToRead: 10 * 1024 * 1024,
    fileConfigs: [ 
        {
        from: "inline",
            config: {
                serverMode: "full",
                requestChunkSize: 4096,
                url: "./fancyRemote.db"
            }
        }
    ]
});

export const db = new Kysely<Database>({
    dialect,
});
```
Learn more about the options at https://github.com/phiresky/sql.js-httpvfs/tree/master?tab=readme-ov-file#usage

## Installation
Installable via NPM Repository

```sh
npm install kysely-sqlite-http
# or...
pnpm install kysely-sqlite-http
```

## Optimization
To speed up queries you can run the following queries on your SQLite database:
```sql
-- first, add whatever indices you need. Note that here having many and correct indices is even more important than for a normal database.
pragma journal_mode = delete; -- to be able to actually set page size
pragma page_size = 1024; -- trade off of number of requests that need to be made vs overhead. 

insert into ftstable(ftstable) values ('optimize'); -- for every FTS table you have (if you have any)

vacuum; -- reorganize database and apply changed page size
```
There are other methods to speed up queries, please checkout the actual driver implementation for this.

Learn more at https://github.com/phiresky/sql.js-httpvfs/tree/master?tab=readme-ov-file#usage

# ⚠️ Maintenance notice
This repository was created as part of a private project and therefore, it is <b>not actively maintained!</b><br>
I will do my best to fix bugs as quickly as possible and process your pull requests but i won't be adding new features.

# Credits
- [sql.js-httpvfs](https://github.com/phiresky/sql.js-httpvfs) for creating the SQLite HTTP-VFS driver
- [kysely](https://github.com/kysely-org/kysely) for creating an awesome query builder
- [SQLocal/README.md](https://github.com/DallasHoff/sqlocal/blob/main/README.md) for inspiration on this README