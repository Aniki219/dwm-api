'use cache'

import db from '@/lib/db'

export async function GetMoveNames() : Promise<string[]> {
    const stm = await db.execute(
        `SELECT DISTINCT(name)
        FROM moves
        `
    );

    const res = stm.toJSON().rows;
    return res;
}