const html = document.querySelector("html");
const documentHeight = 80 * window.innerHeight / 100 || 766, 
      documentWidth = 100 * window.innerWidth / 100;

const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");

// divide the canvas into 4px cells
const cellWidth = 10, cellHeight = 10;

// Track whether the mouse is held down or not
// Is mutated by the event listeners
let mouseDown = false;

canvas.height = documentHeight;
canvas.width = documentWidth;

canvas.style.width = documentWidth;
canvas.style.height = documentHeight;

// Draw the background
ctx.fillRect(0, 0, documentWidth, documentHeight);

let canvasRect = canvas.getBoundingClientRect();

// Draw the vertical lines
for (let i = 1; i < documentWidth / cellWidth; i++) {
    drawLine(i * cellWidth, 0, i * cellWidth, documentHeight, 2);
    console.log(`Drawing line ${i}`);
}

// Draw the horizontal lines
for (let i = 1; i < documentHeight / cellHeight; i++) {
    drawLine(0, i * cellHeight, documentWidth, i * cellHeight, 2);
    console.log(`Drawing line ${i}`);
}

document.addEventListener("mousedown", e => {
    mouseDown = true;
    console.log(mouseDown);
    drawDot(e.x, e.y);
});

document.addEventListener("mouseup", e => {
    mouseDown = false;
    console.log(mouseDown);
});

document.addEventListener("mousemove", e => {
    //while (mouseDown)    
    if (e.x < canvasRect.right && 
        e.y < canvasRect.bottom &&
        mouseDown) {
            drawDot(e.x, e.y);
    }
});

function drawDot(x, y, dotSize = 4) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(x, y, dotSize, dotSize);
    console.log(`${mouseDown}`);
}

function drawLine(x1, y1, x2, y2, lineWidth = 1, color = "#2f2f2f") {
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