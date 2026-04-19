"use client"

import { Monster } from "@/types/types";

type MonsterBreedTableParams = {
    monster: Monster
}

export default function MonsterBreedTable(params: MonsterBreedTableParams) {
    const { breeds } = params.monster;

    const breedMap = new Map<string, string[]>();
    breeds.forEach(pair => {
        const { base, mate } = pair;
        if (breedMap.has(base)) {
            breedMap[base].push
        }
    })

    console.log(breedMap);

    return (
        <table>
            <thead>
                <tr>
                    <th>Base</th>
                    <th>Mate</th>
                </tr>
            </thead>
            <tbody>

                {
                    breeds.map((br, i) => {
                        return (
                            <tr key={`pair_${i}`}>
                                <td key={`base_${i}`}>
                                    <a href={`/monster/${br.base}`}>{br.base} </a>
                                </td>
                                <td key={`mate_${i}`}>
                                    <a href={`/monster/${br.mate}`}>{br.mate} </a>
                                </td>
                            </tr>
                        )
                    })
                }

            </tbody>
        </table>
    )
}