import MonsterList from "@/components/MonserList";
import MonsterBreedsTable from "@/components/MonsterBreedTable";
import MonsterBreedTable from "@/components/MonsterBreedTable";
import MonsterStats from "@/components/MonsterStats";
import MonsterWindow from "@/components/MonsterWindow";
import { GetMonster, GetMonsters } from "@/services/MonsterService";
import { Monster } from "@/types/types";
import { cookies } from "next/headers";

export default async function MonsterPage({
    params
}: {
    params: Promise<{ monsterName: string }>,
    monsterList: Monster[]
}) {
    const { monsterName } = await params;
    const monster = await GetMonster(monsterName) as Monster;
    const monsterList = await GetMonsters() as Monster[];

    const cookieStore = await cookies();
    const savedSort = cookieStore.get('monsterListSort')?.value;
    const initialSort = savedSort ? JSON.parse(savedSort) : { sortKey: 'none', up: true };

    return (
        <div className="page-layout">
            <div className="left-column">
                <MonsterWindow monster={monster} />
                <MonsterBreedsTable monster={monster} />
            </div>
            <div className="right-column">
                <MonsterStats monster={monster} />
                <MonsterList currentMonster={monster} monsterList={monsterList} initialSort={initialSort} />
            </div>
        </div>
    );
}
