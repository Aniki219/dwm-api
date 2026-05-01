import { GetMonsterNamesByMove } from "@/services/MonsterService";
import Link from "next/link";

export default async function MovePage({
    params
}: {
    params: Promise<{ moveName: string }>
}) {
    const { moveName } = await params;

    const { monster_names, toMove, secondMove, thirdMove } = await GetMonsterNamesByMove(moveName);

    return (
        <div className="index">
            <h1>{moveName}</h1>
            {
                toMove &&
                <h2>See Also</h2>
            }
            <ul>
                {
                    toMove &&
                    <li>
                        <Link href={`/moves/${toMove}`}>{toMove}</Link>
                    </li>
                }
                {
                    secondMove &&
                    <li>
                        <Link href={`/moves/${secondMove}`}>{secondMove}</Link>
                    </li>
                }
                {
                    thirdMove &&
                    <li>
                        <Link href={`/moves/${thirdMove}`}>{thirdMove}</Link>
                    </li>
                }
            </ul>
            <h2>Monsters Who Learn {moveName}</h2>
            <ul className="columns smaller">
                {
                    monster_names.map((monster_name, i) => {
                        return (
                            <li key={i}>
                                <Link href={`/monsters/${monster_name}`}>{monster_name}</Link>
                            </li>
                        )
                    })
                }
            </ul>
            <div className="page-bottom">
                <Link href={`/moves`}>Back to Move Index</Link>
            </div>
        </div>
    )
}