'use cache'

import db from '@/lib/db'

export async function GetFamilyNames() : Promise<string[]> {
    const stm = await db.execute(
        `SELECT DISTINCT(family)
        FROM monsters
        `
    );

    const res = stm.toJSON().rows;

    console.log(res.map((r:string[]) => r[0]))

    return res.map((r:string[]) => r[0]);
}