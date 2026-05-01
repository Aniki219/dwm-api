import { GetMonstersByLocation } from "@/services/MonsterService";
import Link from "next/link";

export default async function LocationPage({
    params
}: {
    params: Promise<{ locationName: string }>
}) {
    const p = await params;
    const locationName = decodeURI(p.locationName);

    const monstersByFound = await GetMonstersByLocation(locationName);

    return (
        <div className="index">
            <h1>{locationName} Monsters</h1>
            <div className="columns">
                {
                    monstersByFound.map(({ found, monsters }, i) => {
                        return (
                            <div key={`found_${i}`}>
                                <p>{found}</p>
                                <ul>
                                    {
                                        monsters.map((name, j) => {
                                            return (
                                                <li key={`monster_${j}`}>
                                                    <Link href={`/monsters/${name}`}>{name}</Link>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        )
                    })
                }
            </div>
            <div className="page-bottom">
                <Link href={`/locations`}>Back to Location Index</Link>
            </div>
        </div>
    )
}