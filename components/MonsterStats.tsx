"use client"

import { Monster, RES_NAMES, STAT_NAMES, Stats } from "@/types/types";
import Image from "next/image";
import '../app/globals.css'
import Link from "next/link";
import { Resistance } from "pokemon-tcg-sdk-typescript/dist/sdk";
import { useState } from "react";

type MonsterStatsParams = {
    monster: Monster
}

export default function MonsterStats(params: MonsterStatsParams) {
    const { moves, stats, resistances } = params.monster;
    const statNames = STAT_NAMES.filter(n => !['LV', 'FROM'].includes(n))

    const [showStats, setShowStats] = useState(true);

    return (
        <div className="monster-bottom">
            <h2>Location</h2>
            <p>Ice World</p>
            <h2>Skills</h2>
            <ul>
                {
                    moves.map((move, k) => {
                        return (
                            <li key={`move_${k}`}>
                                <Link href="#">{move}</Link>
                            </li>
                        )
                    })
                }
            </ul>
            {
                showStats ?
                    <StatsTable statNames={statNames} stats={stats} setShowStats={setShowStats} /> :
                    <ResistancesTable resistances={resistances} setShowStats={setShowStats} />
            }
        </div>
    )
}

type StatsTableParams = {
    statNames: string[],
    stats: Stats,
    setShowStats: (t: boolean) => void
}

function StatsTable(params: StatsTableParams) {
    const { statNames, stats, setShowStats } = params
    return (
        <>
            <h2>Stats</h2>
            <StatsOrResBar setShowStats={setShowStats} />
            <table className="stat-table">
                <thead>
                    <tr>
                        <th style={{ "width": "35px", "maxWidth": "35px" }}></th>
                        {
                            statNames.map((stat, k) => <th key={`th_${k}`}>{stat}</th>)
                        }
                        <th>TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ "width": "35px", "maxWidth": "35px" }}></td>
                        {
                            statNames.map((stat, k) => <td key={`stat_${k}`}>{stats[stat]}</td>)
                        }
                        <td>
                            {
                                statNames.reduce<number>((sum, key) => {
                                    if (['MAX', 'EXP', 'FROM', 'LV', 'INT', 'AGL', 'MP'].includes(key)) {
                                        return sum;
                                    }
                                    return sum + stats[key];
                                }, 0)
                            }
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

type ResistancesTableParams = {
    resistances: number[],
    setShowStats: (t: boolean) => void
}
function ResistancesTable(params: ResistancesTableParams) {
    const { resistances, setShowStats } = params;
    return (
        <>
            <h2>Resistances</h2>
            <StatsOrResBar setShowStats={setShowStats} />
            <table className="resistance-table">
                <thead>
                    <tr>{RES_NAMES.map((res, k) => <th key={`th_${k}`}>{res}</th>)}</tr>
                </thead>
                <tbody>
                    <tr>{resistances.map((res, k) => <td key={`res_${k}`}>{res}</td>)}</tr>
                </tbody>
            </table>
        </>
    )
}

function StatsOrResBar({ setShowStats }: { setShowStats: (t: boolean) => void }) {
    return (
        <div className="list-tabs">
            <a href='#' onClick={() => setShowStats(true)}>Stats</a>
            <span>|</span>
            <a href='#' onClick={() => setShowStats(false)}>Resistances</a>
        </div>
    )
}