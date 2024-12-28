import { classNames } from "utils";
import { useState, useEffect } from "react";

const HealthBar = ({ debug = false, id, current, max, percent, label, colors }) => {
    const p = percent * 100;
    const pStr = `${p}%`;
    const sb = debug ? `[#${id}] ${label} ${current} / ${max}` : `${label} ${current} / ${max}`;
    const [framePath, setFramePath] = useState("/imgs/frame2.png");
    useEffect(() => {
        if (typeof window !== "undefined")
            setFramePath(window.location.origin.toLowerCase().includes("github.io") ? "/SpeedrunTools/imgs/frame2.png" : "/imgs/frame2.png");
    }, []);
    return (
        <div className={classNames(max === 0 || max > 1000000000 ? "hidden" : "", "relative border-[12px] border-transparent smframe h-8")} style={{borderImage: `url(${framePath}) 12 round`}}>
            <div className={classNames(colors[0], "w-full h-7")} style={{ width: pStr }}>
                <div className="absolute w-full flex justify-between items-center text-xl px-2 font-bold">
                    <div className="text-white">
                        {sb}
                    </div>
                    <div className={classNames(colors[1], "text-xl")} id="percentprogress">{(percent * 100).toFixed(1)}%</div>
                </div>
            </div>
        </div>
    )
}

export default HealthBar;