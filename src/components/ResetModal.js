import React from 'react'
import '../style/resetModal.css'
export default ({ resteCallBack, isEnable}) => {
    return (
        <div className={`modal ${isEnable ? '' : 'hide'}`} >
    <h1>Game Over!</h1>
    <div onClick={resteCallBack} className="reset-button">Try Again</div>
    </div>
    )
}