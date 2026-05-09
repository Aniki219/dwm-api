'use cache'

import db from '@/lib/db'
import { Monster } from '@/types/types';

export async function GetMonsters() : Promise<Monster[]> {
    const stm = await db.execute(
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
 
    const res = stm.toJSON().rows.map((r:string[]) => {
        return {name: r[0], family:r[1], stats:r[2]}
    }) as Monster[]
    
    
    for (const monster of res) {
        const stats = ((monster.stats) as unknown) as string;
        monster.stats = JSON.parse(stats);
    }

    return res as Monster[];
}

export async function GetMonster(name : string) : Promise<Monster> {
    const res = await GetMonstersFull(["m.name = ?"], name);

    if (!res || res.length == 0) {
        throw new Error(`Monster not found: ${name}`);
    }
    
    return res[0] as Monster;
}

export async function GetMonstersByFamily(family : string) : Promise<Monster[]> {
    const res = await GetMonstersFull(["m.family = ?"], family);

    if (!res || res.length == 0) {
        throw new Error(`No monsters found for family: ${family}`);
    }
    
    return res as Monster[];
}

export async function GetMonstersFull(wheres: string[] = [], ...params: string[]) : Promise<Monster[]> {
    const stm = await db.execute({
        sql: `
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
            WHERE name NOT LIKE '%FM'
            ${wheres.map(w => ` AND ${w}`)}
            ;
        `,
        args: [...params],
    });

    const data = stm.toJSON();

    const res = data.rows.map((row: Monster[]) => {
        return Object.fromEntries(
            data.columns.map((key: string, i: number) => [key, row[i]])
        );
    }) as Monster[];

    
    res.forEach((monster: Monster) => {
        const moves = ((monster.moves) as unknown) as string;
        const stats = ((monster.stats) as unknown) as string;
        const breeds = ((monster.breeds) as unknown) as string;
        const resistances = ((monster.resistances) as unknown) as string;
        const usedIn = ((monster.usedIn) as unknown) as string;
        
        monster.moves = JSON.parse(moves);
        monster.stats = JSON.parse(stats);
        monster.breeds = JSON.parse(breeds);
        monster.resistances = JSON.parse(resistances);
        monster.usedIn = JSON.parse(usedIn);
    });
    
    return res;
}

export async function GetMonsterNamesByFamily(family: string) : Promise<string[]> {
    const stm = await db.execute({
        sql: `SELECT
            name
        FROM monsters
        WHERE name NOT LIKE '%FM'
            AND family = ?
        `,
        args: [family]
    });

    const res = stm.toJSON().rows as string[];   
    return res;
}

export async function GetMonstersByLocation(location: string) : Promise<{found: string, monsters: string[]}[]> {
    const stm = await db.execute({
        sql: `SELECT
            monsters.name,
            ml.found
        FROM monsters
        JOIN monster_locations ml
            ON monsters.name = ml.monster_name
        WHERE ml.location_name = ?
        ORDER BY ml.location_name, ml.found
        `,
        args: [location]
    });

    const res = stm.rows.map((r) => {
        const obj = {} as Record<string, unknown>;
        stm.columns.forEach((col, i) => {
            obj[col] = r[i];
        });
        return obj as { name: string; found: string };
    });

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

export async function GetMonsterNamesByMove(move: string): Promise<{ monster_names: string[], toMove: string, secondMove: string, thirdMove: string }> {
    const stm = await db.execute({
        sql: `
        WITH RECURSIVE

        AncestorChain(move_name, depth) AS (
            SELECT ?, 0
            UNION ALL
            SELECT mr.value, ac.depth + 1
            FROM move_requirements mr
            JOIN AncestorChain ac ON mr.move_name = ac.move_name
            WHERE mr.stat_name = 'FROM'
        ),

        Root AS (
            SELECT move_name
            FROM AncestorChain
            ORDER BY depth DESC
            LIMIT 1
        ),

        DescendantChain(move_name, pos) AS (
            SELECT move_name, 1 FROM Root
            UNION ALL
            SELECT mr.move_name, dc.pos + 1
            FROM move_requirements mr
            JOIN DescendantChain dc ON mr.value = dc.move_name
            WHERE mr.stat_name = 'FROM'
        ),

        OtherMoves AS (
            SELECT move_name, ROW_NUMBER() OVER (ORDER BY pos) AS rn
            FROM DescendantChain
            WHERE move_name != ?
        )

        SELECT
            mm.monster_name,
            (SELECT move_name FROM OtherMoves WHERE rn = 1) AS toMove,
            (SELECT move_name FROM OtherMoves WHERE rn = 2) AS secondMove,
            (SELECT move_name FROM OtherMoves WHERE rn = 3) AS thirdMove
        FROM monster_moves mm
        WHERE mm.move_name IN (SELECT move_name FROM DescendantChain)
        ORDER BY mm.monster_name
        `,
        args: [move, move]
    });

    interface MoveRow {
        monster_name: string;
        toMove: string;
        secondMove: string;
        thirdMove: string;
    }

    const res = stm.rows.map((r) => {
        const obj = {} as Record<string, unknown>;
        stm.columns.forEach((col, i) => {
            obj[col] = r[i];
        });
        return obj as unknown as MoveRow;
    });

    return {
        monster_names: res.map(row => row.monster_name),
        toMove: res[0]?.toMove ?? "",
        secondMove: res[0]?.secondMove ?? "",
        thirdMove: res[0]?.thirdMove ?? "",
    };
}