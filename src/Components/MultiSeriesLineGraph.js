/* eslint-disable no-lone-blocks */
import React from 'react';
import { VictoryBar,
    VictoryChart,
    VictoryAxis,
    VictoryTheme,
    VictoryStack,
    VictoryTooltip, 
    VictoryGroup,
    VictoryVoronoiContainer,
    VictoryLine,
    VictoryLabel,
    LineSegment,
    VictoryScatter }
        from 'victory';
import { assignmentExpression } from '@babel/types';

const MultiSeriesLineGraph = (props) => {       

  let scatterEventHandlers = 
  {
    onMouseOver: () => {
      return [
        {
          target: "data",
          mutation: () => ({style: {fill: "#2c2374", width: 0}, size: 4})
        }, {
          target: "labels",
          mutation: () => ({ active: true })
        }
      ];
    },
    onMouseOut: () => {
      return [
        {
          target: "data",
          mutation: () => {}
        }, {
          target: "labels",
          mutation: () => ({ active: false })
        }
      ];
    }
  }

    const formatData = () => {

        let workout = props.data;
        let data = []
        let totalWeight = 0;   

        for (let i = 0; i < workout.Sessions.length; i++)
        {
            let dataValueOffset = 0;

            for (let j = 0; j < workout.Sessions[i].Sets.length; j++)
            {                
                data.push({
                "Reps": workout.Sessions[i].Sets[j].Reps, 
                "RepsValue": workout.Sessions[i].Sets[j].Reps,
                "Weight": workout.Sessions[i].Sets[j].Weight, 
                "Date": workout.Sessions[i].Date.getTime(),
                "DateValue": (i+1) * 10 + dataValueOffset
              });

                totalWeight += workout.Sessions[i].Sets[j].Weight;
                dataValueOffset += 10 / workout.Sessions[i].Sets.length;
            }
        }

        let ratio = totalWeight / data.length / 12;

        for (let i = 0; i < data.length; i++) 
              data[i].RepsValue *= ratio;                      

        return [data, ratio];
    }

    const renderGraph = () => {

        const [data, ratio] = formatData();
        let workoutDate = new Date();
        console.log(data);
        
        return (
            <VictoryChart domainPadding={20}>

                    <VictoryAxis                    
                    tickValues={data.map( item => item.DateValue)} 
                    tickFormat={(x, i) => 
                    {              
                        if (i === 0 || workoutDate.toDateString() !== new Date(data[i].Date).toDateString())
                        {                            
                            workoutDate = new Date(data[i].Date);
                            return `${workoutDate.getDate()}.${workoutDate.getMonth() + 1}`
                        }
                        return null;
                    }
                  }/>                  
                    
                    <VictoryAxis 
                    tickValues={data.map(set => set.RepsValue)} 
                    tickFormat={(y, i) => i % 2 === 0 ? `${Math.round(y / ratio)} r` : null} 
                    dependentAxis />

                    <VictoryAxis 
                    offsetX={400} 
                    tickFormat={(y) => `${y} kg`} 
                    style={{
                      tickLabels: {textAnchor: "start"},
                      ticks: {padding: -15}
                    }} 
                    dependentAxis />
                            
              
              <VictoryGroup
              animate={{
                onExit: {
                  duration: 350,
                  before: () => ({
                    _y: 0
                  })
                }
              }}                
                labels={({ datum }) => `Reps: ${datum.Reps}`}
                labelComponent={
                  <VictoryTooltip
                    style={window.innerWidth < 600 ? { fontSize: 20 } : {fontSize: 10}}                                                                                                                         
                  />
                }
                data={data}
                x="DateValue"
                y="RepsValue"
              >
                <VictoryLine 
                color="#49c330"
                style={{

                  // data: { fill: "tomato", opacity: 0.7 },
                  // labels: { fontSize: 12 },
                  // parent: { border: "1px solid #ccc" }
                }}
                interpolation="natural" />

                <VictoryScatter
                color="#1b4c11"
                  size={ window.innerWidth < 600 ? ({ active }) => active ? 8 : 6 : ({ active }) => active ? 4 : 3}                
                  events={[{
                    target: "data",
                    eventHandlers: scatterEventHandlers
                  }]}
                />

              </VictoryGroup>
              
              <VictoryGroup
              animate={{
                onExit: {
                  duration: 350,
                  before: () => ({
                    _y: 0
                  })
                }
              }}  
                color="#c43a31"
                labels={({ datum }) => `Weight: ${datum.Weight} kg`}
                labelComponent={
                  <VictoryTooltip
                    style={window.innerWidth < 600 ? { fontSize: 20 } : {fontSize: 10}}                                                                                                                           
                  />
                }
                data={data}
                x="DateValue"
                y="Weight"
              >
                <VictoryLine 
                color="#38b9dc"
                interpolation="natural"/>
                
                <VictoryScatter
                  color="#155061"
                  size={ window.innerWidth < 600 ? (({ active }) => active ? 8 : 6) : (({ active }) => active ? 4 : 3)}   
                  events={[{
                    target: "data",
                    eventHandlers: scatterEventHandlers
                  }]}
                />

              </VictoryGroup>

           </VictoryChart>
        );
    }

   

    return (
        props.data.Sessions.length === 0 ? null : renderGraph()
    );
}

export default MultiSeriesLineGraph;

