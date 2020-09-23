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
             isGameOver:this.LogicGame2048.isGameOver,
        }
        this.isAnimateOn = false;
       
    }
    componentDidMount() {
        window.addEventListener("keydown", (event) => {
            if (!this.isAnimateOn) {
                switch (event.key) {
                    case ("ArrowDown"):
                        this.LogicGame2048.moveTiles(possibaleMovesList.down)
                        this.orginzeGridZIndexBigToSmallForAnimation(0, 0, 4, 4, true)
                        break;
                    case ("ArrowUp"):
                        this.LogicGame2048.moveTiles(possibaleMovesList.up)
                        this.orginzeGridZIndexBigToSmallForAnimation(3, 3, -1, -1, true)
                        break;
                    case ("ArrowRight"):
                        this.LogicGame2048.moveTiles(possibaleMovesList.right)
                        this.orginzeGridZIndexBigToSmallForAnimation(0, 0, 4, 4, false)
                        break;
                    case ("ArrowLeft"):
                        this.LogicGame2048.moveTiles(possibaleMovesList.left)
                        this.orginzeGridZIndexBigToSmallForAnimation(3, 3, -1, -1, false)
                        break;
                }
                this.isAnimateOn = true;
                this.animateTiles(this.LogicGame2048.board).then(() => {
                    this.setState({ board: [] })
                    const addedTileLocation = this.LogicGame2048.addNumberToBoard();
                    this.setState({ board: this.LogicGame2048.board })
                   const addedTile= document.getElementById(`${""+addedTileLocation.row+addedTileLocation.column}`)
                    addedTile.classList.add("apper")
                   setTimeout(()=> this.isAnimateOn = false,350);
                });
            }
            
            ;
            
        })
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
        return new Promise((resolve) => {
            const gapSize = 11;
            const tileSize = 89;
            let translateX = (tileSize + gapSize);
            let translateY = (tileSize + gapSize);
            let animationBoard = this.initializeAnimationBoard(board)
            let itaresionCount = 1;
            const interval = 120;
            const animationInterval = setInterval(() => {
                let newAnimationBoard = [
                    [null, null, null, null]
                    , [null, null, null, null]
                    , [null, null, null, null]
                    , [null, null, null, null]
                ];
                for (let row = 0; row < animationBoard.length; row++) {
                    for (let column = 0; column < animationBoard.length; column++) {
                        if (animationBoard[row][column] === null)
                            continue;
                        const movingTile = document.getElementById(animationBoard[row][column].tileId)
                        if (movingTile.innerHTML !== "") {
                            const destinationRow = animationBoard[row][column].row;
                            const destinationColumn = animationBoard[row][column].column;
                            if (destinationRow > row) {
                                newAnimationBoard[row + 1][column] = this.deepCloneTileObj(animationBoard[row][column]);
                                movingTile.style.transform = `translateY(${itaresionCount * translateY}px)`
                            }
                            else if (destinationRow < row) {
                                newAnimationBoard[row - 1][column] = this.deepCloneTileObj(animationBoard[row][column]);
                                movingTile.style.transform = `translateY(${-itaresionCount * translateY}px)`
                            }
                            else if (destinationColumn < column) {
                                newAnimationBoard[row][column - 1] = this.deepCloneTileObj(animationBoard[row][column]);
                                movingTile.style.transform = `translateX(${-itaresionCount * translateX}px)`
                            }
                            else if (destinationColumn > column) {
                                newAnimationBoard[row][column + 1] = this.deepCloneTileObj(animationBoard[row][column]);
                                movingTile.style.transform = `translateX(${itaresionCount * translateX}px)`
                            }
                            if (row === destinationRow && column === destinationColumn) {
                                animationBoard[row][column] = null;
                                if (!this.thereIsOntherAnimationToPoint({ row, column }, animationBoard)) {
                                   this.finishTileAnimation({row,column},movingTile,board)
                                }
                            }
                        }
                    }
                }
                if (!this.thereIsAnotherAnimation(animationBoard)) {
                    const waitPopAnimation=setTimeout(() => {
                        clearInterval(animationInterval)
                        resolve();
                    }, 530)       
                }
                else {
                    animationBoard = newAnimationBoard
                    itaresionCount++;
                }
            }, interval)
        })
    }
    finishTileAnimation = ({row,column},movedTile,gameBoard) => {
        const tileValue = gameBoard[row][column].value;
        if (tileValue != movedTile.innerHTML) {
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

    }
    render() {
        const board = (this.state.board);
        return (
            <div className="game-container">
              
                <div className="tiles-flexbox">
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