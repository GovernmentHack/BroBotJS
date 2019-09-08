import React from "react"
import "./App.scss"
import cylon from "../resources/cylon.png"
import Button from "@material-ui/core/Button"
import LogContainer from "../LogContainer/LogContainer"

interface IAppState {
  messageLog : any[]
}

class App extends React.Component<{}, IAppState> {
  constructor(props: Readonly<{}>) {
    super(props)
    this.state = {
      messageLog: []
    }

    this.getMessageLogs = this.getMessageLogs.bind(this)
  }

  async getMessageLogs(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault()

    return fetch("/api/messageLog")
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          messageLog: json
        })
      })
  }

  render() {
    return (
      <div className="app">
        <div className="app__header">
          <img src={cylon} className="app__logo" alt="logo" />
          <Button 
            onClick={this.getMessageLogs}
            variant="contained"
            color="primary"
          > 
            Get Recent Messages
          </Button>
        </div>
        <LogContainer log={this.state.messageLog}/>
      </div>
    )
  }
}

export default App;
