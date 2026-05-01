import { GetMoveNames } from "@/services/MoveService";
import Link from "next/link";

export default async function FamiliesIndex() {
    const moveNames = await GetMoveNames();

    return (
        <div className="index">
            <h2>Skills</h2>
            <ul className="columns">
                {
                    moveNames.map((name, i) =>
                        <li key={i}>
                            <Link href={`/moves/${name}`}>{name}</Link>
                        </li>
                    )
                }
            </ul>
        </div>
    )
}