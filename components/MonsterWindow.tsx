"use client"

import { Monster, RES_NAMES, STAT_NAMES } from "@/types/types";
import Image from "next/image";
import '../app/globals.css'

type MonsterWindowParams = {
    monster: Monster
}

export default function MonsterWindow(params: MonsterWindowParams) {
    const { name, family, moves, stats, resistances, breeds } = params.monster;
    const statNames = STAT_NAMES.filter(n => !['LV', 'FROM'].includes(n)).sort((_, n) => n == 'MAX' || n == 'EXP' ? -1 : 0)

    return (
        <div className="monster-window">
            <h1>{name} (<a href={`/families/${family}`}>{family}</a>)</h1>
            <div>
                <Image src={`/sprites/${name.toLowerCase()}.png`} width={144} height={144} style={{ imageRendering: 'pixelated' }} alt={`${name.toLowerCase()}`} />
                <h2>Skills</h2>
                <ul>
                    {
                        moves.map((move, k) => <li key={`move_${k}`}>{move}</li>)
                    }
                </ul>
            </div>
            <h2>Location</h2>
            <p>Ice World</p>
            <h2>Stats</h2>
            <table className="stat-table">
                <thead>
                    <tr>
                        {
                            statNames.map((stat, k) => {
                                return (
                                    <th key={`th_${k}`}>{stat}</th>
                                );
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {
                            statNames.map((stat, k) => {
                                return (
                                    <td key={`stat_${k}`}>{stats[stat]}</td>
                                );
                            })
                        }
                    </tr>
                </tbody>
            </table>
            <h2>Resistances</h2>
            <table className="resistance-table">
                <thead>
                    <tr>
                        {
                            RES_NAMES.map((res, k) => {
                                return (
                                    <th key={`th_${k}`}>{res}</th>
                                );
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {
                            resistances.map((res, k) => {
                                return (
                                    <td key={`res_${k}`}>{res}</td>
                                );
                            })
                        }
                    </tr>
                </tbody>
            </table>
        </div>
    )
}