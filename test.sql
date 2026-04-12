SELECT
    m.name,
    m.family,
    stats.*,
    b.*
FROM monsters m
JOIN monster_stats stats
    ON m.name = stats.monster_name
-- JOIN monster_resistances res
--     ON m.name = res.monster_name
JOIN monster_breeds b
    ON b.result_name = m.name
WHERE m.name = 'Andreal'
;