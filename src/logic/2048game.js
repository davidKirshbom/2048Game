const possibaleMovesList = {
    up: "UP",
    down: "DOWN",
    right: "RIGHT",
    left: "LEFT"
}

class game2048 {
    constructor() {
        this.board = [
            [{ value: null, gotFrom: [] }, { value: 2, gotFrom: [] }, { value: 2, gotFrom: [] }, { value: null, gotFrom: [] }]
          , [{value:2,gotFrom:[]}, {value:4,gotFrom:[]}, {value:null,gotFrom:[]}, {value:null,gotFrom:[]}]
          , [{value:2,gotFrom:[]}, {value:4,gotFrom:[]}, {value:4,gotFrom:[]}, {value:null,gotFrom:[]}]
           , [{ value: 2, gotFrom: [] }, { value: 4, gotFrom: [] }, { value: 4, gotFrom: [] }, { value: 2, gotFrom: [] }]
        ]
        
    
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
    resetTilesGotFrom = (board) => {
        for (let row = 0; row < board.length; row++) {
            for (let column = 0; column < board[row].length; column++) {
                board[row][column].gotFrom = [];
                
            }
            
        }
    }
    moveTiles = (movment) => {
        this.resetTilesGotFrom(this.board)
        const { up, down, right, left } = possibaleMovesList;
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
        if (this.board[row][column].value == null) {
            let changePlacesCount = 0
            for (let rowIndex = row + 1; rowIndex < this.board.length; rowIndex++) {
                if (this.board[rowIndex][column].value !==  null) {
                    this.board[row + changePlacesCount][column].value = this.board[rowIndex][column].value
                    if (this.board[rowIndex][column].gotFrom.length > 0)//added
                    {
                        this.board[row + changePlacesCount][column].gotFrom = [];
                        this.board[rowIndex][column].gotFrom.forEach((location) => {
                            this.board[row + changePlacesCount][column].gotFrom.push({row:location.row,column:location.column})
                        })
                    }  
                    else
                     this.board[row + changePlacesCount][column].gotFrom.push({row:rowIndex,column})
                    this.board[rowIndex][column].value = null;
                    changePlacesCount++;
                }
            }
            if (changePlacesCount > 0)
                this.moveTileUp({ row, column })
        }
        else {
            for (let rowIndex = row + 1; rowIndex < this.board.length; rowIndex++) {
                if (this.board[rowIndex][column].value === this.board[row][column].value) {
                    this.board[row][column].value = this.board[rowIndex][column].value + this.board[row][column].value
                    this.board[rowIndex][column].gotFrom.forEach((location) => this.board[row][column].gotFrom.push(location))
                    this.board[rowIndex][column].value = null;
                    if (this.board[row][column].gotFrom.length === 0) {
                        this.board[row][column].gotFrom.push({ row: rowIndex, column })
                        if (row !== rowIndex)
                            this.board[row][column].gotFrom.push({ row, column })
                    }
                    return;
                }
                else if (this.board[rowIndex][column].value !== null)
                    return;
            }
        }
    }
    moveTileDown = ({ row, column }) => {
        if (this.board[row][column].value ==null) {
            let changePlacesCount = 0
            for (let rowIndex = row - 1; rowIndex >= 0; rowIndex--) {
                if (this.board[rowIndex][column].value !== null) {
                    this.board[row - changePlacesCount][column].value = this.board[rowIndex][column].value
                    if (this.board[rowIndex][column].gotFrom.length > 0)//added
                    {
                        this.board[row - changePlacesCount][column].gotFrom = [];
                        this.board[rowIndex][column].gotFrom.forEach((location) => {
                            this.board[row - changePlacesCount][column].gotFrom.push({row:location.row,column:location.column})
                        })
                    }  
                    this.board[row - changePlacesCount][column].gotFrom.push({ row: rowIndex, column })
                    this.board[rowIndex][column].value = null;
                    changePlacesCount++;
                }
            }
            if (changePlacesCount > 0)
                this.moveTileDown({ row, column })
        }
        else {
            for (let rowIndex = row - 1; rowIndex >= 0; rowIndex--) {
                if (this.board[rowIndex][column].value === this.board[row][column].value) {
                    this.board[row][column].value = this.board[rowIndex][column].value + this.board[row][column].value
                    this.board[rowIndex][column].gotFrom.forEach((location)=>this.board[row][column].gotFrom.push(location))
                    this.board[rowIndex][column].value = null;
                    if(this.board[row][column].gotFrom.length===0)
                    {    this.board[row][column].gotFrom.push({ row: rowIndex, column })
                    if (row !== rowIndex)
                    this.board[row][column].gotFrom.push({row,column})}
                    return;
                }
                else if (this.board[rowIndex][column].value !== null)
                    return;
            }
        }
    }
    moveTileRight = ({ row, column }) => {
        if (this.board[row][column].value === null) {
            let changePlacesCount = 0
            for (let columnIndex = column - 1; columnIndex >= 0; columnIndex--) {
                if (this.board[row][columnIndex].value !== null) {
                    this.board[row][column - changePlacesCount].value = this.board[row][columnIndex].value
                    if (this.board[row][columnIndex].gotFrom.length > 0)//added
                    {
                        this.board[row ][column - changePlacesCount].gotFrom = [];
                        this.board[row][columnIndex].gotFrom.forEach((location) => {
                            this.board[row][column - changePlacesCount].gotFrom.push({row:location.row,column:location.column})
                        })
                    }  
                    this.board[row][column - changePlacesCount].gotFrom = []
                     this.board[row][columnIndex].gotFrom.forEach((location)=>this.board[row][column - changePlacesCount].gotFrom.push({row:location.row,column:location.column}))
                    this.board[row][column - changePlacesCount].gotFrom.push({ row, column: columnIndex })
                    
                    this.board[row][columnIndex].value = null;
                    changePlacesCount++;
                }
            }
            if (changePlacesCount > 0)
                this.moveTileRight({ row, column })
        }
        else {
            for (let columnIndex = column - 1; columnIndex >= 0; columnIndex--) {
                if (this.board[row][columnIndex].value === this.board[row][column].value) {
                    this.board[row][column].value = this.board[row][columnIndex].value + this.board[row][column].value
                    this.board[row][columnIndex].gotFrom.forEach((location)=>this.board[row][column].gotFrom.push({row:location.row,column:location.column}))
                    this.board[row][columnIndex].value = null;
                    if(this.board[row][column].gotFrom.length===0)
                    {
                        this.board[row][column].gotFrom.push({ row, column: columnIndex })
                    if (column !== columnIndex)
                        this.board[row][column].gotFrom.push({ row, column })
                    }
                    return;
                }
                else if (this.board[row][columnIndex].value !== null)
                    return;
            }
        }
    }
    moveTileLeft = ({ row, column }) => {
   
        if (this.board[row][column].value === null) {
            let changePlacesCount = 0
            for (let columnIndex = column + 1; columnIndex < this.board.length; columnIndex++) {
                if (this.board[row][columnIndex].value !== null) {
                    this.board[row][column + changePlacesCount].value = this.board[row][columnIndex].value
                    if (this.board[row][columnIndex].gotFrom.length > 0)//added
                    {
                        this.board[row ][column + changePlacesCount].gotFrom = [];
                        this.board[row][columnIndex].gotFrom.forEach((location) => {
                            this.board[row][column + changePlacesCount].gotFrom.push({row:location.row,column:location.column})
                        })
                    }  
                    this.board[row][column + changePlacesCount].gotFrom.push({ row, column: columnIndex })
               
                    this.board[row][columnIndex].value = null;
                    changePlacesCount++;
                }
            }
            if (changePlacesCount > 0)
                this.moveTileLeft({ row, column })
        }
        else {
            for (let columnIndex = column + 1; columnIndex < this.board.length; columnIndex++) {
                if (this.board[row][columnIndex].value === this.board[row][column].value) {
                    
                    this.board[row][column].value = this.board[row][columnIndex].value + this.board[row][column].value
                    this.board[row][columnIndex].gotFrom.forEach((location)=>this.board[row][column].gotFrom.push(location))

                    this.board[row][columnIndex].value = null;
                    if(this.board[row][column].gotFrom.length===0)
                    {this.board[row][column].gotFrom.push({row,column:columnIndex})
                    if (column !== columnIndex)
                    this.board[row][column].gotFrom.push({row,column})}
                    return;
                }
                else if (this.board[row][columnIndex].value !== null)
                    return;
            }
        }
    }
}

// let game = new game2048();
// game.moveTiles("LEFT");
// console.log(game.board);
// game.moveTiles("DOWN");
// console.log(game.board);
export {possibaleMovesList,game2048 as default};
        