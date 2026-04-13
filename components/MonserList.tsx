"use client"

import { Monster, STAT_NAMES } from "@/types/types";

type MonsterListParams = {
    monsterList: Monster[]
}

export default function MonsterList(params: MonsterListParams) {
    const monsterList = params.monsterList;
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-800 text-gray-300 uppercase text-xs tracking-wider">
                    <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Family</th>
                        {STAT_NAMES.map((stat, k) => (
                            <td key={`statName_${k}`} className="px-4 py-2">
                                {stat}
                            </td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {monsterList.map((monster, k) => {
                        const { name, family, stats } = monster;
                        return (
                            <tr
                                key={`monster_${k}`}
                                className="border-t border-gray-700 hover:bg-gray-800 transition-colors cursor-pointer odd:bg-gray-900 even:bg-gray-950"
                            >
                                <td className="px-4 py-2 font-medium text-white">{name}</td>
                                <td className="px-4 py-2 text-gray-400">{family}</td>
                                {STAT_NAMES.map((stat, k) => (
                                    <td key={`stat_${k}`} className="px-4 py-2 text-gray-400">
                                        {stats[stat] ?? ""}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}