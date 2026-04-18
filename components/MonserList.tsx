"use client"

import { Monster, STAT_NAMES } from "@/types/types";
import Link from "next/link";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";

type MonsterListParams = {
    currentMonster: Monster
    monsterList: Monster[]
}

type MonsterListSort = {
    sortKey: string,
    up: boolean
}

export default function MonsterList(params: MonsterListParams) {
    const { stats: currentStats, name: currentName } = params.currentMonster;
    const [filteredFamily, setFilteredFamily] = useState<string>("")
    const [sortBy, setSortBy] = useState<MonsterListSort>({ sortKey: 'none', up: true });

    useEffect(() => {
        const saved = localStorage.getItem('monsterListSort');
        if (!saved) return;
        startTransition(() => setSortBy(JSON.parse(saved)));
    }, []);

    useEffect(() => {
        localStorage.setItem('monsterListSort', JSON.stringify(sortBy));
    }, [sortBy]);

    const statNames = STAT_NAMES.filter(n => !['LV', 'FROM', 'MAX', 'EXP'].includes(n)).sort((_, n) => n == 'MAX' || n == 'EXP' ? -1 : 0)
    const rowRef = useRef<HTMLTableRowElement>(null);

    const monsterList = useMemo(() => {
        const getSortValue = (monster: Monster, key: string): string | number => {
            if (key === 'name') return monster.name;
            if (key === 'family') return monster.family;
            if (key === 'total') return statNames
                .filter(s => !['MAX', 'EXP'].includes(s))
                .reduce((p, a) => monster.stats[a as keyof typeof monster.stats] + p, 0);
            return monster.stats[key as keyof typeof monster.stats];
        }

        if (sortBy.sortKey === 'none') return params.monsterList;

        return [...params.monsterList]
            .filter(m => filteredFamily == "" || m.family == filteredFamily)
            .sort((a, b) => {
                let aVal = getSortValue(a, sortBy.sortKey);
                let bVal = getSortValue(b, sortBy.sortKey);
                let up = sortBy.up;
                if (aVal === bVal) {
                    aVal = a.name;
                    bVal = b.name;
                    up = true
                }
                if (aVal === bVal) return 0;
                const cmp = aVal > bVal ? 1 : -1;
                return up ? cmp : -cmp;
            });
    }, [sortBy, params.monsterList, statNames, filteredFamily]);

    const handleSortBy = (sortKey: string) => {
        if (sortBy.sortKey === sortKey) {
            setSortBy({ sortKey: sortKey, up: !sortBy.up });
        } else {
            setSortBy({ sortKey: sortKey, up: true });
        }
    }

    useEffect(() => {
        if (rowRef.current) {
            rowRef.current.scrollIntoView({ behavior: "instant", block: "center" });
        }
    }, []);

    return (
        <div>
            <h2> Monster List </h2>
            <div className="list-tabs">
                <a href='#'>Breeds</a>
                <span>|</span>
                <a href='#'>Stats</a>
                <span>|</span>
                <a href='#'>Resistances</a>
            </div>
            <div className="table-wrapper">
                <table className="monster-table">
                    <thead>
                        <tr>
                            <th
                                style={{ 'width': '35px', 'maxWidth': '35px' }}
                                onClick={() => handleSortBy('name')}
                            >
                                Name
                            </th>
                            <th onClick={() => handleSortBy('family')}>
                                Family
                            </th>
                            {statNames.map((stat, k) => (
                                <th
                                    key={`statName_${k}`}
                                    onClick={() => handleSortBy(stat)}
                                >
                                    {stat}
                                </th>
                            ))}
                            <th onClick={() => handleSortBy('total')}>
                                Stat Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {monsterList.map((monster, k) => {
                            const { name, family, stats } = monster;
                            return (
                                <tr
                                    ref={name == currentName ? rowRef : null}
                                    key={`monster_${k}`}
                                    className={`${name == currentName ? " currentRow" : ""}`}
                                >
                                    <td
                                        style={{ 'width': '35px', 'maxWidth': '35px' }}
                                    >
                                        <Link href={`/monster/${name}`}>{name}</Link>
                                    </td>
                                    <td>{family}</td>
                                    {statNames.map((stat, k) => (
                                        <td
                                            key={`stat_${k}`}
                                            className={`${getHighLowClassName(stats[stat])}`}
                                        >
                                            {stats[stat]}
                                        </td>
                                    ))}
                                    <td>
                                        {statNames.filter(s => !['MAX', 'EXP'].includes(s)).reduce((p, a) => stats[a] + p, 0)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const getHighLowClassName = (stat: number) => {
    if (stat >= 27) {
        return "veryHighStat";
    }
    if (stat >= 20) {
        return "highStat";
    }
    if (stat <= 10) {
        return "lowStat";
    }
}