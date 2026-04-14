export const STAT_NAMES = ['MaxLevel', 'Experience', 'HP', 'MP', 'Attack', 'Defense', 'Agility', 'Intelligence', 'From', 'LV'];
export const MOVE_REQS = ['LV', 'HP', 'MP', 'Attack', 'Defense', 'Agility', 'Intelligence', 'From'];

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
