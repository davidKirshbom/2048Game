import React from 'react'
import Tile from './Tile';
import ResetModal from './ResetModal'
import game2048Logic, { possibaleMovesList } from '../logic/2048game'

import '../style/game2048.css'
class Game2048 extends React.Component {
    constructor(props) {
        super(props);
        this.LogicGame2048 = new game2048Logic();
        this.state = {
            board: this.LogicGame2048.board,
            isGameOver: this.LogicGame2048.isGameOver,
        }
        this.isAnimateOn = false;
        
    }
    componentDidMount() {
        this.addTile(true);
        this.addTile(true);
        
        window.addEventListener("keydown", (event) => {
            let pressLegalKey = false;
            if (!this.isAnimateOn) {
              
                switch (event.key) {
                    case ("ArrowDown"):
                        this.LogicGame2048.moveTiles(possibaleMovesList.down)
                        this.orginzeGridZIndexBigToSmallForAnimation(0, 0, 4, 4, true)
                        pressLegalKey = true;
                        break;
                    case ("ArrowUp"):
                        this.LogicGame2048.moveTiles(possibaleMovesList.up)
                        this.orginzeGridZIndexBigToSmallForAnimation(3, 3, -1, -1, true)
                        pressLegalKey = true;
                        break;
                    case ("ArrowRight"):
                        this.LogicGame2048.moveTiles(possibaleMovesList.right)
                        this.orginzeGridZIndexBigToSmallForAnimation(0, 0, 4, 4, false)
                        pressLegalKey = true;
                        break;
                    case ("ArrowLeft"):
                        this.LogicGame2048.moveTiles(possibaleMovesList.left)
                        this.orginzeGridZIndexBigToSmallForAnimation(3, 3, -1, -1, false)
                        pressLegalKey = true;
                        break;
                    
                }
                if(pressLegalKey)
                {this.isAnimateOn = true;
                this.animateTiles(this.LogicGame2048.board)
                this.addTile();}
                
            }
            
            ;
            
        })
    }
    
