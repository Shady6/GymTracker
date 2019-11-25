import React, {useState} from 'react';

const AddWorkout = (props) => {

    const [workoutName, setWorkoutName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (workoutName)
        {
            props.addWorkout(workoutName);
            setWorkoutName('');
        }        
    }

    return (
        <div className="AddWorkout">
            <form onSubmit={handleSubmit}>
                <label>

                    <p>Workout name</p>
                    <input className="WorkoutNameInput"
                    type="text" value={workoutName}
                    onChange={(e) => {setWorkoutName(e.target.value)}} />

                </label>
                <input type="submit" value="Submit"/>
            </form>
        </div>
    )
}

export default AddWorkout;