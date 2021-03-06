import React from "react";
import { PieceType, Player } from "../util/SquareUtil";

import { svgs } from "./pieces/Piece";

interface PawnUpgradeProps {
    player: Player;
    side: "top" | "bottom";
    onUpgradeSelect?: (piece: PieceType) => void;
}

export const PawnUpgrade = ({
    player,
    side,
    onUpgradeSelect,
}: PawnUpgradeProps) => {
    const optionsGridCss = {
        display: "grid",
        gridTemplateColumns: "80px",
        //gridTemplateColumns: "120px 120px 120px",
        gridTemplateRows: "80px 80px 80px 80px",
        justifyContent: "center",
        height: "320px",
        zIndex: 99999,
        position: "relative" as "relative",
        top: side === "top" ? "20px" : "-400px",
        left: "20px",
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
                    id={`${key}_upgrade`}
                    style={{
                        ...boxCss,
                    }}
                    /*onClick={(ev: any) => {
                        const piece = ev.target.id.split("_")[0];
                        console.log("selected to upgrade to: " + piece);
                        onUpgradeSelect && onUpgradeSelect(piece);
                    }}*/
                >
                    <img
                        width="80px"
                        height="80px"
                        id={`${key}_upgrade_img`}
                        src={el}
                        alt="test"
                        onClick={(ev: any) => {
                            const piece = ev.target.id.split("_")[0];
                            console.log("selected to upgrade to: " + piece);
                            onUpgradeSelect && onUpgradeSelect(piece);
                        }}
                    ></img>
                </div>
            );
        }
    }

    return (
        <div id="pawn-upgrade" style={optionsGridCss}>
            {divs}
        </div>
    );
};
