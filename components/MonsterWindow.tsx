"use client"

import { Monster, RES_NAMES } from "@/types/types";
import Image from "next/image";
import '../app/globals.css'

type MonsterWindowParams = {
    monster: Monster
}

export default function MonsterWindow(params: MonsterWindowParams) {
    const { name, family } = params.monster;

    return (
        <div className="monster-window">
            <h1 style={{ 'textAlign': 'center' }}>
                {name} (<a href={`/families/${family}`}>{family}</a>)
            </h1>
            <div className="monster-top">
                <Image src={`/sprites/${name.toLowerCase()}.png`} width={144} height={144} style={{ imageRendering: 'pixelated' }} alt={`${name.toLowerCase()}`} />
            </div>
        </div>
    )
}