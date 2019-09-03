import React from 'react'
import "./LogContainer.scss"

interface ILogContainerProps {
  log : any[]
}

const LogContainer : React.FC<ILogContainerProps> = (props) => {
  return (
    <div className="log-container">
      {JSON.stringify(props.log)}
    </div>
  )
}

export default LogContainer