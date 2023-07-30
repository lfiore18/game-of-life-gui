const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");

// Divide the canvas into cells
// TODO: Provide an UI for the user to be able to dictate the size of the cells
const cellWidth = 12, cellHeight = 12;

let rows, cols;

// GRAPHICS RELATED FUNCTIONS
function UpdateBoard(board){
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            if (board.GetPosition(x, y)) {
                console.log(board.GetPosition(x,));
                DrawCell(x * cellWidth, y * cellHeight);
            }
        }
    }
}

function DrawCell(x, y, dotSize = cellWidth) {
    ctx.fillStyle = "#fff";

    // x, y is where the top-left corner of the cell will be positioned
    // dotSize will dictate the width/height of the cell, originating from the x/y
    ctx.fillRect(x, y, dotSize, dotSize);
}

function DrawBoard(documentWidth, documentHeight) {
    canvas.height = documentHeight;
    canvas.width = documentWidth;

    canvas.style.width = documentWidth;
    canvas.style.height = documentHeight;

    rows = Math.floor(documentHeight / cellHeight);
    cols = Math.floor(documentWidth / cellWidth);

    // Draw the background
    ctx.fillRect(0, 0, documentWidth, documentHeight);

    // Draw the vertical lines
    for (let i = 1; i < cols; i++) {
        DrawLine(i * cellWidth, 0, i * cellWidth, documentHeight, 2);
        console.log(`Drawing vertical line ${i}`);
    }

    // Draw the horizontal lines
    for (let i = 1; i < rows; i++) {
        DrawLine(0, i * cellHeight, documentWidth, i * cellHeight, 2);
        console.log(`Drawing horizontal line ${i}`);
    }
}

function DrawLine(x1, y1, x2, y2, lineWidth = 1, color = "#2f2f2f") {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    // Draw the line
    // Every line begins with a path,
    ctx.beginPath();

    // "moveTo" is like lifting the pen off the canvas and placing it at the coordinate
    ctx.moveTo(x1, y1);

    // "lineTo" is like putting the pen back down and drawing a line to the coordinate
    ctx.lineTo(x2, y2);

    // "closePath" is like lifting the pen off the canvas
    ctx.closePath();

    // Stroke comes after the path is defined
    ctx.stroke();
}

export { DrawBoard, UpdateBoard };