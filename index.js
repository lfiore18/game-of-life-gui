import { BoardRenderer } from "./modules/boardRenderer.mjs";
import { Board } from "./modules/boardState.mjs";

let start, previousTimeStamp;

const canvas = document.querySelector("#myCanvas");

const ctx    = canvas.getContext("2d");

let board = new Board(90, 50);
const boardRenderer = new BoardRenderer(board, canvas, ctx, 12);

const maxStepLengthInMs = 2000;

let stepLengthInMs = maxStepLengthInMs / 5;
let isPlaying = false;

let addingCurrentConfig = "singleCell";


//TODO: There's a bug where any config placed to the right of column 50 will not play by the rules
// I've noticed that neighbours are not being calculated correctly on that side of the board which leads to configs prematurely dying
// I believe it's something to do with the fact that the board is not squared, and there are more columns than rows

// Initial Update
boardRenderer.UpdateBoard(board);

document.querySelector("#stepRange").addEventListener("change", (e) => {
    stepLengthInMs = maxStepLengthInMs / e.target.value;
});

document.querySelector("#play").addEventListener("click", (e) => {
    isPlaying = true;
});

document.querySelector("#pause").addEventListener("click", (e) => {
    isPlaying = false;
});

document.querySelector("#reset").addEventListener("click", reset);


canvas.addEventListener("click", placeCell);
canvas.addEventListener("mousemove", ghostCell);


// Get the currently selected config from the "select" element
document.querySelector("#addConfig").addEventListener("click", (e) => {
    
    // get currently selected
    let currentConfig = document.querySelector("#addConfig").value;

    // set the addingCurrentConfig variable to the currently selected config
    switch (currentConfig) {
        case "glider":
            addingCurrentConfig = "glider";
            break;
        case "gliderGun":
            addingCurrentConfig = "gliderGun";
            break;
        case "pulsar":
            addingCurrentConfig = "pulsar";
            break;
        case "singleCell":
        default:
            addingCurrentConfig = "singleCell";
            break;
    }
});

function reset() {
    console.log("Resetting board");
    board = null;
    board = new Board(90, 50);
    isPlaying = false;
    boardRenderer.UpdateBoard(board);
}


function ghostCell(e) {
    console.log("ghosting");

    // Update the board to remove the previous ghosted image
    boardRenderer.UpdateBoard(board);
    SingleCell(e, true);
}

function placeCell(e) {
    SingleCell(e, false);
    boardRenderer.UpdateBoard(board);
}

// create function for placeCell and ghostCell to use with appropriate name
function SingleCell(e, isGhost = false) {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    let cellX = Math.floor(x / boardRenderer.cellDimensionPx);
    let cellY = Math.floor(y / boardRenderer.cellDimensionPx);

    switch (addingCurrentConfig) {
        case "glider":
            // use set position
            DrawGlider(cellX, cellY, isGhost);
            break;
        case "gliderGun":
            DrawGliderGun(cellX, cellY, isGhost);
            break;
        case "pulsar":
            DrawThing(cellX, cellY, isGhost);
            break;
        case "singleCell":
        default:
            DrawCell(cellX, cellY, isGhost);
            break;
    }
}

function DrawGlider(cellX, cellY, isGhost = false) {
    // Create an array of positions to pass to the config drawer
    let positions = [   
        // draw glider
        [cellX, cellY], [cellX + 1, cellY], [cellX + 2, cellY],
        [cellX + 2, cellY - 1], [cellX + 1, cellY - 2]
    ];

    DrawConfig(positions, isGhost);
}

function DrawThing(cellX, cellY, isGhost = false){
    let x = cellX;
    let y = cellY;

    let positions = [
        [cellX, cellY], [cellX, cellY - 1], [cellX, cellY - 2]
    ]

    DrawConfig(positions, isGhost);
}


function DrawGliderGun(cellX, cellY, isGhost = false) {
    // Create an array of the  positions to pass to the config drawer
    let positions = [
        [cellX, cellY], [cellX + 1, cellY], [cellX, cellY + 1], [cellX + 1, cellY + 1],
        [cellX + 10, cellY], [cellX + 10, cellY + 1], [cellX + 10, cellY + 2], [cellX + 11, cellY - 1],
        [cellX + 11, cellY + 3], [cellX + 12, cellY - 2], [cellX + 12, cellY + 4], [cellX + 13, cellY - 2],
        [cellX + 13, cellY + 4], [cellX + 14, cellY + 1], [cellX + 15, cellY - 1], [cellX + 15, cellY + 3],
        [cellX + 16, cellY], [cellX + 16, cellY + 1], [cellX + 16, cellY + 2], [cellX + 17, cellY + 1], [cellX + 20, cellY - 2],
        [cellX + 20, cellY - 1], [cellX + 20, cellY], [cellX + 21, cellY - 2], [cellX + 21, cellY - 1],
        [cellX + 21, cellY], [cellX + 22, cellY - 3], [cellX + 22, cellY + 1], [cellX + 24, cellY - 4],
        [cellX + 24, cellY - 3], [cellX + 24, cellY + 1], [cellX + 24, cellY + 2], [cellX + 34, cellY - 2],
        [cellX + 34, cellY - 1], [cellX + 35, cellY - 2], [cellX + 35, cellY - 1]
    ];

    DrawConfig(positions, isGhost);
}

function DrawCell(cellX, cellY, isGhost = false) {
    if (isGhost)
        boardRenderer.DrawCell(cellX, cellY, isGhost);
    else
        board.SetPosition(cellX, cellY, true);
}

function DrawConfig(positions, isGhost = false) {
    for (let i = 0; i < positions.length; i++) {
        if (isGhost)
            boardRenderer.DrawCell(positions[i][0], positions[i][1], isGhost);
        else
            board.SetPosition(positions[i][0], positions[i][1], true);
    }
}

function runGame(timeStamp) {
    if (isPlaying) {
        // At the beginning, take a timestamp
        if (previousTimeStamp === undefined)
        {
            previousTimeStamp = timeStamp;
        }

        let elapsed = timeStamp - previousTimeStamp;

        if (elapsed > stepLengthInMs) 
        {
            console.log("Step");
            previousTimeStamp = timeStamp;
            board.MutateBoard();
            boardRenderer.UpdateBoard(board);
        }
    }
    window.requestAnimationFrame(runGame);    
}

window.requestAnimationFrame(runGame);

