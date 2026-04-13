import db from '@/lib/db'
import { Monster } from '@/types/types';

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
                SELECT json_group_array(json_object('base', base_name, 'mate', mate_name, 'five', plus_five))
                FROM monster_breeds
                WHERE result_name = m.name
            ) AS breeds       
        FROM monsters m
        WHERE m.name = ?
        ;
    `);

    const res = stm.get(name) as Monster;

    const moves = ((res.moves) as unknown) as string;
    const stats = ((res.stats) as unknown) as string;
    const breeds = ((res.breeds) as unknown) as string;
    res.moves = JSON.parse(moves);
    res.stats = JSON.parse(stats);
    res.breeds = JSON.parse(breeds);
    
    return res;
}