import React from 'react';

const Set = (props) => {
    return (
        <div className="Set">
            <p>
                <span className="SetNumbers">
                    <span className="SetNumber">{`Reps: ${props.setData.Reps}`}</span>
                    <span className="SetNumber">{`Weight: ${props.setData.Weight} kg`}</span>                 
                </span>

                <button 
                className="DeleteSet"
                onClick={() => {
                    props.deleteSet(props.setIndex, props.sessionIndex, props.workoutIndex);
                }}>
                Delete</button></p>            
        </div>
    )
}

export default Set;