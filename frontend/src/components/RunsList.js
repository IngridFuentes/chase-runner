import React from 'react'
import RunCard from "./RunCard.js"

const RunsList = (props) => {
  console.log(props, 'porrrroooooooo')
    return (
      <> 
          <ul>
            {props.runs.map(run => <RunCard run={run} key={run.id}/> )}
          </ul>
        </>
       
      )
}


export default RunsList;