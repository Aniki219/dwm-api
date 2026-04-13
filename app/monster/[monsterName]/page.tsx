import MonsterList from "@/components/MonserList";
import MonsterWindow from "@/components/MonsterWindow";
import { GetMonster, GetMonsters } from "@/services/MonsterService";
import { Monster } from "@/types/types";

export default async function Home({
    params
}: {
    params: Promise<{ monsterName: string }>,
    monsterList: Monster[]
}) {
    const { monsterName } = await params;
    const monster = await GetMonster(monsterName) as Monster;
    const monsterList = await GetMonsters() as Monster[];

    return (
        <div>
            <MonsterWindow monster={monster} />
            <MonsterList monsterList={monsterList} />
        </div>
    );
}
