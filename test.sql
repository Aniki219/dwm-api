WITH Vars AS (
    SELECT (
        SELECT value
        FROM move_requirements
        WHERE stat_name = 'FROM'
            AND move_name = 'WhiteFire'
    ) AS toMove
),
ExtendedVars AS (
    SELECT 
        toMove,
        (
            SELECT value
            FROM move_requirements
            WHERE stat_name = 'FROM'
                AND move_name = toMove
        ) AS secondMove
    FROM Vars
),
DoubleExtendedVars AS (
    SELECT 
        secondMove,
        (
            SELECT value
            FROM move_requirements
            WHERE stat_name = 'FROM'
                AND move_name = secondMove
        ) AS thirdMove
    FROM ExtendedVars
)
SELECT monster_name
FROM monster_moves
WHERE move_name IN (
    SELECT name
    FROM moves, ExtendedVars, DoubleExtendedVars
    WHERE name = ExtendedVars.toMove
       OR name = ExtendedVars.secondMove
       OR name = DoubleExtendedVars.thirdMove
       OR name = 'WhiteFire'
);
