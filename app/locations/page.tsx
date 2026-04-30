
import { GetLocationNames } from "@/services/LocationService";
import Link from "next/link";

export default async function LocationsIndex() {
    const locationNames = await GetLocationNames();

    return (
        <div className="index">
            <h2>Locations</h2>
            <ul>
                {
                    locationNames.map((name, i) =>
                        <li key={i}>
                            <Link href={`/locations/${name}`}>{name}</Link>
                        </li>
                    )
                }
            </ul>
        </div>
    )
}