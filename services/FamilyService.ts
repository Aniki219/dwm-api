'use cache'

import db from '@/lib/db'

export async function GetFamilyNames() : Promise<string[]> {
    const stm = db.prepare(
        `SELECT DISTINCT(family)
        FROM monsters
        `
    );

    const res = stm.all() as { family: string }[];

    return res.map(row => row.family);
}