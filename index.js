const html = document.querySelector("html");
const documentHeight = 80 * window.innerHeight / 100 || 766, 
      documentWidth = 100 * window.innerWidth / 100;

const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");

let mouseDown = false;

canvas.height = documentHeight;
canvas.width = documentWidth;

canvas.style.width = documentWidth;
canvas.style.height = documentHeight;

ctx.fillRect(0, 0, documentWidth, documentHeight);

let canvasRect = canvas.getBoundingClientRect();

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

function drawDot(x, y) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(x, y, 4, 4);
    console.log(`${mouseDown}`);
}