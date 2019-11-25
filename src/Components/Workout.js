import React, {useState} from 'react';
import AddSet from './AddSet';
import Set from './Set';
import StackedColumnGraph from './StackedColumnGraph';
import MultiSeriesLineGraph from './MultiSeriesLineGraph';

const Workout = (props) => {

    const [editing, setEditing] = useState(false);
    const [editedWorkoutName, setEditedWorkoutName] = useState("");
    const [showGraph, setShowGraph] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setEditing(false);
        props.editWorkoutName(editedWorkoutName, props.workoutIndex);
        setEditedWorkoutName("");
    }

    const handleChange = (e) => {
        setEditedWorkoutName(e.target.value);
    }

    const startEditing = () => {
        setEditing(!editing);
        setEditedWorkoutName(props.workoutData.WorkoutName);
    }

    const editingForm = <form onSubmit={handleSubmit}>
        <input onChange={handleChange} value={editedWorkoutName} type="text"/>
        <input value="Edit" type="submit"/>
    </form>

    const renderSets = () => {
        let sessionIndex = props.findSessionIndex(props.workoutIndex, new Date());

        if (sessionIndex !== -1 && props.workoutData.Sessions[sessionIndex].Sets.length !== 0)
        {
            let sets = props.workoutData.Sessions[sessionIndex].Sets.map((set, setIndex) => {
                return <div className="DivSet" key={setIndex}><Set 
                deleteSet={props.deleteSet} 
                 workoutIndex={props.workoutIndex} sessionIndex={sessionIndex} setIndex={setIndex}
                setData={set} /></div>
            })
            sets.reverse();
            return sets;
        }
        return "No sets added today";
    } 

    return (
        <div className="WorkoutContainer">
            
            {showGraph && (props.workoutData.Sessions.length === 0 ? "No graphs avaible" :
            <React.Fragment>
                <p className="LabelForGraphs">{props.workoutData.WorkoutName}</p>
                <hr/>
                <div className="Graphs">
                    <StackedColumnGraph data={props.workoutData} /> 
                    <MultiSeriesLineGraph data={props.workoutData} />
                </div>
            </React.Fragment>
            )}
            
            {/* ========================= */}
            <p className="WorkoutName">{!editing ? props.workoutData.WorkoutName : editedWorkoutName}</p>
            <button onClick={() => {props.deleteWorkout(props.workoutIndex)}}>Delete</button>
            <button onClick={startEditing}>{editing ? "Cancel edit" : "Edit"}</button>
            <button onClick={() => {setShowGraph(!showGraph)}}>{showGraph ? "Hide graphs" : "Show graphs"}</button>
            <AddSet workoutIndex={props.workoutIndex} addSet={props.addSet} />
            {editing && editingForm}
            <div className="AllSets">
                {renderSets()}
            </div>
        </div>
    )
}

export default Workout;