"use client"

import { Breed, Monster } from "@/types/types";
import '../app/globals.css'
import Link from "next/link";
import { useState } from "react";

type MonsterBreedTableParams = {
    monster: Monster,
    breedsArray: [string, Breed[]][],
    breedPairs: Breed[]
}

export default function MonsterBreedsTable(params: MonsterBreedTableParams) {
    const [showBreeds, setShowBreeds] = useState(true)

    return (
        <div className="monster-bottom">
            <h2> {showBreeds ? "Breed Pairs" : "Used In"} </h2>
            <ShowBreedsBar setShowBreeds={setShowBreeds} />
            {
                showBreeds ?
                    <MonsterBreedTable params={params} /> :
                    <MonsterUsedInTable params={params} />
            }
        </div>
    )
}

function MonsterUsedInTable({ params }: { params: MonsterBreedTableParams }) {
    const { breedsArray } = params;

    return (
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
                        breedsArray.map((res) => {
                            const [result, resultBreeds] = res;
                            return resultBreeds.map((br, i) => {
                                return (
                                    <tr key={`pair_${i}`}>
                                        {
                                            <td key={`bases_${i}`}>
                                                {MonsterList(br.base)}
                                            </td>
                                        }
                                        {
                                            <td key={`mates_${i}`}>
                                                {MonsterList(br.mate)}
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
    )
}

function MonsterBreedTable({ params }: { params: MonsterBreedTableParams }) {
    const { breedPairs } = params;

    return (
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
                                            {MonsterList(base)}
                                        </td>
                                    }
                                    {
                                        <td key={`mates_${i}`}>
                                            {MonsterList(mate)}
                                        </td>
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

function MonsterList(names: string[]) {
    return <ul>
        {names.map((n, i) => {
            return (
                <li key={`name_${i}`}>
                    <Link href={`/monsters/${n}`}>{n}</Link>
                </li>
            );
        })}
    </ul>;
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