import React, {useState} from 'react';

const AddSet = (props) => {

    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        props.addSet(reps, weight, props.workoutIndex)
        setReps('');
        setWeight('');
    }

    const handleRepsInput = (e) => {
        if (e.target.value.length === 0 && reps.length !== 0)
        {
            setReps("");
        }
        else if (parseInt(e.target.value) || e.target.value[e.target.value.length - 1].charCodeAt() === 8)
        {
            setReps(parseInt(e.target.value));
        }
    }

    const handleWeightInput = (e) => {
        if (e.target.value.length === 0 && weight.length !== 0)
        {
            setWeight("");
        }
        else if (parseInt(e.target.value) || e.target.value[e.target.value.length - 1].charCodeAt() === 8)
        {
            setWeight(parseInt(e.target.value));
        }
    }

    return (
        <div className="AddSet">
            <form onSubmit={handleSubmit}>

                <div>
                    <label>
                        <p className="SetSpecs">Reps</p>
                        <input onChange={handleRepsInput} value={reps} className="RepsInput" type="text"/>
                    </label>

                    <label>
                        <p className="SetSpecs">Weight</p>
                        <input onChange={handleWeightInput} value={weight} className="WeightInput" type="text"/>
                    </label>
                </div>
                
            <input value="Submit" type="submit"/>
            </form>
        </div>
    )
}

export default AddSet;