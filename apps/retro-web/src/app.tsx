import type { RetroEntry } from "@goal-together/types";
import { dailyRetroPrompts } from "@goal-together/retro-core";

const exampleRetro: RetroEntry = {
    id: "retro-1",
    date: "2026-03-30",
    content: "",
    rewarded: false,
};

export function App() {
    return (
        <main>
            <h1>Retro Web</h1>
            <p>{exampleRetro.date}</p>
            <p>{dailyRetroPrompts[0]}</p>
        </main>
    );
}
