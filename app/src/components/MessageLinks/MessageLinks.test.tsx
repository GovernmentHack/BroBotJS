import React from "react"
import { mount, ReactWrapper } from "enzyme"
import MessageLinks, { IMessageLink, getDataFromLinks } from "./MessageLinks"
import chai from 'chai';

const expect = chai.expect

describe("MessageLinks", () => {
  let wrapper : ReactWrapper
  let links: IMessageLink[]

  beforeEach(() => {
    links = [{
      key: {
        first: "test",
        second: "case"
      },
      nodes: [
        {
          weight: 1,
          probability: [0, 0.5],
          next: ""
        },
        {
          weight: 1,
          probability: [0.5, 1],
          next: "other"
        }
      ],
      weightTotal: 2
    },
    {
      key: {
        first: "case",
        second: ""
      },
      nodes: [
        {
          weight: 1,
          probability: [0, 1],
          next: ""
        }
      ],
      weightTotal: 1
    }]
  })

  describe("getDataFromLinks", () => {
    it("with a link of length 1 and two null values", () => {
      links = [{
        key: {
          first: "test",
          second: ""
        },
        nodes: [
          {
            weight: 1,
            probability: [0, 1],
            next: ""
          },
        ],
        weightTotal: 1
      }]
      const expectedData = {
        nodes: [
          { name: "test"},
          { name: ""},
        ],
        links: [
          {
            source: "test",
            target: "",
            value: 1,
            probability: 1
          }
        ]
      }

      const actualData = getDataFromLinks(links)
      expect(actualData).to.eql(expectedData)
    })

    it("with a link of length 1 and one null value", () => {
      links = [{
        key: {
          first: "test",
          second: "case"
        },
        nodes: [
          {
            weight: 1,
            probability: [0, 1],
            next: ""
          },
        ],
        weightTotal: 1
      }]
      const expectedData = {
        nodes: [
          { name: "test"},
          { name: "case"},
          { name: ""},
        ],
        links: [
          {
            source: "test",
            target: "case",
            value: 1,
            probability: 1
          },
          {
            source: "case",
            target: "",
            value: 1,
            probability: 1
          },
        ]
      }

      const actualData = getDataFromLinks(links)
      expect(actualData).to.eql(expectedData)
    })

    it("with a link of length 1 that has multiple nodes", () => {
      links = [{
        key: {
          first: "test",
          second: "case"
        },
        nodes: [
          {
            weight: 1,
            probability: [0, 0.25],
            next: "else"
          },
          {
            weight: 3,
            probability: [0.25, 1],
            next: ""
          },
        ],
        weightTotal: 4
      }]
      const expectedData = {
        nodes: [
          { name: "test"},
          { name: "case"},
          { name: "else"},
          { name: ""},
        ],
        links: [
          {
            source: "test",
            target: "case",
            value: 1,
            probability: 1
          },
          {
            source: "case",
            target: "else",
            value: 1,
            probability: 0.25
          },
          {
            source: "case",
            target: "",
            value: 3,
            probability: 0.75
          },
        ]
      }

      const actualData = getDataFromLinks(links)
      expect(actualData).to.eql(expectedData)
    })

    it("with a link of length of 2 that has multiple nodes", () => {
      links = [{
        key: {
          first: "test",
          second: "case"
        },
        nodes: [
          {
            weight: 1,
            probability: [0, 0.25],
            next: "else"
          },
          {
            weight: 3,
            probability: [0.25, 1],
            next: ""
          },
        ],
        weightTotal: 4
      },
      {
        key: {
          first: "case",
          second: "else"
        },
        nodes: [
          {
            weight: 1,
            probability: [0, 1],
            next: ""
          },
        ],
        weightTotal: 1
      }]
      const expectedData = {
        nodes: [
          { name: "test"},
          { name: "case"},
          { name: "else"},
          { name: ""},
        ],
        links: [
          {
            source: "test",
            target: "case",
            value: 1,
            probability: 1
          },
          {
            source: "case",
            target: "else",
            value: 1,
            probability: 0.25
          },
          {
            source: "case",
            target: "",
            value: 3,
            probability: 0.75
          },
          {
            source: "else",
            target: "",
            value: 1,
            probability: 1
          },
        ]
      }

      const actualData = getDataFromLinks(links)
      expect(actualData).to.eql(expectedData)
    })
    
  })

  it("renders even without links", () => {
    wrapper = mount(<MessageLinks />)
    expect(wrapper.find("div.message-links-empty").length).to.eql(1)
  })

  it("renders with link length of 0", () => {
    wrapper = mount(<MessageLinks links={[]}/>)
    expect(wrapper.find("div.message-links-empty").length).to.eql(1)
  })

  it("renders the SVG when links present", () => {
    wrapper = mount(<MessageLinks links={links}/>)
    expect(wrapper.find("svg").length).to.eql(1)
  })
})