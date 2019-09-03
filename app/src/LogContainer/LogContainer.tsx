import React from 'react'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import "./LogContainer.scss"

interface ILogEntry {
  id: number;
  messageString: string;
  messageLinks: any[];
  triggerMessage: string;
}

interface ILogContainerProps {
  log : ILogEntry[]
}

const LogContainer : React.FC<ILogContainerProps> = (props) => {

  const logList = props.log.map((entry) => 
    <ExpansionPanel key={entry.id.toString()}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <p>{entry.messageString}</p>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <p>{`ID: ${entry.id}`}</p>
        <p>{`Trigger Message: ${entry.triggerMessage}`}</p>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )

  return (
    <div className="log-container">
      {logList}
    </div>
  )
}

export default LogContainer