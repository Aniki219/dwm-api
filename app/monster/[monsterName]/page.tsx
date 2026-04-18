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
        <div className="page-layout">
            <div className="left-column">
                <MonsterWindow monster={monster} />
            </div>
            <div className="right-column">
                <MonsterList currentMonster={monster} monsterList={monsterList} />
            </div>
        </div>
    );
}
