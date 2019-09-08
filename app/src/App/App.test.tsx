import React from "react"
import { shallow, ShallowWrapper } from "enzyme"
import App from "./App"
import LogContainer from "../components/LogContainer/LogContainer"
import Button from '@material-ui/core/Button'
import chai from 'chai'
import fetchMock from "fetch-mock"
import { SocialSentimentSatisfied } from "material-ui/svg-icons";
import sinon from "sinon";
const expect = chai.expect

describe("App", () => {
  let wrapper : ShallowWrapper
  let dummyLog : any

  before(() => {
    dummyLog = [{
      id: 10,
      messageString: "test",
      messageLinks: [{
        "key": {
          "first": "test",
          "second": ""
        },
        "nodes": [
          {
            "weight": 1,
            "probability": [0, 1],
            "next": ""
          }
        ],
        "weightTotal": 1
      }],
      triggerMessage: "some message"
    }]
    fetchMock.get("/api/messageLog", dummyLog)
  })

  after(() => {
    fetchMock.restore()
  })

  beforeEach(() => {
    wrapper = shallow(<App/>)
  })

  it("displays its logo", () => {
    expect(wrapper.find('img.app__logo').length).to.eql(1)
  })

  it("displays the log view and gives it the logs", () => {
    expect(wrapper.find(LogContainer).length).to.eql(1)
    expect(wrapper.find(LogContainer).first().props()["log"] ).to.eql(wrapper.state('messageLog'))
  })

  it("renders a 'get logs' button", () => {
    expect(wrapper.find(Button).length).to.eql(1)
    expect(wrapper.find(Button).text()).to.eql("Get Recent Messages")
  })

  it("'get logs' button will send fetch to api/messageLogs and store it in state", async () => {
    await wrapper.find(Button).first().props().onClick({preventDefault: () => {}} as any)

    expect(fetchMock.called()).to.be.true
    expect(fetchMock.lastUrl()).to.eql("/api/messageLog")
    expect(wrapper.state('messageLog')).to.eql(dummyLog)
  })
})