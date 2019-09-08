import React from "react"
import { shallow, ShallowWrapper } from "enzyme"
import LogContainer from "./LogContainer"
import ExpansionPanel from "@material-ui/core/ExpansionPanel"
import chai from 'chai';
import { ExpansionPanelDetails } from "@material-ui/core";
import MessageLinks from "../MessageLinks/MessageLinks";
const expect = chai.expect

describe("LogContainer", () => {
  let wrapper : ShallowWrapper
  let dummyLog

  beforeEach(() => {
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
    wrapper = shallow(<LogContainer log={dummyLog}/>)
  })

  it("Has the message sent displayed as a label", () => {
    expect(wrapper.find(ExpansionPanel).text()).to.include("test")
  })

  it("Displays the message links", () => {
    expect(wrapper.find(MessageLinks).length).to.eql(1)
  })

})