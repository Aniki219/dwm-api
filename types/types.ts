export const STAT_NAMES = ['MAX', 'EXP', 'HP', 'MP', 'ATK', 'DEF', 'AGL', 'INT', 'FROM', 'LV'];
export const MOVE_REQS = ['LV', 'HP', 'MP', 'ATK', 'DEF', 'AGL', 'INT', 'FROM'];
export const RES_NAMES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Æ'];

export type Stats = {
    [K in string]: number
}

export type Monster = {
    name: string
    family: string
    stats: Stats
    moves: string[]
    resistances: number[]
    breeds: Breed[]
}

export type Breed = {
    base: string[],
    mate: string[],
}

export type Family = {
    [monsterName: string]: Monster
}

export type MonsterData = {
    families: {
        [familityName: string]: Family
    }
}

export type MoveRequirements = {
    [moveName: string] : string[]
}

export type ResistanceData = {
    [K in string]: string[]
}
