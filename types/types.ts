export const STAT_NAMES = ['MaxLevel', 'Experience', 'HP', 'MP', 'Attack', 'Defense', 'Agility', 'Intelligence'];

export type Stat = {
    [K in string]: number
}

export type Monster = {
    name: string
    family: string
    stats: Stat
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