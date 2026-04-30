import db from '@/lib/db'
import { Family, Monster } from '@/types/types';

export async function GetMonsters() : Promise<Monster[]> {
    const stm = db.prepare(
        `SELECT
            name,
            family,
            (
                SELECT json_group_object(stat_name, value)
                FROM monster_stats 
                WHERE monster_name = monsters.name
            ) AS stats
        FROM monsters
        WHERE name NOT LIKE '%FM'
        `
    );

    const res = stm.all() as Monster[];
    
    for (const monster of res) {
        const stats = ((monster.stats) as unknown) as string;
        monster.stats = JSON.parse(stats);
    }

    return res as Monster[];
}

export async function GetMonster(name : string) : Promise<Monster> {
    const stm = db.prepare(`
        SELECT 
            m.name, 
            m.family,
            (
                SELECT json_group_object(stat_name, value) 
                FROM monster_stats 
                WHERE monster_name = m.name
            ) AS stats,
            (
                SELECT json_group_array(value)
                FROM monster_resistances
                WHERE monster_name = m.name
            ) AS resistances,
            (
                SELECT json_group_array(move_name) 
                FROM monster_moves 
                WHERE monster_name = m.name
            ) AS moves,
            (
                SELECT location_name
                FROM monster_locations 
                WHERE monster_name = m.name
            ) AS location,
            (
                SELECT found
                FROM monster_locations 
                WHERE monster_name = m.name
            ) AS found,
            (
                SELECT json_group_array(json_object('base', base_name, 'mate', mate_name, 'five', plus_five))
                FROM monster_breeds
                WHERE result_name = m.name
            ) AS breeds,
            (
                SELECT json_group_array(json_object('base', base_name, 'mate', mate_name, 'result', result_name, 'five', plus_five))
                FROM monster_breeds
                WHERE result_name IN (
                    SELECT 
                        result_name
                    FROM monster_breeds
                    WHERE base_name = m.name OR mate_name = m.name
                )
            ) AS usedIn     
        FROM monsters m
        WHERE m.name = ?
        ;
    `);

    const res = stm.get(name) as Monster;

    const moves = ((res.moves) as unknown) as string;
    const stats = ((res.stats) as unknown) as string;
    const breeds = ((res.breeds) as unknown) as string;
    const resistances = ((res.resistances) as unknown) as string;
    const usedIn = ((res.usedIn) as unknown) as string;

    res.moves = JSON.parse(moves);
    res.stats = JSON.parse(stats);
    res.breeds = JSON.parse(breeds);
    res.resistances = JSON.parse(resistances);
    res.usedIn = JSON.parse(usedIn)

    // console.log(res.usedIn)
    
    return res;
}

export async function GetMonsterNamesByFamily(family: string) : Promise<string[]> {
    const stm = db.prepare(
        `SELECT
            name
        FROM monsters
        WHERE name NOT LIKE '%FM'
            AND family = ?
        `
    );

    const res = stm.all(family) as { name: string }[];   
    return res.map(row => row.name);
}

export async function GetMonstersByLocation(location: string) : Promise<{found: string, monsters: string[]}[]> {
    const stm = db.prepare(
        `SELECT
            monsters.name,
            ml.found
        FROM monsters
        JOIN monster_locations ml
            ON monsters.name = ml.monster_name
        WHERE ml.location_name = ?
        ORDER BY ml.location_name, ml.found
        `
    );

    const res = stm.all(location) as {name: string, found: string}[];
    const monstersByFound = new Map<string, string[]>();
    res.forEach(({name, found}) => {
        if (monstersByFound.get(found)) {
            monstersByFound.get(found)?.push(name);
        } else {
             monstersByFound.set(found, [name]);
        }
    });

    const foundMonsters = Array.from(monstersByFound).map(([found, monsters]) => {
        return { found, monsters }
    })

    return foundMonsters;
}

export async function GetMonsterNamesByMove(move: string) : Promise<{ monster_names: string[], toMove: string, secondMove: string, thirdMove: string }> {
    const stm = db.prepare(
        `
            WITH Vars AS (
                SELECT (
                    SELECT value
                    FROM move_requirements
                    WHERE stat_name = 'FROM'
                        AND move_name = ?
                ) AS toMove
            ),
            ExtendedVars AS (
                SELECT 
                    toMove,
                    (
                        SELECT value
                        FROM move_requirements
                        WHERE stat_name = 'FROM'
                            AND move_name = toMove
                    ) AS secondMove
                FROM Vars
            ),
            DoubleExtendedVars AS (
                SELECT 
                    secondMove,
                    (
                        SELECT value
                        FROM move_requirements
                        WHERE stat_name = 'FROM'
                            AND move_name = secondMove
                    ) AS thirdMove
                FROM ExtendedVars
            )
            SELECT 
                monster_name,
                ExtendedVars.toMove,
                ExtendedVars.secondMove,
                DoubleExtendedVars.thirdMove
            FROM monster_moves, ExtendedVars, DoubleExtendedVars
            WHERE move_name IN (
                SELECT 
                    name
                FROM moves, ExtendedVars, DoubleExtendedVars
                WHERE name = ExtendedVars.toMove
                OR name = ExtendedVars.secondMove
                OR name = DoubleExtendedVars.thirdMove
                OR name = ?
            )
            ORDER BY monster_name
            ;
        `
    );

    const res = stm.all(move, move) as { monster_name: string, toMove: string, secondMove: string, thirdMove: string}[];

    return { 
        monster_names: res.map(row => row.monster_name),
        toMove: res[0]?.toMove,
        secondMove: res[0]?.secondMove,
        thirdMove: res[0]?.thirdMove,
    };
}