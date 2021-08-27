import React from "react";
import { render, screen } from "@testing-library/react";
import { isInCheck } from "../Check";
import { Player } from "../SquareUtil";

describe("test cases for isInCheck function", () => {
  it("returns check for White King by Black Rook", () => {
    let currPlayer: Player = "White";
    let board = Array(64).fill("");
    board[0] = { player: currPlayer, piece: "King" };
    board[1] = { player: "Black", piece: "Rook" };
    expect(isInCheck(currPlayer, board)).toBe(true);
  });

  it("returns check for Black King by White Rook", () => {
    let currPlayer: Player = "Black";
    let board = Array(64).fill("");
    board[0] = { player: currPlayer, piece: "King" };
    board[1] = { player: "White", piece: "Rook" };
    expect(isInCheck(currPlayer, board)).toBe(true);
  });

  it("does not return check for Black King by Black Rook", () => {
    let currPlayer: Player = "Black";
    let board = Array(64).fill("");
    board[0] = { player: currPlayer, piece: "King" };
    board[1] = { player: "Black", piece: "Rook" };
    expect(isInCheck(currPlayer, board)).toBe(false);
  });

  it("does not return check for White King by White Rook", () => {
    let currPlayer: Player = "White";
    let board = Array(64).fill("");
    board[0] = { player: currPlayer, piece: "King" };
    board[1] = { player: "White", piece: "Rook" };
    expect(isInCheck(currPlayer, board)).toBe(false);
  });
});
