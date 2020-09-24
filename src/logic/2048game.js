const possibaleMovesList = {
    up: "UP",
    down: "DOWN",
    right: "RIGHT",
    left: "LEFT"
}

class game2048 {
    constructor() {
        this.board = [
            [{ value: null, gotFrom: [] }, { value: null, gotFrom: [] }, { value: null, gotFrom: [] }, { value: null, gotFrom: [] }]
          , [{value:null,gotFrom:[]}, {value:null,gotFrom:[]}, {value:null,gotFrom:[]}, {value:null,gotFrom:[]}]
          , [{value:null,gotFrom:[]}, {value:null,gotFrom:[]}, {value:null,gotFrom:[]}, {value:null,gotFrom:[]}]
           , [{ value: null, gotFrom: [] }, { value: null, gotFrom: [] }, { value: null, gotFrom: [] }, { value: null, gotFrom: [] }]
        ]
        this.isGameOver = false;
    
    }
    addNumberToBoard = () => {
        let rowToAdd =parseInt (Math.random() * 100 % 3);
        let columnToAdd = parseInt(Math.random() * 100 % 3);
        let foundRandomEmptyPlace = false;
        while(!foundRandomEmptyPlace)
        {
            
            if (this.board[rowToAdd][columnToAdd].value !== null) {
                rowToAdd++;
                if (rowToAdd < this.board.length)
                {
                    columnToAdd++;
                    if (columnToAdd === this.board.length)
                        columnToAdd = 0;
                }
                else {
                    rowToAdd = 0;
                }
            }
            else {
                this.board[rowToAdd][columnToAdd].value =parseInt( (Math.random() * 100) )% 6 === 2 ? 4 : 2;
                foundRandomEmptyPlace = true;
              
            }
         
        }
        this.isGameOver = this.isGameFinish();
      
        return { row: rowToAdd, column: columnToAdd }
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
            this.fillEmptyPlacesColumn({ row, column }, true)
        }
        else {
                        
                for (let rowIndex = row + 1; rowIndex <this.board.length;rowIndex++)
                if(this.board[rowIndex][column].value===this.board[row][column].value)
                {
                    this.margeTiles({ row, column }, { row: rowIndex, column })
                    return;
                }
                    else if (this.board[rowIndex][column].value !== null)
                        return
     
        }
    }
    moveTileDown = ({ row, column }) => {
        if (this.board[row][column].value == null) {
            this.fillEmptyPlacesColumn({row,column},false)
        }
        else {
            for (let rowIndex = row - 1; rowIndex >= 0;rowIndex--)
            if(this.board[rowIndex][column].value===this.board[row][column].value)
            {
                this.margeTiles({ row, column }, { row: rowIndex, column })
                return;
            }
                else if (this.board[rowIndex][column].value !== null)
                    return
 
        }
    }
    fillEmptyPlacesColumn = ({ row, column },isUp) => {
        const factorUpDown = isUp ? 1 : -1;
        const endRow = isUp ? this.board.length : -1;
        let changePlacesCount = 0
        for (let rowIndex = row + factorUpDown; rowIndex !== endRow; rowIndex+=factorUpDown) {
            if (this.board[rowIndex][column].value !== null) {
                const rowIndexMoveTo = row + changePlacesCount * factorUpDown;
                this.board[rowIndexMoveTo][column].value = this.board[rowIndex][column].value
                if (this.board[rowIndex][column].gotFrom.length > 0)
                {
                    this.board[rowIndexMoveTo][column].gotFrom = [];
                    this.board[rowIndex][column].gotFrom.forEach((location) => {
                        this.board[rowIndexMoveTo][column].gotFrom.push({row:location.row,column:location.column})
                    })
                }  
                else
                 this.board[rowIndexMoveTo][column].gotFrom.push({row:rowIndex,column})
                this.board[rowIndex][column].value = null;
                changePlacesCount++;
            }
        }
        if (changePlacesCount > 0)
            {if(isUp)
                this.moveTileUp({ row, column })
            else this.moveTileDown({row,column})}
    }
    moveTileRight = ({ row, column }) => {
        if (this.board[row][column].value === null) {
            this.fillEmptyPlacesRow({ row, column }, false);
        }
        else {
            
                for (let columnIndex = column - 1;  columnIndex >= 0;columnIndex--)
                if(this.board[row][columnIndex].value===this.board[row][column].value)
                {
                    this.margeTiles({ row, column }, { row, column: columnIndex })
                    return;
                }
                    else if (this.board[row][columnIndex].value !== null)
                        return
        }
    }
    moveTileLeft = ({ row, column }) => {
   
        if (this.board[row][column].value === null) {
            this.fillEmptyPlacesRow({ row, column }, true)
        }
        else {
            
                
                for (let columnIndex = column + 1;  columnIndex <this.board.length;columnIndex++)
                if(this.board[row][columnIndex].value===this.board[row][column].value)
                {
                    this.margeTiles({ row, column }, { row, column: columnIndex })
                    return;
                }
                    else if (this.board[row][columnIndex].value !== null)
                        return
        }
    }
    fillEmptyPlacesRow = ({ row, column }, isLeft) => { 
        let changePlacesCount = 0;
        const factorRightLeft = isLeft ? 1 : -1;
        const endColumn = isLeft ? this.board.length : -1;
            for (let columnIndex = column +factorRightLeft; columnIndex !==endColumn; columnIndex+=factorRightLeft) {
                const columnIndexMoveTo = column + changePlacesCount * factorRightLeft;
                if (this.board[row][columnIndex].value !== null) {
                    this.board[row][columnIndexMoveTo].value = this.board[row][columnIndex].value
                    if (this.board[row][columnIndex].gotFrom.length > 0)//added
                    {
                        this.board[row][columnIndexMoveTo].gotFrom = [];
                        this.board[row][columnIndex].gotFrom.forEach((location) => {
                            this.board[row][columnIndexMoveTo].gotFrom.push({ row: location.row, column: location.column })
                        });
                    }  
                    this.board[row][columnIndexMoveTo].gotFrom = []
                     this.board[row][columnIndex].gotFrom.forEach((location)=>this.board[row][column - changePlacesCount].gotFrom.push({row:location.row,column:location.column}))
                    this.board[row][columnIndexMoveTo].gotFrom.push({ row, column: columnIndex })
                    
                    this.board[row][columnIndex].value = null;
                    changePlacesCount++;
                }
            }
        if (changePlacesCount > 0) {
            if (isLeft)
                this.moveTileLeft({row,column})
            else this.moveTileRight({ row, column })
        }
    }
    margeTiles = (margeLocation,otherTileLocation ) => {
        let tileMargeTo = this.board[margeLocation.row][margeLocation.column]
        let otherTile=this.board[otherTileLocation.row][otherTileLocation.column]
 
        tileMargeTo.value += otherTile.value;
        otherTile.gotFrom.forEach((location) => tileMargeTo.gotFrom.push(location))
        otherTile.value = null;
        otherTile.gotFrom = [];
        if (tileMargeTo.gotFrom.length === 0) {
            tileMargeTo.gotFrom.push({ row: otherTileLocation.row, column:otherTileLocation.column })
            if (tileMargeTo.row !== otherTileLocation.row)
            tileMargeTo.gotFrom.push({ row:margeLocation.row, column:margeLocation.column })
        }
        
    
 
    }
    isGameFinish = () => {
        const board = this.board;
        for (let row = 0; row < board.length; row++) {
            for (let column = 0; column < board.length; column++) {
                if (board[row][column].value == null)
                    return false;
                if (column + 1 < board.length && board[row][column].value === board[row][column + 1].value)
                    return false;
                if (row + 1 < board.length && board[row][column].value === board[row + 1][column].value)
                    return false;
            }
            
        }
        return true;
    }
   
}
export {possibaleMovesList,game2048 as default};
        