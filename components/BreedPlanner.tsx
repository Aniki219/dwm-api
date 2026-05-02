"use client"

import { useEffect, useState } from "react"

export type PlanNode = {
    monsterName: string,
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

    const GeneratePlanTree = (nodes: PlanNode) => {
        const tree = new Array<PlanElement>();

        let row = 0
        const DFS = (node: PlanNode, col: number) => {
            const { monsterName: name, baseChild, mateChild } = node;
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

    const tree = GeneratePlanTree(plan);
    const rows = tree.at(-1)?.row as number;
    const cols = tree.reduce((p, c) => p.col > c.col ? p : c).col as number;

    const grid: string[][] = Array.from({ length: rows + 1 }, () => Array(cols + 1).fill(""));


    tree.forEach((node) => grid[node.row][node.col] = node.name)

    console.log(grid)

    return (
        <div>

        </div>
    )
}

// const samplePlan = {
//     "monsterName": "ZapBird",

//     "baseChild": {
//         "monsterName": "Phoenix",

//         "baseChild": {
//             "monsterName": "BIRDFM"
//         },
//         "mateChild": {
//             "monsterName": "Grizzly"
//         }
//     },
//     "mateChild": {
//         "monsterName": "Gismo",

//         "baseChild":  {
//             "monsterName": "MadCandle"
//         },
//         "mateChild":  {
//             "monsterName": "Wyvern"
//         }
//     }
// }