    didMakeMove = (newBoard) => {
        const previuseBoard = this.state.board
        for (let row = 0; row < newBoard.length; row++) {
            for (let column = 0; column < newBoard.length; column++) {
                if (previuseBoard[row][column].gotFrom.length>0&&previuseBoard[row][column].value)
                    return true;
            }
            
        }
        return false;
    }
    addTile = (isStart) => {
        setTimeout(
            () => {
                if(isStart||this.didMakeMove(this.LogicGame2048.board))
                {this.setState({ board: [] })
                const addedTileLocation = this.LogicGame2048.addNumberToBoard();
                this.setState({ board: this.LogicGame2048.board })
                const addedTile = document.getElementById(`${"" + addedTileLocation.row + addedTileLocation.column}`)
                addedTile.classList.add("apper")
                setTimeout(() => {
                    this.setState({ isGameOver: this.LogicGame2048.isGameFinish() })
                    this.isAnimateOn = false
                 }, 520)
                }
                else
                {
                    this.setState({ isGameOver: this.LogicGame2048.isGameFinish() })
                    this.isAnimateOn = false
                    }
            }
            , 1020);
    }
    initializeAnimationBoard = (dataBoard) => {
       
        let animationBoard = [[null, null, null, null],
        [null, null, null, null]
            , [null, null, null, null]
            , [null, null, null, null]];
        for (let row = 0; row < dataBoard.length; row++) {
            for (let column = 0; column < dataBoard[row].length; column++) {
                if (dataBoard[row][column].value && dataBoard[row][column].gotFrom.length > 0) {
                    dataBoard[row][column].gotFrom.forEach((originPoint) => {
                        if (originPoint.row !== row || originPoint.column !== column) {
                            animationBoard[originPoint.row][originPoint.column] = { row, column }
                            animationBoard[originPoint.row][originPoint.column].tileId = `${originPoint.row}${originPoint.column}`
                        }
                    })
                }
                
            }
            
        }
        return animationBoard;
    }
    animateTiles = (board) => {
        
        let tilesNeedToPop = []
 
        let animationBoard = this.initializeAnimationBoard(board)
        for (let row = 0; row < animationBoard.length; row++) {
            for (let column = 0; column < animationBoard.length; column++) {
                if (animationBoard[row][column] === null)
                    continue;
                const movingTile = document.getElementById(animationBoard[row][column].tileId)
                let tileSize , gapSize
                if( window.getComputedStyle(movingTile).width==="89px")//desktop
                {
                    console.log("desktop")
                    tileSize = 89;
                    gapSize = 11;
                
                }
                else {
                    console.log("phone")
                    tileSize = 53;
                    gapSize = 12;
                
                }
                
                let translateFactor = (tileSize + gapSize);
                if (movingTile.innerHTML !== "") {
                    const destinationRow = animationBoard[row][column].row;
                    const destinationColumn = animationBoard[row][column].column;
                    if(destinationRow === row)
                    {
                        const squaresToMove = destinationColumn - column;
                        movingTile.style.transform = `translateX(${squaresToMove * translateFactor}px)`
                    }
                    else {
                        const squaresToMove = destinationRow - row;
                        movingTile.style.transform = `translateY(${squaresToMove * translateFactor}px)`
                    }
           
                    if (movingTile.innerHTML !== ""+board[destinationRow][destinationColumn].value&&board[destinationRow][destinationColumn].value!==null)
{
                        tilesNeedToPop.push({ row: destinationRow, column: destinationColumn,movedTile:movingTile })
                      
                    }
                }
            }
           setTimeout(()=> this.finishTileAnimation(tilesNeedToPop, board),520)
        }
    }

     
            
    
    finishTileAnimation = (tilesNeedToPop, gameBoard) => {
        for (let index = 0; index < tilesNeedToPop.length; index++) {
            const { row, column,movedTile } = tilesNeedToPop[index]
            const tileValue=gameBoard[row][column].value
                 movedTile.innerHTML = tileValue;
                const popTile = document.getElementById(`pop-tile${row}${column}`)
                popTile.innerHTML = tileValue;
                popTile.classList.remove('hide')
                popTile.classList.add("pop", `value-${tileValue}`)
                 movedTile.classList.add(`value-${tileValue}`)
        }
       
        
    }
    thereIsAnotherAnimation = (animationBoard) => {
        for (let row = 0; row < animationBoard.length; row++) {
            for (let column = 0; column < animationBoard[row].length; column++) {
                const animationData = animationBoard[row][column];
                if (animationData)
                    return true;
            }
        }
        return false;
    }
    thereIsOntherAnimationToPoint = (point, animationBoard) => {
        for (let row = 0; row < animationBoard.length; row++) {
            for (let column = 0; column < animationBoard[row].length; column++) {
                const animationData = animationBoard[row][column];
                if (animationData && animationData.row === point.row && animationData.column === point.column)
                    return true;
              
            }
           
        }
        return false
    }
    deepCloneTileObj = (location) => {
        return { row: location.row, column: location.column, tileId: location.tileId }
    }
    orginzeGridZIndexBigToSmallForAnimation = (startRow = 0, startColumn = 0, endRow = 4, endColumn = 4, isRows = true) => {
        const rowFactor = startRow < endRow ? 1 : -1;
        const columnFactor = startColumn < endColumn ? 1 : -1
        for (let row = startRow; row !== endRow; row += rowFactor) {
            for (let column = startColumn; column !== endColumn; column += columnFactor) {
                const tile = document.getElementById(`${row}${column}`)
                const container = document.getElementById(`container${row}${column}`)
                if (isRows) {
                    const zIndex = 10 - row * rowFactor
                    tile.style.zIndex = zIndex
                    container.style.zIndex = zIndex
                }
                else {
                    const zIndex = 10 - column * columnFactor
                    tile.style.zIndex = zIndex;
                    container.style.zIndex = zIndex + 1
                }
            }
        }
    }  
    reset = () => {

        this.LogicGame2048 = new game2048Logic();
        this.LogicGame2048.isGameOver = false;
        this.setState( {
            board: this.LogicGame2048.board,
            isGameOver:false,
        })
        this.isAnimateOn = false;
        this.addTile(true);
        this.addTile(true);
    }
    render() {
        const board = (this.state.board);
      
        return (
            <div className="game-container">
              
                <div className="tiles-grid">
                    <ResetModal resteCallBack={this.reset} isEnable={this.state.isGameOver}/>
                    {board.map((row, rowIndex) => {
                        return row.map((data, columnIndex) => {
                            return (<Tile value={data.value} id={`${"" + rowIndex + columnIndex}`} />)
                        })
                    })}
                </div>
            </div>
              
        )
    
    }
}
export default Game2048;