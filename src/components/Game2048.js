import React, { useEffect } from 'react'

import game2048Logic,{possibaleMovesList} from '../logic/2048game'
import '../style/game2048.css'
class Game2048 extends React.Component{
    constructor(props)
    {
        super(props);
        this.LogicGame2048 = new game2048Logic();
        this.state = {
            board:this.LogicGame2048.board,
             
        }
        this.isAnimateOn = false;
       
    }
     initializeAnimationBoard=(dataBoard) =>{
       
         let animationBoard = [[null, null, null, null],
                              [null, null, null, null]
                            , [null, null, null, null]
                            , [null, null, null, null]];
        for (let row = 0; row < dataBoard.length; row++) {
            for (let column = 0; column < dataBoard[row].length; column++) {
                if (dataBoard[row][column].value&&dataBoard[row][column].gotFrom.length > 0) {
                    dataBoard[row][column].gotFrom.forEach((originPoint) => {
                        if(originPoint.row!==row||originPoint.column!==column)
                        {
                            animationBoard[originPoint.row][originPoint.column] = { row, column }
                            animationBoard[originPoint.row][originPoint.column].tileId = `${originPoint.row}/${originPoint.column}`
                        }
                    })
                }
                
            }
            
        }
         return animationBoard;
    }
    animateTiles = (board) => {
        return new Promise((resolve) => {
            const gapSize = 0;
            const tileSize = 100;
            let translateX = (tileSize + gapSize);
            let translateY = (tileSize + gapSize);
            let animationBoard = this.initializeAnimationBoard(board)
            let itaresionCount = 1;
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
                        if (movingTile.innerHTML!=="") {
                            const destinationRow = animationBoard[row][column].row;
                            const destinationColumn = animationBoard[row][column].column;
                            if (destinationRow > row) {

                                newAnimationBoard[row + 1][column] = this.deepCloneLocationObj(animationBoard[row][column]);
                       
                               
                                movingTile.style.transform = `translateY(${itaresionCount*translateY}px)`
                            }
                            else if (destinationRow < row) {
                                newAnimationBoard[row - 1][column] = this.deepCloneLocationObj(animationBoard[row][column]);
                                
                             
                                movingTile.style.transform = `translateY(${-itaresionCount*translateY}px)`
                            }
                            else if (destinationColumn < column) {
                                newAnimationBoard[row][column - 1] = this.deepCloneLocationObj(animationBoard[row][column]);
                              
                                movingTile.style.transform = `translateX(${-itaresionCount*translateX}px)`
                            }
                            else if (destinationColumn > column) {
                                newAnimationBoard[row][column + 1] = this.deepCloneLocationObj(animationBoard[row][column]);
                                movingTile.style.transform = `translateX(${itaresionCount*translateX}px)`
                            }
                             if (row === destinationRow && column === destinationColumn) {
                                animationBoard[row][column] = null;
                                if(!this.thereIsOntherAnimationToPoint({row,column},animationBoard))
                                {
                                    const tileValue = board[row][column].value;
                                    if(tileValue!=movingTile.innerHTML)
                                   { movingTile.innerHTML = tileValue;
                                    const popTile = document.getElementById(`pop-tile${row}/${column}`)
                                    popTile.innerHTML = tileValue;
                                    popTile.classList.remove('hide')
                                    popTile.classList.add("pop", `value-${tileValue}`)
                                    movingTile.classList.add(`value-${tileValue}`)}

                                }
                               
                            }
                        }
                    }
                }
                if (this.thereIsAnotherAnimation(animationBoard)) {
                    setTimeout(() => {
                        resolve();
                        clearInterval(animationInterval)
                    }, 250)
                            
                            
                        }
                        else {
                            animationBoard = newAnimationBoard
                            itaresionCount++;
                }
                    },210 )
        
        })
    }
    thereIsAnotherAnimation = (animationBoard) => {
        for (let row = 0; row < animationBoard.length; row++) {
            for (let column = 0; column < animationBoard[row].length; column++) {
                const animationData = animationBoard[row][column];
                if (animationData)
                    return false;
            }
        }
        return true;
    }
    thereIsOntherAnimationToPoint = (point,animationBoard) => {
       for (let row = 0; row < animationBoard.length; row++) {
           for (let column = 0; column < animationBoard[row].length; column++) {
               const animationData = animationBoard[row][column];
               if (animationData&&animationData.row === point.row && animationData.column === point.column)
                   return true;
              
          }
           
        }
        return false
   }
    deepCloneLocationObj = (location)=>
    {
        return {row:location.row,column:location.column,tileId:location.tileId}
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
                console.log(this.LogicGame2048.board)
                this.animateTiles(this.LogicGame2048.board).then(() => {
                    console.log(this.LogicGame2048.board)
                    this.setState({ board: [] })
                    this.setState({ board: this.LogicGame2048.board })
                    this.isAnimateOn = false;
                });
            }
            
            ;
            
      })
    }
    orginzeGridZIndexBigToSmallForAnimation = (startRow=0,startColumn=0,endRow=4,endColumn=4,isRows=true) => {
        const rowFactor = startRow <endRow ? 1 : -1;
        const columnFactor = startColumn <endColumn ? 1 : -1
        for (let row=startRow; row !== endRow; row+=rowFactor)
        {
            for (let column = startColumn; column !== endColumn; column += columnFactor)
            {
                const tile = document.getElementById(`${row}/${column}`)
                const container = document.getElementById(`container${row}/${column}`)
                if(isRows)
                {
                    const zIndex=10 - row*rowFactor 
                    tile.style.zIndex =zIndex
                    container.style.zIndex=zIndex
                }
                else
                {
                    const zIndex = 10 - column*columnFactor
                    tile.style.zIndex = zIndex;
                    container.style.zIndex=zIndex+1
                }
            }
            
            
        }
    }
    getOneDemensionBoard = (board) => {
        let result = [];
        for (let row = 0; row < board.length; row++) {
            for (let column = 0; column < board.length; column++) {
               
                result.push(board[row][column])
            }
            
        }
   
        return result;
    }
    
    render() {
       
        const board = this.getOneDemensionBoard(this.state.board);
        // console.log(this.requestAnimationMove())
      
        return (
            <div className="game-container">
         
            <div className="tiles-flexbox">
                    <div className=" game-board">
                        {board.map((data,index) =>
                        {
                            const row = parseInt(index / 4);
                            const column = index % 4;
                            return (<div className="game-board-top">
                                <div className="pop-tile hide" id={`pop-tile${row}/${column}`}>
                                    
                                </div>
                            </div>)
                        })}
                    </div>
            { board.map((data, index) => {
                const row = parseInt(index / 4);
                const column = index % 4;
                // let zIndex = 10-row;
                
                return (
                     
                    <div  className="tile-container" id={`container${row}/${column}`}>
                    <div className={`tile value-${data.value}`} id={`${row}/${column}`}>
                        {data.value}
            
            
                            </div>
                
                        </div> )
    })
          }
          </div>
                </div>
              
        )
    }
}
export default Game2048;