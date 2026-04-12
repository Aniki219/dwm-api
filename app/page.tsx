"use server"

import { GetMonster } from "@/services/MonsterService";
import { Monster } from "@/types/types";

export default async function Home() {
    const { name, family, stats, moves } = await GetMonster("Andreal") as Monster;

    return (
        <div>
            <h1>{name}</h1>
            <h2>{family}</h2>
            <table>
                <thead>
                    <td>Stat</td>
                    <td>Value</td>
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
    );
}
