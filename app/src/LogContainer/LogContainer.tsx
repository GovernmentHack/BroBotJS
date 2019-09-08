import React from 'react'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Typography from "@material-ui/core/Typography"
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
    <ExpansionPanel key={entry.id.toString()} className="log-container__log-entry">
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        className="log-container__log-entry__log-summary"
      >
        <Typography>{entry.messageString}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className="log-container__log-entry__log-details">
        <Typography><b>ID: </b>{entry.id}</Typography>
        <Typography><b>Trigger Message: </b>{entry.triggerMessage}</Typography>
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