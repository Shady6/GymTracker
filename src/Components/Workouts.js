import React, {useState, useEffect} from 'react';
import AddWorkout from './AddWorkout';
import Workout from './Workout';
import Navbar from './Navbar';

const Workouts = (props) => {

    const [workouts, setWorkouts] = useState([]);

    // Load all the workouts from local storage on render of the main component
    useEffect(() => {
        if (localStorage.Workouts)
        {
            let storageWorkouts = JSON.parse(localStorage.Workouts);
            for (let i = 0; i < storageWorkouts.length; i++)
            {
                for (let j = 0; j < storageWorkouts[i].Sessions.length; j++)
                    storageWorkouts[i].Sessions[j].Date = new Date(Date.parse(storageWorkouts[i].Sessions[j].Date))
            }
            setWorkouts(storageWorkouts);
        }
    }, [])

    const findSessionIndex = (workoutIndex, date) => {
        if (workouts.length !== 0)
        {
            for(let i = 0; i < workouts[workoutIndex].Sessions.length; i++)
            {
                let checkedDate = workouts[workoutIndex].Sessions[i].Date;
                
                if (checkedDate.getDay && date.getDate() === checkedDate.getDate() &&
                 date.getMonth() === checkedDate.getMonth())
                    return i;
            }
        }      
        return -1;
    }

    const saveWorkouts = (workout) => {
        localStorage.Workouts = JSON.stringify(workout); 

        for (let i = 0; i < workout.length; i++) 
        {
            for (let j = 0; j < workout[i].Sessions.length; j++) 
            {
                workout[i].Sessions[j].Date = new Date(workout[i].Sessions[j].Date);      
            }          
        }

        setWorkouts(workout);
    }

    const addWorkout = (workoutName) => {
        let newWorkouts = [...workouts, {"WorkoutName": workoutName, "Sessions": []}];
        saveWorkouts(newWorkouts)       
    }

    const deleteWorkout = (workoutIndex) => {
        let newWorkouts = workouts.filter((item, i) => i !== workoutIndex);
        saveWorkouts(newWorkouts)   
    }

    const editWorkoutName = (editedWorkoutName, index) => {
        let newWorkouts = workouts.map((item, i) => {
            if (i === index) item.WorkoutName = editedWorkoutName;
                return item;
        });
        saveWorkouts(newWorkouts)    
    }

    const addSet = (reps, weight, workoutIndex) => {
        if (reps && weight && reps !== 0 && weight !== 0)
        {
            let helperDate = new Date()
            let today = new Date(helperDate.getFullYear(), helperDate.getMonth(), helperDate.getDate());
            let sessionIndex = findSessionIndex(workoutIndex, today);
            let workoutsCopy = [...workouts];
    
            if (sessionIndex !== -1)
            {
                workoutsCopy[workoutIndex].Sessions[sessionIndex].Sets.push({"Reps": reps, "Weight": weight});
            }
            else
            {
                workoutsCopy[workoutIndex].Sessions.push({"Date": today, "Sets": [{"Reps": reps, "Weight": weight}]})
            }
    
            saveWorkouts(workoutsCopy);
        }
       
    }

    const deleteSet = (setIndex, sessionIndex, workoutIndex) => {
        let newSets = workouts[workoutIndex].Sessions[sessionIndex].Sets.filter((item, i) => i !== setIndex)        
        let newWorkouts = [...workouts];

        if (newSets.length !== 0)
            newWorkouts[workoutIndex].Sessions[sessionIndex].Sets = newSets;
        else
            newWorkouts[workoutIndex].Sessions = newWorkouts[workoutIndex].Sessions.filter((item, i) => i !== sessionIndex)

        saveWorkouts(newWorkouts)
    }


    const exportWorkoutData = ()=> {
        var file = new Blob([JSON.stringify(workouts)], {type: typeof(String)});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, "Workout Data");
        else { // Others
            let a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = "Workout Data";
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
    }

    const importWorkoutData = (event) =>
    {
        console.log('hey')
        let file = event.target.files[0];          
        file.text().then((text) => {
            saveWorkouts(JSON.parse(text));
        });               
    }

    const clearWorkouts = () => {
        localStorage.clear();
        setWorkouts([]);
    }

    const renderWorkouts = workouts.map ? workouts.map((workout, index) => 

    <Workout 
    deleteSet={deleteSet} 
    addSet={addSet} 
    deleteWorkout={deleteWorkout} 
    editWorkoutName={editWorkoutName}
    findSessionIndex={findSessionIndex} 
    key={index} 
    workoutIndex={index} 
    workoutData={workout}/>
    ) : null

    return (
        <div className="Workouts">
            <Navbar
            clearData={clearWorkouts} 
            importData={importWorkoutData}
            exportData={exportWorkoutData} />
            <div className="AppContent">
                <AddWorkout 
                className="AddWorkout"
                addWorkout={addWorkout} />
                {renderWorkouts.length !== 0 ? renderWorkouts : <p>No workouts avaible</p>}                          
            </div>
        </div>
    );
}

export default Workouts;

/*

localStorage.Workouts = 
    [
        {
            WorkoutName : "Bench press",
            Sessions : [
                {
                    Date : 30.10.2019
                    Sets : [
                        {
                            Reps : 10,
                            Weight : 50
                        }
                    ]
                }
            ]
        }
    ]

*/