"use client"

import { Breed, Monster } from "@/types/types";
import '../app/globals.css'
import Link from "next/link";
import { useState } from "react";

type MonsterBreedsTableParams = {
    monster: Monster
}

export default function MonsterBreedsTable(params: MonsterBreedsTableParams) {
    const { monster } = params;

    const [showBreeds, setShowBreeds] = useState(true)

    return (
        <>
            {
                showBreeds ?
                    <MonsterBreedTable monster={monster} setShowBreeds={setShowBreeds} /> :
                    <MonsterUsedInTable monster={monster} setShowBreeds={setShowBreeds} />
            }
        </>
    )
}

type MonsterBreedTableParams = {
    monster: Monster,
    setShowBreeds: (b: boolean) => void
}


function MonsterUsedInTable(params: MonsterBreedTableParams) {
    const { setShowBreeds } = params;
    const { name, usedIn } = params.monster;

    const breeds = usedIn;

    const breedsMap = new Map<string, Breed[]>();
    breeds.forEach(b => {
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

    return (
        <div className="monster-bottom">
            <h2> Used In </h2>
            <ShowBreedsBar setShowBreeds={setShowBreeds} />
            <div className="table-wrapper">
                <table className="breed-table">
                    <thead>
                        <tr>
                            <th>Base</th>
                            <th>Mate</th>
                            <th>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            breedsArray.map((res, i) => {
                                const [result, resultBreeds] = res;
                                return resultBreeds.map((br, i) => {
                                    return (
                                        <tr key={`pair_${i}`}>
                                            {
                                                <td key={`bases_${i}`}>
                                                    <ul>
                                                        {
                                                            br.base.map((b, i) => {
                                                                return (
                                                                    <li key={`base_${i}`}>
                                                                        <Link href={`/monsters/${b}`}>{b}</Link>
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                </td>
                                            }
                                            {
                                                <td key={`mates_${i}`}>
                                                    <ul>
                                                        {
                                                            br.mate.map((k, i) => {
                                                                return (
                                                                    <li key={`mate_${i}`}>
                                                                        <Link href={`/monsters/${k}`}>{k}</Link>
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                </td>
                                            }
                                            <td key={`result_${i}`}>
                                                <Link href={`/monsters/${result}`}>{result}</Link>
                                            </td>
                                        </tr>
                                    )
                                })
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}


function MonsterBreedTable(params: MonsterBreedTableParams) {
    const { setShowBreeds } = params;
    const { breeds } = params.monster;

    const breedPairs = GetCondensedBreedPairs(breeds);

    return (
        <div className="monster-bottom">
            <h2> Breeds </h2>
            <ShowBreedsBar setShowBreeds={setShowBreeds} />
            <div className="table-wrapper">
                <table className="breed-table">
                    <thead>
                        <tr>
                            <th>Base</th>
                            <th>Mate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            breedPairs.map((pair, i) => {
                                const { base, mate } = pair;
                                return (
                                    <tr key={`pair_${i}`}>
                                        {
                                            <td key={`bases_${i}`}>
                                                <ul>
                                                    {
                                                        base.map((b, i) => {
                                                            return (
                                                                <li key={`base_${i}`}>
                                                                    <Link href={`/monsters/${b}`}>{b}</Link>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </td>
                                        }
                                        {
                                            <td key={`mates_${i}`}>
                                                <ul>
                                                    {
                                                        mate.map((k, i) => {
                                                            return (
                                                                <li key={`mate_${i}`}>
                                                                    <Link href={`/monsters/${k}`}>{k}</Link>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </td>
                                        }
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function ShowBreedsBar({ setShowBreeds }: { setShowBreeds: (b: boolean) => void }) {
    return (
        <div className="list-tabs">
            <a href='#' onClick={() => setShowBreeds(true)}>Breeds</a>
            <span>|</span>
            <a href='#' onClick={() => setShowBreeds(false)}>Used In</a>
        </div>
    )
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
