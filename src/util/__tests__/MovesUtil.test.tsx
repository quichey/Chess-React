import React from "react";
import { render, screen } from "@testing-library/react";
import { pawnReachedEnd } from "../MovesUtil";

describe("test cases for Pawn Reached End function", () => {
    it("returns true when a pawn is at the first row", () => {
        let board = Array(64).fill("");
        board[0] = { player: "White", piece: "Pawn" };
        expect(pawnReachedEnd(board)).toEqual({
            player: "White",
            piece: "Pawn",
            idx: 0,
        });
    });

    it("returns true when a pawn is at the last row", () => {
        let board = Array(64).fill("");
        board[63] = { player: "White", piece: "Pawn" };
        expect(pawnReachedEnd(board)).toEqual({
            player: "White",
            piece: "Pawn",
            idx: 63,
        });
    });

    it("returns false when a pawn is at the second row", () => {
        let board = Array(64).fill("");
        board[12] = { player: "White", piece: "Pawn" };
        expect(pawnReachedEnd(board)).toBe(false);
    });

    it("returns false when a pawn is at the second to last row", () => {
        let board = Array(64).fill("");
        board[63 - 9] = { player: "White", piece: "Pawn" };
        expect(pawnReachedEnd(board)).toBe(false);
    });
});
