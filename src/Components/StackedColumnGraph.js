import React, {useState} from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryStack, VictoryTooltip } from 'victory';

const StackedColumnGraph = (props) => {
    
    let events = [{
        target: "data",
        eventHandlers: {
          onMouseOver: () => {
            return [
              {
                target: "data",
                mutation: () => ({style: {fill: "#2c2374", width: 0}})
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
      }]

    const quickSort = (lo, hi, arr) =>
    {
        let mid = arr[Math.floor((lo + hi) / 2 )].Date.getTime();
        let i = lo;
        let j = hi;
        do
        {
            while (arr[i].Date.getTime() < mid) i++;
            while (arr[j].Date.getTime() > mid) j--;
            if (i <= j)
            {
                let t = arr[i];
                arr[i] = arr[j];
                arr[j] = t;
                i++;
                j--;
            }
        } while (i <= j);

        if (j > lo) quickSort(lo, j, arr);
        if (i < hi) quickSort(i, hi, arr);        
    }

    const processData = () => {

        let data = [];
        let maxSetsLength = -1;
        let sessions = props.data.Sessions;
        quickSort(0, sessions.length - 1, sessions);

        for (let i = 0; i < sessions.length; i++)
        {
            if (sessions[i].Sets.length > maxSetsLength)
                maxSetsLength = sessions[i].Sets.length;
        }
        
        for (let i = 0; i < maxSetsLength; i++)
        {        
            let subData = [];
            for (let j = 0; j < sessions.length; j++)
            {
                if (sessions[j].Sets.length !== 0)
                {
                    const [reps, weight] = i >= sessions[j].Sets.length ?  [0, 0] : [sessions[j].Sets[i].Reps, sessions[j].Sets[i].Weight];
                    subData.push({
                    "Date": sessions[j].Date,
                    "DateValue": (j+1) * 10,
                    "SetVolume": reps*weight,
                    "label": `Set ${i + 1} : ${reps*weight} kg\n${reps}x${weight} kg`});
                }                
            }
            data.push(subData);            
        }

        return data;
    }

    // renders each setvolume in a bar so user can distinguish how much volume he did per set and per all sets so per session
    const renderGraph = () => {
        // processes data in a way prepared for this visualization (stacked columns)
        let data = processData();
        let j = 0;
        let sessionsCount = Math.floor((data[0][data[0].length - 1].DateValue - data[0][0].DateValue) / 10)
        let victoryBars = data.map((session, i) => {
          if (j*25 >= 255)
            j = 0;
          j++;
          let color = `rgba(${j*25}, ${0}, ${j*50}, 255)`

          return <VictoryBar
          animate={{
            onExit: {
              duration: 350,
              before: () => ({
                _y: 0
              })
            }
          }}
              labelComponent={<VictoryTooltip 
                // style={{padding: 0, margin: 0} } 
                style={window.innerWidth < 600 ? { fontSize: 20 } : {fontSize: 10}} 
                lyoutStyle={{strokeWidth: 1, stroke: "rgb(170,170,170)"}} dy={5} centerOffset={{x: 25}}
                flyoutWidth={(datum) => {return datum.text.length / 3 * datum.style.fontSize}} />            
                }
              style = {{
                data: {fill: color}                
              }}     
              barWidth={sessionsCount < 3 ? 30 : null} 
              key={i} x="DateValue" y="SetVolume" data={session} events={events} /> });
        

        return (
            <VictoryChart domainPadding={20}>  
            
                <VictoryAxis
                tickValues={data[0].map( item => {return item.DateValue})} 
                tickFormat={(x, i) => { 
                  let d = new Date(data[0][i].Date);
                  return `${d.getDate()}.${d.getMonth() + 1}`}
                }
                />
                <VictoryAxis   style={{tickLabels: {fontSize: 10}}} tickFormat={(y) => `${y}kg`} dependentAxis />

                <VictoryStack>

                    {victoryBars}

                </VictoryStack>

            </VictoryChart>
        );
    }

    return (
        props.data.Sessions.length === 0 ? null : renderGraph()
    )
}


export default StackedColumnGraph;