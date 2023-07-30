import { DrawBoard, UpdateBoard } from "./modules/graphics.mjs";
import { Board } from "./modules/boardState.mjs";

const documentHeight = 80 * window.innerHeight / 100 || 766, 
      documentWidth = 100 * window.innerWidth / 100;

const board = new Board(documentWidth, documentHeight);

// Draw the board
DrawBoard(documentWidth, documentHeight);
board.SetConfig(5, 5);
UpdateBoard(board);