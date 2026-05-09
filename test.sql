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
WHERE m.name NOT LIKE '%FM'
LIMIT 5
;