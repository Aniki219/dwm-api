import { Monster, MonsterData, Stats, STAT_NAMES } from '@/types/types';
import fs from 'fs';

const data: MonsterData = { families: {} };

function parseMonsterData() {
    const text = fs.readFileSync('data/AmbiosGuide.txt', 'utf-8');
    const lines = text.split('\n');

    let currentFamily: string = "";
    let currentHeader: string = "";
    let prevLineWasEquals: boolean = false;

    for (const line of lines) {
        const familyMatch = line.match(/^[ivxIVX]+\. (.+ Family)/);
        if (line.match(/Misc\. Monsters/)) {
            break;
        }

        // Strip carriage returns
        const cleanLine = line.replace(/\r/g, '').replace(/-/g, '');

        if (cleanLine.match(/^-+$/) || cleanLine.match(/^Name\s+/)) continue;

        if (cleanLine.trim() === '') continue;

        if (cleanLine.match(/^=+$/)) {
            if (prevLineWasEquals) {
                prevLineWasEquals = false;
            } else {
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
                const stats = {} as Stats;
                STAT_NAMES.forEach((name, i) => {
                    stats[name] = parseInt(splits[i + 1]);
                });
                data.families[currentFamily][splits[0].toUpperCase()] = {
                    name: splits[0],
                    family: currentFamily.replace(" FAMILY", "").toLowerCase().replace(/^\w/, (c) => c.toUpperCase()),
                    stats: stats,
                    moves: splits.slice(9, 12),
                    resistances: [],
                    breeds: []
                };
            }
            if (currentHeader == "MONSTER RESISTANCES") {
                if (data.families[currentFamily][splits[0].toUpperCase()]) {
                    data.families[currentFamily][splits[0].toUpperCase()].resistances =
                        splits.slice(1, 28).map(x => parseInt(x));
                }
            }
        }
    }
}

function parseBreedsData() {
    const text = fs.readFileSync('data/JimeousGuide.txt', 'utf-8');
    const lines = text.split('\n');

    let currentFamily = "";
    let currentMonster = "";
    let startCountingRows = false;

    for (const line of lines) {
        const monster = line.match(/\|  ([A-Z]+)\s*:/);
        if (monster) {
            currentMonster = monster[1];
            continue;
        }

        if (line.match(/-+\^-+/)) {
            currentMonster = "";
            startCountingRows = false;
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
                startCountingRows = true;
                continue;
            }

            const bases = baseMatePair[1].trim().split(" ").filter(b => b != '');
            const mates = baseMatePair[2].trim().split(" ").filter(m => m != '');

            const r = data.families[currentFamily][currentMonster].breeds.length - 1;
            const breeds = data.families[currentFamily][currentMonster].breeds[r];

            breeds.base = breeds.base.concat(bases);
            breeds.mate = breeds.mate.concat(mates);
        }

        if (startCountingRows && line.match(/¦-+\+-+¦/)) {
            data.families[currentFamily][currentMonster].breeds.push({ base: [], mate: [] });
        }
    }
}

export default function GetMonsterData() {
    parseMonsterData();
    parseBreedsData();

    fs.writeFile('data/MonsterData.json', JSON.stringify(data, null, "\t"), (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('File has been replaced successfully.');
        }
    });
}

GetMonsterData();