import React from 'react'
import RunCard from "./RunCard.js"

const RunsList = (props) => {
  console.log(props)
    return (
      <> 
          <ul>
            {/* {props.runs.map(run => <RunCard run={run} key={run.id}/> )} */}
            {props.runs}
            <RunCard runs={props.runs}/>
          </ul>
        </>
       
      )
}


export default RunsList;