import { useState, useEffect } from "react";
import Head from 'next/head';
import { GameErrorPage } from "components/Errors";
import HealthBar from "components/HealthBar";
import ContextMenu from "components/ContextMenu";
import { saveUserSettings, loadUserSettings } from 'utils';
import { TextBlocksRowBetween } from "@/components/TextBlock";

//LOCAL JSON SERVER SETTINGS
var JSON_ADDRESS = "127.0.0.1";
const JSON_PORT = 7190;
const POLLING_RATE = 333;
var JSON_ENDPOINT = `http://${JSON_ADDRESS}:${JSON_PORT}/`;

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

const isDebug = process.env.NODE_ENV != "production";

const AliceJSON = () => {
    const [data, setData] = useState(null);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
    const [showDebug, SetShowDebug] = useState(false);
    const [bossOnly, SetBossOnly] = useState(false);
    const [damagedOnly, SetDamagedOnly] = useState(false);
    const [isLoaded, SetIsLoaded] = useState(0);

    const initSettings = () => {
        const loadedSettings = loadUserSettings("Alice");
        // console.log("Loaded Settings: ", loadedSettings);
        if (loadedSettings) {
            SetShowDebug(loadedSettings.showDebug)
            SetBossOnly(loadedSettings.bossOnly);
            SetDamagedOnly(loadedSettings.damagedOnly);
            SetIsLoaded(true);
            return;
        }
        // if local storage is null create new instance
        const newSettings = {
            showDebug,
            bossOnly,
            damagedOnly,
        }
        saveUserSettings("Alice", newSettings);
        SetIsLoaded(true);
    };

    useEffect(() => {
        if (localStorage !== undefined && !isLoaded) {
            initSettings();
            handleConnect();
        }
    });

    useEffect(() => {
        if (!isLoaded) return;
        const newSettings = {
            showDebug,
            bossOnly,
            damagedOnly,
        }
        saveUserSettings("Alice", newSettings);
    }, [isLoaded, showDebug, bossOnly, damagedOnly]);

    const handleContextMenu = (event) => {
        event.preventDefault();
        setShowContextMenu(true);
        setContextMenuPos({ x: event.pageX, y: event.pageY });
    };

    const handleCloseContextMenu = () => {
        setShowContextMenu(false);
    };

    const appendData = d => {
        if (d === null) return;
        setData(d);
        // if (process.env.NODE_ENV !== 'production') console.log("JSON Data: ", d);
    };

    const handleConnect = () => {
        const getData = () => {
            fetch(JSON_ENDPOINT).then(function (response) {
                return response.json();
            }).then(function (data) {
                appendData(data);
            }).catch(function (err) {
                console.log("Error: " + err);
            });
        };
        setInterval(getData, POLLING_RATE);
    };

    if (data === null) return <></>;
    // TODO: Create a new background image for Alice in Wonderland
    if (data !== null && data.GameName !== "Alice in Wonderland") return <GameErrorPage background="bg-re2" callback={handleConnect} />;

    const { Enemies, Map, Sector, Heroes, GameTime } = data;

    const isBoss = [6];

    const IsDamaged = (enemy) => enemy.IsAlive && enemy.CurrentHealth < enemy.MaxHealth;
    const IsBossOnly = (enemy) => enemy.IsAlive && isBoss.includes(enemy.EnemyType);

    const filterConditions = (enemy) => {
        if (damagedOnly && bossOnly)
            return IsBossOnly(enemy) && IsDamaged(enemy);
        if (bossOnly)
            return IsBossOnly(enemy);
        if (damagedOnly)
            return IsDamaged(enemy);
        return enemy.IsAlive;
    }

    const filterdEnemies = Enemies.filter(filterConditions).sort(function (a, b) {
        return Asc(a.CurrentHP, b.CurrentHP) || Desc(a.CurrentHP, b.CurrentHP);
    });

    const GetEnemyName = (id) => {
        if (id === 0) return "Red Knight Spearman";
        if (id === 1) return "Red Knight Archer";
        if (id === 2) return "Red Knight Tank";
        if (id === 3) return "Red Knight Fortress";
        if (id === 4) return "Red Knight Sniffer";
        if (id === 6) return "Stayne";
        return "??";
    }

    const GetMapName = (id) => {
        if (id == -1) return "Loading Screen";
        if (id == 0) return "Main Menu";
        if (id == 10) return "Round Hall (Hub)";
        if (id == 20) return "Strange Garden";
        if (id == 30) return "Tulgey Woods";
        if (id == 40) return "March Hare's House";
        if (id == 50) return "Hightopps";
        if (id == 60) return "Cabin";
        if (id == 70) return "Red Desert";
        if (id == 75) return "The Moat";
        if (id == 80) return "Salazen Grum (Red Queen's Castle)";
        if (id == 85) return "Bandersnatch Stables";
        if (id == 90) return "Marmoreal (White Queen's Castle)";
        if (id == 100) return "Frabjous Day";
        return "??";
    }

    const GetPlayerName = (id) => {
        if (id == 0) return "Player 1";
        if (id == 1) return "Player 2";
        if (id == 2) return "Alice";
        return "??";
    }

    const GetCharacterName = (id) => {
        if (id == 0) return "McTwisp (White Rabbit)";
        if (id == 1) return "Mad Hatter";
        if (id == 2) return "Cheshire Cat";
        if (id == 3) return "March Hare";
        if (id == 4) return "Alice (Small)";
        if (id == 5) return "Alice";
        if (id == 6) return "Mallymkun (Dormouse)";
        return "??";
    }

    return (
        <>
            <Head>
                <title>Stat Tracker | Alice in Wonderland</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="absolute w-full h-full flex flex-col p-4 items-center" onContextMenu={handleContextMenu} onClick={() => handleCloseContextMenu()}>
                {showContextMenu && (
                    <ContextMenu
                        x={contextMenuPos.x}
                        y={contextMenuPos.y}
                        onClose={handleCloseContextMenu}
                        bossOnly={bossOnly}
                        SetBossOnly={SetBossOnly}
                        damagedOnly={damagedOnly}
                        SetDamagedOnly={SetDamagedOnly}
                        showRotation={null}
                        SetShowRotation={null}
                        showID={null}
                        SetShowID={null}
                        showPosition={null}
                        SetShowPosition={null}
                        showLocation={null}
                        SetShowLocation={null}
                        showInventory={null}
                        SetShowInventory={null}
                        showIGT={null}
                        SetShowIGT={null}
                        showRank={null}
                        SetShowRank={null}
                        showKillCount={null}
                        SetKillCount={null}
                        showDebug={showDebug}
                        SetShowDebug={SetShowDebug}
                    />
                )}
                {/* Only include players 1 + 2 - Alice doesn't have a health value */}
                {Heroes.filter(hero => hero.HeroNumber != 2).map((hero, idx) => (
                    <HealthBar
                        debug={showDebug}
                        key={`hero${idx}`}
                        id={hero.HeroNumber}
                        current={hero.CurrentHealth}
                        max={hero.MaxHealth}
                        percent={hero.Percentage/100}
                        label={`${GetPlayerName(hero.HeroNumber)}: ${GetCharacterName(hero.CharacterType)}`}
                        colors={["bg-blue-900", "text-blue-300"]} />
                ))}
                <TextBlocksRowBetween
                    labels={["Map", "Map Name", "Sector"]}
                    vals={[Map, GetMapName(Map), Sector]}
                    colors={["text-white", "text-green-500"]} />
                <TextBlocksRowBetween
                    labels={["Game Time"]}
                    vals={[new Date(GameTime * 1000).toISOString().slice(11, 19)]}
                    colors={["text-white", "text-green-500"]} />
                {filterdEnemies.map((enemy, idx) => (
                    <HealthBar
                    debug={showDebug}
                    key={`enemy${idx}`}
                    id={enemy.EnemyType}
                    current={enemy.CurrentHealth}
                    max={enemy.MaxHealth}
                    percent={enemy.Percentage/100}
                    label={GetEnemyName(enemy.EnemyType)}
                    colors={["bg-red-900", "text-red-300"]} />
                ))}
            </div>
        </>
    )
};

export default AliceJSON;
