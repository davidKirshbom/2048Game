import React from 'react';
import '../style/tile.css'
export default ({id,value}) => {
    
    return (
        <div className="tile-container" id={`container${id}`}>
                     <div className="tile pop hide" id={`pop-tile${id}`}>
                     </div> 
                    <div className={`tile value-${value}`} id={`${id}`}>
                        {value}
                            </div>
                
                        </div>
    )
}