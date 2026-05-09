import { GetMonstersByFamily } from "@/services/MonsterService";
import Link from "next/link";
import '@/app/globals.css';
import { Monster } from "@/types/types";
import MonsterList from "@/components/MonserList";
import { GetFamilyNames } from "@/services/FamilyService";

export async function generateStaticParams() {
    const families = await GetFamilyNames();
    return families.map((f) => {
        return { familyName: f }
    })
}

export default async function FamilyPage({
    params
}: {
    params: Promise<{ familyName: string }>
}) {
    const { familyName } = await params;

    const familyMonsters = await GetMonstersByFamily(familyName) as Monster[];

    const initialSort = { sortKey: 'none', up: true }

    return (
        <div className="index">
            <div style={{ "display": "flex", "flexDirection": "row", "width": "80%", "justifyItems": "center" }}>
                <div style={{ "flex": "0 0 60%" }}>
                    <h2>{familyName} Family</h2>
                    <ul style={{
                        "display": "flex",
                        "flexDirection": "column",
                        "flexWrap": "wrap",
                        "height": "80vh",
                        "alignContent": "center"
                    }}>
                        {
                            familyMonsters.map(({ name }, i) => {
                                return (
                                    <li key={i}>
                                        <Link href={`/monsters/${name}`}>{name}</Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div style={{ "flex": "1", "justifyItems": "center" }}>
                    <MonsterList monsterName={""} monsterList={familyMonsters} initialSort={initialSort} fullHeight={true} />
                </div>
            </div>
            <Link href={`/families`}>Back to Families Index</Link>
        </div>
    )
}