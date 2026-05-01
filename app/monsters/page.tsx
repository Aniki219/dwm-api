import { GetMonsters } from "@/services/MonsterService";
import Link from "next/link";

export default async function MonstersIndex() {
    const monsters = await GetMonsters();

    const monsterNames = new Map<string, string[]>();
    monsters.forEach(({ name }) => {
        const firstLetter = name[0];
        if (monsterNames.get(firstLetter)) {
            monsterNames.get(firstLetter)?.push(name);
        } else {
            monsterNames.set(firstLetter, [name]);
        }
    });

    const monsterNamesByFirstLetter = Array.from(monsterNames).map(([first, names]) => {
        return { first, names }
    }).sort((a, b) => a.first > b.first ? 1 : -1)

    return (
        <div className="index">
            <h2>Monsters</h2>
            <div className="columns larger">
                {
                    monsterNamesByFirstLetter.map(({ first, names }, i) => {
                        return (
                            <div key={`letter_group_${i}`}>
                                <h2></h2>
                                <ul>
                                    {
                                        names.map((name, j) => {
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
        </div>
    )
}