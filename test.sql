SELECT 
    m.name, 
    m.family,
    (
        SELECT json_group_object(stat_name, value) 
        FROM monster_stats 
        WHERE monster_name = m.name
    ) AS stats    
FROM monsters m
WHERE m.name = 'Grizzly'
;