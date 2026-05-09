// import Database from 'better-sqlite3';
// import path from 'path';

// // This forces it to the project root
// const dbPath = path.join(process.cwd(), 'dwm-api.db');

// const verbose = false;
// const db = new Database(dbPath, { verbose: (verbose ? console.log : ()=>{} )});


import { createClient } from "@libsql/client";

export const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export default db;