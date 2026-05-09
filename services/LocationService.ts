'use cache'

import db from '@/lib/db'

export async function GetLocationNames() : Promise<string[]> {
    const stm = await db.execute(
        `SELECT DISTINCT(location_name)
        FROM monster_locations
        `
    );

    const res = stm.toJSON().rows;

    return res;
}