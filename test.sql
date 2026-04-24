SELECT 
        m.name, 
        m.family,
        (
            SELECT json_group_array(json_object('base', base_name, 'mate', mate_name, 'result', result_name, 'five', plus_five))
            FROM monster_breeds
            WHERE result_name IN (
                SELECT 
                    result_name
                FROM monster_breeds
                WHERE base_name = m.name OR mate_name = m.name
            )
        ) AS used_in 
    FROM monsters m
    WHERE m.name = 'DracoLord2'
;