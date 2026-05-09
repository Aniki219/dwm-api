"use client"

import { Button } from "@heroui/react/button"
import { useEffect, useState } from "react"
import MonsterBreedsTable from "./MonsterBreedTable"
import { Monster } from "@/types/types"
import { GetMonster } from "@/services/MonsterService"

export type PlanNode = {
    monsterName: string | null,
    baseChild: PlanNode | null,
    mateChild: PlanNode | null,
}

type PlanElement = {
    name: string,
    row: number,
    col: number
}

type BreedPlannerParams = {
    initialPlan: PlanNode
}

export default function BreedPlanner(params: BreedPlannerParams) {
    const { initialPlan } = params;
    const [plan, setPlan] = useState<PlanNode>(initialPlan);
    const [currentMonster, setCurrentMonster] = useState<Monster>()

    const GeneratePlanTree = (nodes: PlanNode) => {
        const tree = new Array<PlanElement>();

        let row = 0
        const DFS = (node: PlanNode, col: number) => {
            const { monsterName: name, baseChild, mateChild } = node;
            if (!name) return;

            tree.push({ name, row, col });

            if (!node.baseChild) return;

            col += 1;
            DFS(baseChild!, col);

            row += 1
            DFS(mateChild!, col);
        }
        DFS(nodes, 0);

        return tree;
    }

    const SetCurrentMonsterByName = async (name: string) => {
        const monster = await GetMonster(name);
        setCurrentMonster(monster);
    }

    const tree = GeneratePlanTree(plan);
    const rows = tree.at(-1)?.row as number;
    const cols = tree.reduce((p, c) => p.col > c.col ? p : c).col as number;

    const grid: string[][] = Array.from({ length: rows + 1 }, () => Array(cols + 1).fill(""));

    tree.forEach((node) => grid[node.row][node.col] = node.name)

    return (
        <div className="index">
            <h2>Breed Plan for {plan.monsterName || "monster"}</h2>
            <table>
                <tbody>
                    {
                        grid.map((row, r) => {
                            return (
                                <tr key={`row_${r}`}>
                                    {
                                        row.map((col, c) => {
                                            return (
                                                <td key={`slot_${c}`}>
                                                    {
                                                        col &&
                                                        <Button onClick={() => SetCurrentMonsterByName(col)}>{col}</Button>
                                                    }
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            {/* {currentMonster && <MonsterBreedsTable monster={currentMonster as Monster} />} */}
        </div>
    )
}