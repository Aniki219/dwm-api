import { GetMonsterNamesByFamily } from "@/services/MonsterService";
import Link from "next/link";
import '@/app/globals.css';

export default async function FamilyPage({
    params
}: {
    params: Promise<{ familyName: string }>
}) {
    const { familyName } = await params;

    const familyMonsters = await GetMonsterNamesByFamily(familyName);

    return (
        <div className="index">
            <h2>{familyName} Family</h2>
            <ul>
                {
                    familyMonsters.map((name, i) => {
                        return (
                            <li key={i}>
                                <Link href={`/monsters/${name}`}>{name}</Link>
                            </li>
                        )
                    })
                }
            </ul>
            <Link href={`/families`}>Back to Families Index</Link>
        </div>
    )
}