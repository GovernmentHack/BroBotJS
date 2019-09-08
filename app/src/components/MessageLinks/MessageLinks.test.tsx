import React from "react"
import { mount, ReactWrapper } from "enzyme"
import Card from "@material-ui/core/Card"
import MessageLinks from "./MessageLinks"
import chai from 'chai';
import Chip from "@material-ui/core/Chip"
const expect = chai.expect

describe("MessageLinks", () => {
  let wrapper : ReactWrapper
  let links

  beforeEach(() => {
    links = [{
      "key": {
        "first": "test",
        "second": "case"
      },
      "nodes": [
        {
          "weight": 1,
          "probability": [0, 0.5],
          "next": ""
        },
        {
          "weight": 1,
          "probability": [0.5, 1],
          "next": "other"
        }
      ],
      "weightTotal": 2
    },
    {
      "key": {
        "first": "case",
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
    }]
    wrapper = mount(<MessageLinks links={links}/>)
  })

  it("Renders a card for each Link", () => {
    expect(wrapper.find(Card).length).to.eql(2)
  })
  it("Renders the key test within the card", () => {
    expect(wrapper.find(Card).first().text()).to.include("testcase")
    expect(wrapper.find(Card).last().text()).to.include("case")
  })
  describe("Nodes", () => {
    it("Renders chips for the next nodes", () => {
      expect(wrapper.find(Card).first().find(Chip).length).to.eql(2)
      expect(wrapper.find(Card).last().find(Chip).length).to.eql(1)
    })
    it("Chips have next as label, and precentages", () => {
      expect(wrapper.find(Card).first().find(Chip).first().text()).to.include("<null>")
      expect(wrapper.find(Card).first().find(Chip).first().text()).to.include("50%")
      expect(wrapper.find(Card).first().find(Chip).last().text()).to.include("other")
      expect(wrapper.find(Card).first().find(Chip).last().text()).to.include("50%")
      expect(wrapper.find(Card).last().find(Chip).first().text()).to.include("<null>")
      expect(wrapper.find(Card).last().find(Chip).first().text()).to.include("100%")
    })
  })
})