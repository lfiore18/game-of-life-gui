import { BoardRenderer } from "./modules/boardRenderer.mjs";
import { Board } from "./modules/boardState.mjs";

let start, previousTimeStamp;

const canvas = document.querySelector("#myCanvas");
const ctx    = canvas.getContext("2d");

const board = new Board(50, 50);
const boardRenderer = new BoardRenderer(board, canvas, ctx, 12);

board.SetConfig(5, 5);
boardRenderer.UpdateBoard(board);


function runGame(timeStamp) {
    // At the beginning, take a timestamp
    if (previousTimeStamp === undefined)
    {
        previousTimeStamp = timeStamp;
    }

    let elapsed = timeStamp - previousTimeStamp;

    if (elapsed > 1000) 
    {
        console.log("Step");
        previousTimeStamp = timeStamp;
        board.MutateBoard();
        boardRenderer.UpdateBoard(board);
    }

    window.requestAnimationFrame(runGame);    
}

window.requestAnimationFrame(runGame);

