// Any live cell with two or three live neighbours survives.
// Any dead cell with three live neighbours becomes a live cell.
// All other live cells die in the next generation. Similarly, all other dead cells stay dead.
export class Board {
    boardState = [];

    constructor(cols, rows) {
        // Define a multidemensional array to store the boardState
        this.boardState = [];

        // Create the board
        for (let x = 0; x < cols; x++) {
            this.boardState[x] = [];
            for (let y = 0; y < rows; y++) {
                this.boardState[x][y] = false;
            }
        }
        
        console.log("Board has been created");
    }

    GetPosition(x, y) {
        if (x < 0 || y < 0 || x > this.boardState.length - 1 || y > this.boardState[0].length - 1)
            return false;

        return this.boardState[x][y];
    }

    SetPosition(x, y, isAlive) {
        if (this.GetPosition(x, y) != isAlive)
            this.boardState[x][y] = isAlive;


        console.log("Position " + x + ", " + y + " is now " + isAlive);
    }

    SetConfig(x, y) {
        this.SetPosition(x, y, true);
        this.SetPosition(x, y + 1, true);
        this.SetPosition(x + 1, y, true);
        this.SetPosition(x - 1, y, true);
    }

    // Change the state of the board using an array of cells that changed on the last calculation
    MutateBoard() {
        let nextState = this.CalculateNextBoardState();

        for (let i = 0; i < nextState.length; i++) {
            this.SetPosition(
                nextState[i][0], 
                nextState[i][1], 
                nextState[i][2]
            );
        }
    }

    // Determine the next board state
    CalculateNextBoardState() {
        let stateChange = [];
        let cols = this.Width();
        let rows = this.Height();

        // Check each cell on the board to see if it's occupied
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                let neighbours = this.CheckNeighbouringCells(x, y);
            
                if ((this.GetPosition(x, y) && neighbours > 1 && neighbours < 4) || 
                    (!this.GetPosition(x, y) && neighbours == 3)) {
                    stateChange.push([x, y, true]);
                }
                else if (this.GetPosition(x, y) && (neighbours > 3 || neighbours < 2)) {
                    stateChange.push([x, y, false]);
                }

                if (x == 79 && y == 17)
                    console.log("Neighbours: " + neighbours);
            }
        }
        
        return stateChange;
    }

    // Given a position on the board, check neighbouring cells
    CheckNeighbouringCells(column, row) {
        
        let startPosX = (column - 1 >= 0) ? column - 1 : column;
        let startPosY = (row - 1 >= 0) ? row - 1 : row;

        let endPosX = (column + 1 < this.boardState[0].length) ? column + 1 : column;
        let endPosY = (row + 1 < this.boardState.length) ? row + 1 : row;

        let neighbours = 0;
        
        // Check each cell from the top left to the bottom right in a 9 square grid
        for (let y = startPosY; y <= endPosY; y++)
        {
            for (let x = startPosX; x <= endPosX; x++)
            {
                // Skip the cell at the co-ordinates given in the arguments
                if ((x != column || y != row) && this.boardState[x][y] == true) {
                    neighbours++;
                }
            }
        }
        
        return neighbours;
    }

    Width() {
        return this.boardState.length;
    }

    Height() {
        return this.boardState[0].length;
    }
}