
export class BoardRenderer {   
    canvas;
    ctx;

    boardWidth = 0;
    boardHeight = 0;

    cellDimensionPx;

    rows; 
    cols;

    constructor(board, canvas, ctx, cellDimensionPx) {
        this.canvas          = canvas;
        this.ctx             = ctx;
        this.cellDimensionPx = cellDimensionPx;

        // Use the board's dimensions to dictate the number of rows and cols on the rendered board
        this.rows = board.Height();
        this.cols = board.Width();
        
        // The width and height of the rendered board will be equal to the number
        // of cells wide/long of the boardState * cellDimension
        this.boardWidth  = this.cols * cellDimensionPx;
        this.boardHeight = this.rows * cellDimensionPx;

        this.canvas.width = this.boardWidth; 
        this.canvas.style.width  = this.boardWidth;

        this.canvas.height = this.boardHeight; 
        this.canvas.style.height = this.boardHeight;

        this.rows = Math.floor(this.boardHeight / this.cellDimensionPx);
        this.cols = Math.floor(this.boardWidth / this.cellDimensionPx);
    }

    // GRAPHICS RELATED FUNCTIONS
    UpdateBoard(board){
        this.ctx.clearRect(0, 0, this.boardWidth, this.boardHeight);
        this.DrawBoard(this.boardWidth, this.boardHeight);
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                if (board.GetPosition(x, y)) {
                    this.DrawCell(x * this.cellDimensionPx, y * this.cellDimensionPx);
                }
            }
        }
    }

    DrawCell(x, y) {
       this.ctx.fillStyle = "#fff";

        // x, y is where the top-left corner of the cell will be positioned
        // dotSize will dictate the width/height of the cell, originating from the x/y
       this.ctx.fillRect(x, y, this.cellDimensionPx, this.cellDimensionPx);
    }

    DrawBoard() {
        // Draw the background
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, this.boardWidth, this.boardHeight);

        // Draw the vertical lines
        for (let i = 1; i < this.cols; i++) {
            this.DrawLine(i * this.cellDimensionPx, 0, i * this.cellDimensionPx, this.boardWidth, 2);
            //console.log(`Drawing vertical line ${i}`);
        }

        // Draw the horizontal lines
        for (let i = 1; i < this.rows; i++) {
            this.DrawLine(0, i * this.cellDimensionPx, this.boardHeight, i * this.cellDimensionPx, 2);
            //console.log(`Drawing horizontal line ${i}`);
        }

        //this.ctx.save();
    }

    DrawLine(x1, y1, x2, y2, lineWidth = 1, color = "#2f2f2f") {
       this.ctx.strokeStyle = color;
       this.ctx.lineWidth = lineWidth;

        // Draw the line
        // Every line begins with a path,
       this.ctx.beginPath();

        // "moveTo" is like lifting the pen off the canvas and placing it at the coordinate
       this.ctx.moveTo(x1, y1);

        // "lineTo" is like putting the pen back down and drawing a line to the coordinate
       this.ctx.lineTo(x2, y2);

        // "closePath" is like lifting the pen off the canvas
       this.ctx.closePath();

        // Stroke comes after the path is defined
       this.ctx.stroke();
    }
}