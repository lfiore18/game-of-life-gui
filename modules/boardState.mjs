export class Board {
    boardState = [];

    constructor(cols, rows) {
        // Define a multidemensional array to store the boardState
        this.boardState = [];

        // Create the board
        for (let i = 0; i < cols; i++) {
            this.boardState[i] = [];
            for (let j = 0; j < rows; j++) {
                this.boardState[i][j] = false;
            }
        }

        console.log("Board has been created");
    }

    GetPosition(x, y) {
        return this.boardState[x][y];
    }

    SetConfig(x, y) {
        this.boardState[x][y - 1] = true;
        this.boardState[x][y] = true;
        this.boardState[x][y + 1] = true;
        this.boardState[x + 1][y] = true;
    }
}