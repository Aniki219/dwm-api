import MonsterList from "@/components/MonserList";
import MonsterBreedsTable from "@/components/MonsterBreedTable";
import MonsterStats from "@/components/MonsterStats";
import MonsterWindow from "@/components/MonsterWindow";
import { GetMonster, GetMonsters } from "@/services/MonsterService";
import { Breed, Monster } from "@/types/types";
import { cookies } from "next/headers";

export async function generateStaticParams() {
    const monsterList = await GetMonsters();
    return monsterList.map((m) => {
        return { monsterName: m.name }
    })
}

export default async function MonsterPage({
    params
}: {
    params: Promise<{ monsterName: string }>,
    monsterList: Monster[]
}) {
    const { monsterName } = await params;
    const monster = await GetMonster(monsterName) as Monster;
    const monsterList = await GetMonsters() as Monster[];

    const breedsArray = GetBreeds(monster);
    const breedPairs = GetCondensedBreedPairs(monster.breeds);

    const cookieStore = await cookies();
    const savedSort = cookieStore.get('monsterListSort')?.value;
    const initialSort = savedSort ? JSON.parse(savedSort) : { sortKey: 'none', up: true };

    return (
        <div className="page-layout">
            <div className="left-column">
                <MonsterWindow monster={monster} />
                <MonsterBreedsTable monster={monster} breedsArray={breedsArray} breedPairs={breedPairs} />
            </div>
            <div className="right-column">
                <MonsterStats monster={monster} />
                <MonsterList monsterName={monster.name} monsterList={monsterList} initialSort={initialSort} fullHeight={false} />
            </div>
        </div>
    );
}

function GetBreeds(monster: Monster) {
    const { name, usedIn } = monster;
    const breedsMap = new Map<string, Breed[]>();
    usedIn.forEach(b => {
        const { result, base, mate, five } = b;
        const baseStr = base as unknown as string;
        const mateStr = mate as unknown as string;
        if (breedsMap.get(result)) {
            const resultBreeds = breedsMap.get(result);
            resultBreeds?.push({ base: [baseStr], mate: [mateStr], five: five, result });
        } else {
            breedsMap.set(result, [{ base: [baseStr], mate: [mateStr], five: five, result }]);
        }
    })

    const breedsArray = Array.from(breedsMap);
    breedsArray.forEach(e => {
        e[1] = GetCondensedBreedPairs(e[1])
    })

    breedsArray.forEach(ba => ba[1] = ba[1].filter(e => e.base.includes(name) || e.mate.includes(name)));

    return breedsArray;
}

function GetCondensedBreedPairs(breeds: Breed[]): Breed[] {
    const breedMap = new Map<string, string[]>();
    breeds.forEach(pair => {
        const { base, mate, five: plusFive } = pair;
        const baseStr: string = base as unknown as string;
        const mateStr: string = mate as unknown as string;
        const fullBaseStr = baseStr + (plusFive ? "(+5)" : "");
        const fullMateStr = mateStr + (plusFive ? "(+5)" : "");
        if (breedMap.has(fullBaseStr)) {
            breedMap.get(fullBaseStr)?.push(fullMateStr);
        } else {
            breedMap.set(fullBaseStr, [fullMateStr]);
        }
    });

    const reverseIndex = new Map<string, string[]>();
    for (const [key, valueArray] of breedMap) {
        for (const value of valueArray) {
            if (reverseIndex.has(value)) {
                reverseIndex.get(value)?.push(key);
            } else {
                reverseIndex.set(value, [key]);
            }
        }
    }

    const twiceReversedIndex = new Map<string, string[]>();
    for (const [key, valueArray] of reverseIndex) {
        const valueString = valueArray.join(",");
        if (twiceReversedIndex.has(valueString)) {
            twiceReversedIndex.get(valueString)?.push(key);
        } else {
            twiceReversedIndex.set(valueString, [key]);
        }
    }

    const breedPairs = new Array<Breed>;
    for (const [keyString, valueArray] of twiceReversedIndex) {
        const base = keyString.split(",");
        breedPairs.push({ base, mate: valueArray, five: null, result: "" });
    }

    return breedPairs;
}