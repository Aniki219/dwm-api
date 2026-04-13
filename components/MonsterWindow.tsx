"use client"

import { Monster } from "@/types/types";

type MonsterWindowParams = {
    monster: Monster
}

export default function MonsterWindow(params: MonsterWindowParams) {
    const { name, family, moves, stats, resistances, breeds } = params.monster;
    return (
        <div>
            <h1>{name}</h1>
            <h2>{family}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Stat</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(stats).map((stat, k) => {
                            return (
                                <tr key={`tr_${k}`}>
                                    <td>{stat}</td>
                                    <td>{stats[stat]}</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
            <ul>
                {
                    moves.map((move, k) => <li key={`move_${k}`}>{move}</li>)
                }
            </ul>
        </div>
    )
}