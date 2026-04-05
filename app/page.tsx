import fs from 'fs';

type Stat = {
    value: number
}

type Monster = {
    name: string,
    stats: Stat[]
    moves: string[]
    resistances: number[]
}

type Family = {
    [monsterName: string]: Monster
}

type Section = {
    families: {
        [familityName: string]: Family
    }
}

type MonsterData = {
    [headerName: string]: Section
}

function parseMonsterData() {
    const text = fs.readFileSync('data\\AmbiosGuide.txt', 'utf-8');
    const lines = text.split('\n');

    const data: MonsterData = {};
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
            data[currentHeader] = { families: {} };
            continue;
        }

        if (familyMatch) {
            currentFamily = familyMatch[1]; // e.g. "Slime Family"
            data[currentHeader].families[currentFamily] = {};
            continue;
        }

        if (currentHeader != "") {
            const splits = cleanLine.split(/\s+/)
            if (!splits[0]) continue;
            if (!data[currentHeader].families[currentFamily]) continue;
            if (currentHeader == "MONSTER DATA") {
                data[currentHeader].families[currentFamily][splits[0] as string] = {
                    name: splits[0],
                    stats: splits.slice(0, 9).map((v) => { return { value: 0 } }),
                    moves: splits.slice(9, 12),
                    resistances: []
                };
            }
            if (currentHeader == "MONSTER RESISTANCES") {
                // data["MONSTER DATA"].families[currentFamily][splits[3] as string].resistances =
                //     splits.slice(0, 12).map(x => parseInt(x));

            }
        }

    }

    //console.clear();
    console.log(data["MONSTER DATA"].families[currentFamily]);

    return data;
}

export default function Home() {
    const monsterData = parseMonsterData();
    return (
        <div>
            {monsterData['slime familiy']}
        </div>
    );
}
