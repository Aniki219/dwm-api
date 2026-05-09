import BreedPlanner, { PlanNode } from "@/components/BreedPlanner"
import { GetMonsters } from "@/services/MonsterService";

export default async function BreedPlannerPage() {
    const samplePlan = {
        "monsterName": "ZapBird",
        "baseChild": {
            "monsterName": "Phoenix",
            "baseChild": {
                "monsterName": "BIRDFM"
            },
            "mateChild": {
                "monsterName": "Grizzly",
                "baseChild": {
                    "monsterName": "BEASTFM"
                },
                "mateChild": {
                    "monsterName": "DEVILFM"
                }
            }
        },
        "mateChild": {
            "monsterName": "Gismo",
            "baseChild": {
                "monsterName": "MadCandle"
            },
            "mateChild": {
                "monsterName": "Wyvern"
            }
        }
    } as PlanNode

    const emptyPlan: PlanNode = { monsterName: null, baseChild: null, mateChild: null };

    return (
        <div>
            <BreedPlanner initialPlan={emptyPlan} />
        </div>
    )
}