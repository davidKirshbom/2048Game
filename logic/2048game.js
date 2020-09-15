class game2048 {
    constructor() {
        this.board = [["2", "", "2", ""]
            , ["2", "8", "", ""]
            , ["2", "4", "4", ""]
            , ["2", "4", "4", ""]]
        this.possibaleMovesList = {
            up: "UP",
            down: "DOWN",
            right: "RIGHT",
            left: "LEFT"
        }
    
    }
    addNumberToBoard = () => {
        const rowToAdd = Math.random() * 100 % 3;
        const columnToAdd = Math.random() * 100 % 3;
        if (this.board[rowToAdd][columnToAdd] !== "")
            this.addNumberToBoard();
        else {
            this.board[rowToAdd][columnToAdd] = Math.random() * 100 % 5 === 2 ? "4" : "2";
        }
    }
    moveTiles = (movment) => {
        const { up, down, right, left } = this.possibaleMovesList;
        const startRow = movment === up ? 0 : this.board.length - 1;
        const endRow = movment === up ? this.board.length : -1;
        const startColumn = movment === right ? this.board.length - 1 : 0;
        const endColumn = movment === right ? -1 : this.board.length;
        const factorColumn = startColumn < endColumn ? 1 : -1;
        const factorRow = startRow < endRow ? 1 : -1;
        console.log(`startRow:${startRow} , endRow ${endRow}, startCol:${startColumn},endCol: ${endColumn}`)
        for (let column = startColumn; column !== endColumn; column += factorColumn) {
            for (let row = startRow; row !== endRow; row += factorRow) {
              
                {
                    switch (movment) {
                        case up:
                            this.moveTileUp({ row, column });
                            break;
                        case down:
                            this.moveTileDown({ row, column });
                            break;
                        case right:
                            this.moveTileRight({ row, column });
                            break;
                        case left:
                            this.moveTileLeft({ row, column });
                            break;
                        default:
                            return;

                    }
                }
                
            }
            
        }
    }
    moveTileUp = ({ row, column }) => {
        if (this.board[row][column] === "") {
            let changePlacesCount = 0
            for (let rowIndex = row + 1; rowIndex < this.board.length; rowIndex++) {
                if (this.board[rowIndex][column] !== "") {
                    this.board[row + changePlacesCount][column] = this.board[rowIndex][column]
                    this.board[rowIndex][column] = "";
                    changePlacesCount++;
                }
            }
            if (changePlacesCount > 0)
                this.moveTileUp({ row, column })
        }
        else {
            for (let rowIndex = row + 1; rowIndex < this.board.length; rowIndex++) {
                if (this.board[rowIndex][column] === this.board[row][column]) {
                    this.board[row][column] = parseInt(this.board[rowIndex][column]) + parseInt(this.board[row][column]) + ""
                    this.board[rowIndex][column] = "";
                    return;
                }
            }
        }
    }
    moveTileDown = ({ row, column }) => {
        if (this.board[row][column] === "") {
            let changePlacesCount = 0
            for (let rowIndex = row - 1; rowIndex >= 0; rowIndex--) {
                if (this.board[rowIndex][column] !== "") {
                    this.board[row - changePlacesCount][column] = this.board[rowIndex][column]
                    this.board[rowIndex][column] = "";
                    changePlacesCount++;
                }
            }
            if (changePlacesCount > 0)
                this.moveTileDown({ row, column })
        }
        else {
            for (let rowIndex = row - 1; rowIndex >= 0; rowIndex--) {
                if (this.board[rowIndex][column] === this.board[row][column]) {
                    this.board[row][column] = parseInt(this.board[rowIndex][column]) + parseInt(this.board[row][column]) + ""
                    this.board[rowIndex][column] = "";
                    return;
                }
            }
        }
    }
    moveTileRight = ({ row, column }) => {
        if (this.board[row][column] === "") {
            let changePlacesCount = 0
            for (let columnIndex = column - 1; columnIndex >= 0; columnIndex--) {
                if (this.board[row][columnIndex] !== "") {
                    this.board[row][column - changePlacesCount] = this.board[row][columnIndex]
                    this.board[row][columnIndex] = "";
                    changePlacesCount++;
                }
            }
            if (changePlacesCount > 0)
                this.moveTileRight({ row, column })
        }
        else {
            for (let columnIndex = column - 1; columnIndex >= 0; columnIndex--) {
                if (this.board[row][columnIndex] === this.board[row][column]) {
                    this.board[row][column] = parseInt(this.board[row][columnIndex]) + parseInt(this.board[row][column]) + ""
                    this.board[row][columnIndex] = "";
                    return;
                }
            }
        }
    }
    moveTileLeft = ({ row, column }) => {
        if (this.board[row][column] === "") {
            let changePlacesCount = 0
            for (let columnIndex = column + 1; columnIndex < this.board.length; columnIndex++) {
                if (this.board[row][columnIndex] !== "") {
                    this.board[row ][column+ changePlacesCount] = this.board[row][columnIndex]
                    this.board[row][columnIndex] = "";
                    changePlacesCount++;
                }
            }
            if (changePlacesCount > 0)
                this.moveTileLeft({ row, column })
        }
        else {
            for (let columnIndex = column + 1; columnIndex < this.board.length; columnIndex++) {
                if (this.board[row][columnIndex] === this.board[row][column]) {
                    this.board[row][column] = parseInt(this.board[row][columnIndex]) + parseInt(this.board[row][column]) + ""
                    this.board[row][columnIndex] = "";
                    return;
                }
            }
        }
    }
}

let game = new game2048();
game.moveTiles("LEFT");
console.log(game.board);
game.moveTiles("DOWN");
console.log(game.board);
        