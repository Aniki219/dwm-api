import db from '@/lib/db'
import { promises as fs } from 'fs';
import { Monster, MonsterData, MOVE_REQS, MoveRequirements, ResistanceData, STAT_NAMES } from '@/types/types';

const tables = [
    "monster_moves",
    "monster_stats",
    "monster_resistances",
    "move_requirements",
    "resistance_moves",
    "monster_breeds",

    "monsters",
    "moves",
    "stats",
    "resistances"
];

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

        CREATE TABLE IF NOT EXISTS monsters (
            name TEXT PRIMARY KEY,
            family TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS monster_breeds (
            base_name TEXT REFERENCES monsters(name),
            mate_name TEXT REFERENCES monsters(name),
            result_name TEXT REFERENCES monsters(name),
            plus_five BOOLEAN DEFAULT false,
            PRIMARY KEY (base_name, mate_name, plus_five)
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

        CREATE TABLE IF NOT EXISTS move_requirements (
            move_name TEXT REFERENCES moves(name),
            stat_name TEXT REFERENCES stats(name),
            value TEXT,
            PRIMARY KEY (move_name, stat_name)
        );

        CREATE TABLE IF NOT EXISTS resistance_moves (
            resistance_name TEXT REFERENCES resistances(name),
            move_name TEXT REFERENCES moves(name),
            PRIMARY KEY (resistance_name, move_name)
        )
    `);

    const monsterData = await readData<MonsterData>('MonsterData');
    const moveData = await readData<MoveRequirements>('Moves');
    const resistanceData = await readData<ResistanceData>('Resistances');

    const insertMonster = db.prepare('INSERT INTO monsters (name, family) VALUES (?, ?)');
    const insertStat = db.prepare('INSERT INTO stats (name) VALUES (?)');
    const insertMove = db.prepare('INSERT INTO moves (name) VALUES (?)');
    const insertResistance = db.prepare('INSERT INTO resistances (name) VALUES (?)');
    const insertMonsterStat = db.prepare('INSERT INTO monster_stats (monster_name, stat_name, value) VALUES (?, ?, ?)');
    const insertMonsterBreeds = db.prepare('INSERT INTO monster_breeds (base_name, mate_name, result_name, plus_five) VALUES (?, ?, ?, ?)');
    const insertMoveRequirement = db.prepare('INSERT INTO move_requirements (move_name, stat_name, value) VALUES (?, ?, ?)');
    const insertMonsterMove = db.prepare('INSERT INTO monster_moves (monster_name, move_name) VALUES (?, ?)');
    const insertMonsterResistance = db.prepare('INSERT INTO monster_resistances (monster_name, resistance_name, value) VALUES (?, ?, ?)');
    const insertResistanceMove = db.prepare('INSERT INTO resistance_moves (resistance_name, move_name) VALUES (?, ?)');

    const transaction = db.transaction((monsterData: MonsterData) => {
        // Stats
        for (const stat of STAT_NAMES) {
            insertStat.run(stat);
        }

        // Moves
        for (const move in moveData) {
            insertMove.run(move);

            // Move Requirements
            const moveStats = moveData[move];
            for (let i = 0; i < MOVE_REQS.length; i++) {
                const statName = MOVE_REQS[i];
                const value = moveStats[i];

                if (value) {
                    insertMoveRequirement.run(move, statName, value);
                }
            }
        }

        // Resistances
        for (const resName in resistanceData) {
            insertResistance.run(resName);
            for (const move of resistanceData[resName]) {
                insertResistanceMove.run(resName, move);
            }
        }

        // Family Monsters
        for (const f of ["SLIMEFM", "DRAGONFM", "BEASTFM", "BUGFM", "PLANTFM", "BIRDFM", "MATERIALFM", "ZOMBIEFM", "DEVILFM", "WATERFM", "BOSSFM"]) {
            let family = f.split("FM")[0];
            family = family.slice(0, 1).concat(family.slice(1).toLowerCase());
            insertMonster.run(f, family);
        }
        
        // Monsters
        for (const f in monsterData.families) {
            for (const m in monsterData.families[f]) {
                const {name, family, stats, moves, resistances} = monsterData.families[f][m] as Monster;
                insertMonster.run(name, family);
                
                // Monster Stats
                for (const stat in stats) {
                    if (stats[stat] == null) continue;
                    insertMonsterStat.run(name, stat, stats[stat])
                }
                
                // Monster Moves
                for (const move of moves) {
                    insertMonsterMove.run(name, move);
                }

                // Monster Resitances
                for (let i = 0; i < resistances.length; i++) {
                    const resName = Object.keys(resistanceData)[i];
                    const value = resistances[i];

                    insertMonsterResistance.run(name, resName, value);
                }
            }
        }

        // Monster Breeds
        let count = 0;
        for (const f in monsterData.families) {
            for (const m in monsterData.families[f]) {
                const {name, breeds} = monsterData.families[f][m] as Monster;
                for (const breedPair of breeds) {
                    for (const base of breedPair.base) {
                        for (let mate of breedPair.mate) {
                            count++;
                            let plusFive = 0;
                            if (mate.match("†5")) {
                                mate = mate.split("†5")[0];
                                plusFive = 1;
                            }                            
                            insertMonsterBreeds.run(base, mate, name, plusFive);
                        }
                    }
                }
            }
        }
        console.log(`Inserted ${count} breeds`)
    });

    transaction(monsterData);
};

async function readData<T>(fn: string): Promise<T> {
  try {
    const data = await fs.readFile(`data/${fn}.json`, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Failed to read or parse ${fn}.json: ${err}`);
  }
}

seed();