import Database from 'better-sqlite3';
import path from 'path';

// This forces it to the project root
const dbPath = path.join(process.cwd(), 'dwm-api.db');
const db = new Database(dbPath, { verbose: console.log });

export default db;