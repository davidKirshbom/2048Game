import React from 'react';
export default ({id,value}) => {
    
    return (
        <div className="tile-container" id={`container${id}`}>
                    <div className="pop-tile hide" id={`pop-tile${id}`}>
                    </div> 
                    <div className={`tile value-${value}`} id={`${id}`}>
                        {value}
                            </div>
                
                        </div>
    )
}