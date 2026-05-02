import BreedPlanner, { PlanNode } from "@/components/BreedPlanner"

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

    return (
        <div>
            <BreedPlanner initialPlan={samplePlan} />
        </div>
    )
}