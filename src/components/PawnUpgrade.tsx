import React from "react";
import { Player } from "../util/SquareUtil";

import { svgs } from "./pieces/Piece";

type PawnUpgradeProps = {
    player: Player;
};

export const PawnUpgrade = ({ player }: PawnUpgradeProps) => {
    const optionsGridCss = {
        display: "grid",
        gridTemplateColumns: "80px",
        //gridTemplateColumns: "120px 120px 120px",
        gridTemplateRows: "80px 80px 80px 80px",
        justifyContent: "center",
        height: "320px",
    };

    const boxCss = {
        backgroundColor: "#d9d9d9",
        border: "2px solid black",
    };
    const divs: React.ReactNode[] = [];

    for (var key in svgs) {
        var el = svgs[key];
        if (
            key.includes(player) &&
            !key.includes("Pawn") &&
            !key.includes("King")
        ) {
            divs.push(
                <div
                    key={key}
                    style={{
                        ...boxCss,
                    }}
                    onClick={(ev: any) => {}}
                >
                    <img width="80px" height="80px" src={el} alt="test"></img>
                </div>
            );
        }
    }

    return <div style={optionsGridCss}>{divs}</div>;
};
