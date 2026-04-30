import db from '@/lib/db'

export async function GetLocationNames() : Promise<string[]> {
    const stm = db.prepare(
        `SELECT DISTINCT(location_name)
        FROM monster_locations
        `
    );

    const res = stm.all() as { location_name: string }[];

    return res.map(row => row.location_name);
}