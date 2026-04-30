import { GetFamilyNames } from "@/services/FamilyService";
import Link from "next/link";

export default async function FamiliesIndex() {
    const familyNames = await GetFamilyNames();

    return (
        <div className="index">
            <h2>Families</h2>
            <ul>
                {
                    familyNames.map((name, i) =>
                        <li key={i}>
                            <Link href={`/families/${name}`}>{name}</Link>
                        </li>
                    )
                }
            </ul>
        </div>
    )
}