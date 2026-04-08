import Database from 'better-sqlite3';
import path from 'path';
import { promises as fs } from 'fs';
import { Monster, MonsterData } from '@/types/types';

const db = new Database(path.join(process.cwd(), 'dwm.db'));
const tables = ["monsters", "stats", "resistances", "moves"]; //do we need to include the join tables?

async function seed() {
    
    for (const tableName of tables) {
        db.exec(`DROP TABLE IF EXISTS ${tableName};`);
    }

    db.exec('PRAGMA foreign_keys = ON;')

    db.exec(`
        CREATE TABLE IF NOT EXISTS stats (
            name TEXT PRIMARY KEY
        );
        
        CREATE TABLE IF NOT EXISTS resistances (
            name TEXT PRIMARY KEY
        );

        CREATE TABLE IF NOT EXISTS moves (
            name TEXT PRIMARY KEY
        );

        CREATE TABLE IF NOT EXISTS resistance_moves (
            resistance_name TEXT REFERENCES resistances(name),
            move_name TEXT REFERENCES moves(name),
            PRIMARY KEY (resistance_name, move_name)
        );

        CREATE TABLE IF NOT EXISTS monsters (
            name TEXT PRIMARY KEY,
            family TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS monster_moves (
            monster_name TEXT REFERENCES monsters(name),
            move_name TEXT REFERENCES moves(name),
            PRIMARY KEY (monster_name, move_name)
        );

        CREATE TABLE IF NOT EXISTS monster_stats (
            monster_name TEXT REFERENCES monsters(name),
            stat_name TEXT REFERENCES stats(name),
            value INT NOT NULL,
            PRIMARY KEY (monster_name, stat_name)
        );

        CREATE TABLE IF NOT EXISTS monster_resistances (
            monster_name TEXT REFERENCES monsters(name),
            resistance_name TEXT REFERENCES resistances(name),
            value INT NOT NULL,
            PRIMARY KEY (monster_name, resistance_name)
        );
    `);

    const raw = await readMonsterData();

    const insertMonster = db.prepare('INSERT INTO monsters (name, family) VALUES (?, ?)');

    const transaction = db.transaction((monsterData: MonsterData) => {
        for (const f in monsterData.families) {
            for (const m in monsterData.families[f]) {
                const {name, family} = monsterData.families[f][m] as Monster;
                insertMonster.run(name, family);

                // "SKILL", "LV", "HPs", "MPs", "ATK", "DEF", "AGL", "INT", "FROM"
            }
        }
    });

    transaction(raw);
};

async function readMonsterData(): Promise<MonsterData> {
  try {
    const data = await fs.readFile('data/MonsterData.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Failed to read or parse monster data: ${err}`);
  }
}

seed();