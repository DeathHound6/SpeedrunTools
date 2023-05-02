import { useState, useEffect, useCallback } from "react";
import Head from 'next/head';
import { ErrorPage, GameErrorPage } from "components/Errors";
import HealthBar from "components/HealthBar";
import { TextBlock, TextBlocks } from "components/TextBlock";

const websocket_endpoint = 'ws://localhost:19906';

const Asc = (a, b) => {
    if (a > b) return +1;
    if (a < b) return -1;
    return 0;
};

const Desc = (a, b) => {
    if (a > b) return -1;
    if (a < b) return +1;
    return 0;
};

const RE4RWS = () => {
    const [data, setData] = useState(null);
    const [connected, setConnected] = useState(false);

    const handleConnect = useCallback(() => {
        const appendData = d => {
            if (d === null) return;
            setData(d);
            if (process.env.NODE_ENV !== 'production') console.log("Websocket Data: ", d);
        };

        const socket = new WebSocket(websocket_endpoint);
        socket.onopen = () => {
            setConnected(true);
        };
        socket.onclose = () => {
            setConnected(false);
        };
        socket.onmessage = event => appendData(JSON.parse(event.data));
    }, [setConnected, setData]);

    useEffect(() => {
        handleConnect();
    }, [handleConnect]);

    const GetColor = (state) => {
        if (state === "Gassed") return ["bg-rose-900", "text-rose-300"];
        if (state === "Poisoned") return ["bg-indigo-900", "text-indigo-300"];
        if (state === "Fine") return ["bg-green-800", "text-green-300"];
        if (state === "FineToo") return ["bg-green-900", "text-green-300"];
        if (state === "Caution") return ["bg-yellow-800", "text-yellow-300"];
        return ["bg-red-900", "text-red-300"];
    }

    if (!connected) return <ErrorPage background="bg-re3" connected={connected} callback={handleConnect} />;
    if (data.GameName !== "RE3R") return <GameErrorPage background="bg-re3" callback={handleConnect} />;

    const { Timer, RankManager, PlayerManager, Enemies } = data;
    const { CurrentSurvivorString, Health, CurrentHealthState } = PlayerManager;
    const { GameRank, RankPoint } = RankManager;

    const filterdEnemies = Enemies.filter(m => { return (m.IsAlive) }).sort(function (a, b) {
        return Asc(a.CurrentHP, b.CurrentHP) || Desc(a.CurrentHP, b.CurrentHP);
    });

    return (
        <>
            <Head>
                <title>Stat Tracker | RE3R</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="absolute w-full h-full flex flex-col p-4 gap-2 bg-black">
                <TextBlock label="IGT" val={Timer.IGTFormattedString} colors={["text-white", "text-green-500"]} hideParam={false} />
                <HealthBar current={Health.CurrentHP} max={Health.MaxHP} percent={Health.Percentage} label={CurrentSurvivorString} colors={GetColor(CurrentHealthState)} />
                <TextBlocks labels={["Rank", "RankScore"]} vals={[GameRank, RankPoint]} colors={["text-white", "text-green-500"]} hideParam={false} />
                {filterdEnemies.map((enemy, idx) => (
                    <HealthBar key={`enemy${idx}`} current={enemy.CurrentHP} max={enemy.MaxHP} percent={enemy.Percentage} label={enemy.EnemyTypeString} colors={["bg-red-900", "text-red-500"]} />
                ))}
            </div>
        </>
    );
}

export default RE4RWS;