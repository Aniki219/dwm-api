import db from '@/lib/db'

export async function GetMoveNames() : Promise<string[]> {
    const stm = db.prepare(
        `SELECT DISTINCT(name)
        FROM moves
        `
    );

    const res = stm.all() as { name: string }[];
    return res.map(row => row.name);
}