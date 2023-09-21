import { BoardRenderer } from "./modules/boardRenderer.mjs";
import { Board } from "./modules/boardState.mjs";

let start, previousTimeStamp;

const canvas         = document.querySelector("#myCanvas");
const ctx            = canvas.getContext("2d");
const rotationText   = document.querySelector("#rotation");
const generationText = document.querySelector("#generation");

let board = new Board(90, 90);
const boardRenderer = new BoardRenderer(board, canvas, ctx, 12);

// Set the max step length to 2 seconds
const maxStepLengthInMs = 1000;

// Set the step length to 1/5 of the max step length
let stepLengthInMs = maxStepLengthInMs / 5;
let isPlaying = false;

// Set the current config to singleCell by default
let addingCurrentConfig = "singleCell";

// Store the current rotation of the config
let currentConfigOrientation = 0;


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

document.querySelector("#reset").addEventListener("click", Reset);

canvas.addEventListener("click", PlaceCell);
canvas.addEventListener("mousemove", GhostCell);


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
        case "acorn":
            addingCurrentConfig = "acorn";
            break;
        case "singleCell":
        default:
            addingCurrentConfig = "singleCell";
            break;
    }
});

// listen for E keypress to rotate the current config
document.addEventListener("keydown", (e) => {
    if (e.key === "r") {
        currentConfigOrientation += 90;
        if (currentConfigOrientation >= 360) {
            currentConfigOrientation = 0;
        }
        console.log(currentConfigOrientation);
    }

    UpdateRotationText();
});

// listen for R keypress to rotate the current config the opposite way
document.addEventListener("keydown", (e) => {
    if (e.key === "e") {
        currentConfigOrientation -= 90;
        if (currentConfigOrientation < 0) {
            currentConfigOrientation = 270;
        }
        console.log(currentConfigOrientation);
    }

    UpdateRotationText();
});


function UpdateRotationText() {
    // add the degree symbol to the rotation text
    let degreeSymbol = String.fromCharCode(176);

    let orientationText = "";

    switch (currentConfigOrientation) {
        case 90:
            orientationText = "270";
            break;
        case 270:
            orientationText = "90";
            break;
        default:
            orientationText = currentConfigOrientation.toString();
            break;
    }

    rotationText.innerHTML = `${orientationText}${degreeSymbol}`;
}


function Reset() {
    console.log("Resetting board");
    board = null;
    board = new Board(90, 90);
    isPlaying = false;
    generationText.textContent = board.generation;
    boardRenderer.UpdateBoard(board);
}


function GhostCell(e) {
    console.log("ghosting");

    // Update the board to remove the previous ghosted image
    boardRenderer.UpdateBoard(board);
    SingleCell(e, true);
}


function PlaceCell(e) {
    SingleCell(e, false);
    boardRenderer.UpdateBoard(board);
}


// create function for PlaceCell and GhostCell to use with appropriate name
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
        case "acorn":
            DrawAcorn(cellX, cellY, isGhost);
            break;
        case "singleCell":
        default:
            DrawCell(cellX, cellY, isGhost);
            break;
    }
}


function DrawGlider(cellX, cellY, isGhost = false) {
    // Create an array of positions to pass to the config drawer
    let matrix = [   
        // draw glider
        [0, 0], [1, 0], [2, 0],
        [2, -1], [1, -2]
    ];

    let positions = AddTransforms(cellX, cellY, matrix);

    DrawConfig(positions, isGhost);
}


function DrawThing(cellX, cellY, isGhost = false){

    let matrix = [
        [0, 0], [1, 0], [2, 0]
    ];

    let positions = AddTransforms(cellX, cellY, matrix);

    DrawConfig(positions, isGhost);
}

function DrawAcorn(cellX, cellY, isGhost = false) {
    // using positions[] below, create an array of just the additions and subtractions to the cellX and cellY values
    // then loop through the array and add the cellX and cellY values to each element
    
    let matrix = [
        [0, 0], [1, 0], [4, 0], [5, 0], [6, 0],
        [3, -1], [1, -2]
    ];

    let positions = AddTransforms(cellX, cellY, matrix);

    DrawConfig(positions, isGhost);
}

function DrawGliderGun(cellX, cellY, isGhost = false) {
    // using positions[] below, create an array of just the additions and subtractions to the cellX and cellY values
    // then loop through the array and add the cellX and cellY values to each element
    
    let matrix = [
        [0, 0], [1, 0], [0, 1], [1, 1],
        [10, 0], [10, 1], [10, 2], [11, -1],
        [11, 3], [12, -2], [12, 4], [13, -2],
        [13, 4], [14, 1], [15, -1], [15, 3],
        [16, 0], [16, 1], [16, 2], [17, 1], [20, -2],
        [20, -1], [20, 0], [21, -2], [21, -1],
        [21, 0], [22, -3], [22, 1], [24, -4],
        [24, -3], [24, 1], [24, 2], [34, -2],
        [34, -1], [35, -2], [35, -1]
    ];

    let positions = AddTransforms(cellX, cellY, matrix);

    DrawConfig(positions, isGhost);
}


function DrawCell(cellX, cellY, isGhost = false) {
    if (isGhost)
        boardRenderer.DrawCell(cellX, cellY, isGhost);
    else
        board.SetPosition(cellX, cellY, true);
}


// Takes a matrix of positions and adds the cellX and cellY values to each element, 
// depending on the current rotation of the config
function AddTransforms(cellX, cellY, transformMatrix) {
    let positions = [];
    
    for (let i = 0; i < transformMatrix.length; i++) {
        switch (currentConfigOrientation) {
            case 0:
                positions.push([cellX + transformMatrix[i][0], cellY + transformMatrix[i][1]]);
                break;
            case 90:
                positions.push([cellX + transformMatrix[i][1], cellY + transformMatrix[i][0]]);
                break;
            case 180:
                positions.push([cellX - transformMatrix[i][0], cellY - transformMatrix[i][1]]);
                break;
            case 270:
                positions.push([cellX - transformMatrix[i][1], cellY - transformMatrix[i][0]]);
                break;
            default:
                break;
        }
    }

    return positions;
}


function DrawConfig(positions, isGhost = false) {
    for (let i = 0; i < positions.length; i++) {
        if (isGhost)
            boardRenderer.DrawCell(positions[i][0], positions[i][1], isGhost);
        else
            board.SetPosition(positions[i][0], positions[i][1], true);
    }
}


function RunGame(timeStamp) {
    if (isPlaying) {
        // At the beginning, take a timestamp
        if (previousTimeStamp === undefined)
        {
            previousTimeStamp = timeStamp;
        }

        let elapsed = timeStamp - previousTimeStamp;

        if (elapsed > stepLengthInMs) 
        {
            previousTimeStamp = timeStamp;
            board.MutateBoard();
            boardRenderer.UpdateBoard(board);
            generationText.textContent = board.generation;
        }
    }
    window.requestAnimationFrame(RunGame);    
}

window.requestAnimationFrame(RunGame);

