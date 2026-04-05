import fs from 'fs';

const STAT_NAMES = ['MaxLevel', 'Experience', 'HP', 'MP', 'Attack', 'Defense', 'Agility', 'Intelligence'];

type Stat = {
    [K in string]: number
}

type Monster = {
    name: string,
    stats: Stat
    moves: string[]
    resistances: number[]
}

type Family = {
    [monsterName: string]: Monster
}

type MonsterData = {
    families: {
        [familityName: string]: Family
    }
}

type Breeds = {
    base: string,
    mate: string,
}

function parseMonsterData() {
    const text = fs.readFileSync('data\\AmbiosGuide.txt', 'utf-8');
    const lines = text.split('\n');

    const data: MonsterData = { families: {} };
    let currentFamily: string = "";
    let currentHeader: string = "";
    let prevLineWasEquals: boolean = false;

    for (const line of lines) {
        // Match family headers like "i. Slime Family"
        const familyMatch = line.match(/^[ivxIVX]+\. (.+ Family)/);
        if (line.match(/Misc\. Monsters/)) {
            break;
        }

        // Strip carriage returns
        const cleanLine = line.replace(/\r/g, '').replace(/-/g, '');

        // Skip separator lines and header rows
        if (cleanLine.match(/^-+$/) || cleanLine.match(/^Name\s+/)) continue;

        // Skip empty lines
        if (cleanLine.trim() === '') continue;

        if (cleanLine.match(/^=+$/)) {
            if (prevLineWasEquals) {
                // This is the closing ===, reset flag
                prevLineWasEquals = false;
            } else {
                // This is the opening ===, set flag
                prevLineWasEquals = true;
            }
            continue;
        }

        // If previous line was opening ===, this line is the header title
        if (prevLineWasEquals) {
            currentHeader = cleanLine.trim();
            continue;
        }

        if (familyMatch) {
            currentFamily = familyMatch[1]; // e.g. "Slime Family"
            if (!data.families[currentFamily]) {
                data.families[currentFamily] = {};
            }
            continue;
        }

        if (currentHeader != "") {
            const splits = cleanLine.split(/\s+/)
            if (!splits[0]) continue;
            if (!data.families[currentFamily]) continue;
            if (currentHeader == "MONSTER DATA") {
                const stats = {} as Stat;
                STAT_NAMES.forEach((name, i) => {
                    stats[name] = parseInt(splits[i + 1]);
                });
                data.families[currentFamily][splits[0] as string] = {
                    name: splits[0],
                    stats: stats,
                    moves: splits.slice(9, 12),
                    resistances: []
                };
            }
            if (currentHeader == "MONSTER RESISTANCES") {
                // console.log(currentFamily + " - " + splits[0] + ": " + (data.families[currentFamily][splits[0] as string] ? "exists" : "does not"));
                if (data.families[currentFamily][splits[0] as string]) {
                    data.families[currentFamily][splits[0] as string].resistances =
                        splits.slice(1, 28).map(x => parseInt(x));
                }
            }
        }
    }

    // console.clear();
    // console.log(data);

    return data;
}

function parseBreedsData() {
    const text = fs.readFileSync('data\\JimeousGuide.txt', 'utf-8');
    const lines = text.split('\n');

    let currentMonster = "";

    for (const line of lines) {
        const monster = line.match(/\|  ([A-Z]+)\s*:/);
        if (monster) {
            currentMonster = monster[1];
            continue;
        }

        const baseMatePair = line.match(/¦ ([A-Z ]+)\s*¦ ([A-Z ]+)¦/i)
        if (baseMatePair && baseMatePair[1].trim() != "Base") {
            console.log(
                {
                    monster: {
                        name: currentMonster,
                        bases: baseMatePair[1].trim().split(" "),
                        mates: baseMatePair[2].trim().split(" "),
                    }
                }
            )
        }
    }
}

export default function Home() {
    //parseMonsterData();
    parseBreedsData();
    return (
        <div>

        </div>
    );
}
