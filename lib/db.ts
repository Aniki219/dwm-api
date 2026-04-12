import Database from 'better-sqlite3';
import path from 'path';

// This forces it to the project root
const dbPath = path.join(process.cwd(), 'dwm-api.db');

const verbose = false;
const db = new Database(dbPath, { verbose: (verbose ? console.log : ()=>{} )});

export default db;