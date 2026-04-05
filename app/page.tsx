import fs from 'fs';

const STAT_NAMES = ['MaxLevel', 'Experience', 'HP', 'MP', 'Attack', 'Defense', 'Agility', 'Intelligence'];

type Stat = {
    [K in string]: number
}

type Monster = {
    name: string
    stats: Stat
    moves: string[]
    resistances: number[]
    breeds: Breed[]
}

type Family = {
    [monsterName: string]: Monster
}

type MonsterData = {
    families: {
        [familityName: string]: Family
    }
}

type Breed = {
    base: string[],
    mate: string[],
}

const data: MonsterData = { families: {} };

function parseMonsterData() {
    const text = fs.readFileSync('data/AmbiosGuide.txt', 'utf-8');
    const lines = text.split('\n');

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
            currentFamily = familyMatch[1].toUpperCase(); // e.g. "Slime Family"
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
                data.families[currentFamily][splits[0].toUpperCase()] = {
                    name: splits[0],
                    stats: stats,
                    moves: splits.slice(9, 12),
                    resistances: [],
                    breeds: new Array<Breed>()
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
}

function parseBreedsData() {
    const text = fs.readFileSync('data/JimeousGuide.txt', 'utf-8');
    const lines = text.split('\n');

    let currentFamily = "";
    let currentMonster = "";
    let baseMateRow = 0;

    for (const line of lines) {
        const monster = line.match(/\|  ([A-Z]+)\s*:/);
        if (monster) {
            currentMonster = monster[1];
            continue;
        }

        if (line.match(/-+\^-+/)) {
            currentMonster = "";
            baseMateRow = 0;
        }

        const familyMatch = line.match(/_\|[ 0-9\.]+([A-Z\?]+ FAMILY)/);
        if (familyMatch) {
            currentFamily = familyMatch[1];
        }

        if (currentMonster == "") continue;

        const baseMates = data.families[currentFamily][currentMonster]?.breeds;
        if (!baseMates) continue;

        const baseMatePair = line.match(/¦ ([A-Z 1-5†]+)\s*¦\s*([A-Z 1-5†]+)¦/i);
        if (baseMatePair) {
            if (baseMatePair[1].trim() == "Base") {
                baseMateRow = 0;
                continue;
            }

            const bases = baseMatePair[1].trim().split(" ");
            const mates = baseMatePair[2].trim().split(" ");

            //console.log(baseMates[0]);

            if (bases && bases[0] != '') {
                const r = baseMates[baseMateRow] as Breed;
                if (!r) {
                    r.push({base:[], mate:[]});
                }
                r.base = baseMates[baseMateRow].base.concat(bases);
            }
            // if (mates && mates[0] != '') {
            //     baseMates[baseMateRow].mate = baseMates[baseMateRow].base.concat(mates);
            // }
        }

        if (line.match(/¦-+\+-+¦/)) {
            baseMateRow++;
        }
    }
}

export default function Home() {
    console.clear();
    parseMonsterData();
    parseBreedsData();

    // console.log(data);
    //
    return (
        <div>

        </div>
    );
}
