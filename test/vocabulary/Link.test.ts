import chai from 'chai'
import Link, { ILinkNode } from '../../src/vocabulary/Link'

const expect = chai.expect

describe("Link", () => {
  let link : Link
  let node1 : ILinkNode
  let node2 : ILinkNode 

  beforeEach(() => {
    node1 = {
      weight: 1,
      probability: [0,0],
      next: "test"
    }

    node2 = {
      probability: [0,0],
      weight: 3,
      next: "test2"
    }

    link = new Link({ first: "first", second: "second"})

    link.nodes.set("test", node1)
    link.nodes.set("test2", node2)
    link.weightTotal = 4
  })

  it("initializes empty", () => {
    link = new Link({ first: "first", second: "second"})
    expect(link.key).to.eql({first: "first", second: "second"})
    expect(link.nodes.size).to.eql(0)
    expect(link.weightTotal).to.eql(0)
  })

  describe("addNode()", () => {
    it("adds new node if next doesn't exist", () => {
      const expectedNode = node1
      link.insertNode("test")
  
      expect(link.nodes.get("test")).to.eql(expectedNode)
    })

    it("updates weight on node if next already exists", () => {
      const expectedNode : ILinkNode = {
        weight: 2,
        probability: [0,0],
        next: "test"
      }
      link.nodes.set("test", node1)
      link.insertNode("test")
  
      expect(link.nodes.get("test")).to.eql(expectedNode)
    })
  })

  describe("updateNodeProbabilities()", () => {
    it("correctly weights probabilities", () => {
      const expectedNode1 : ILinkNode = {
        ...node1,
        probability: [0, 0.25]
      }
      const expectedNode2 : ILinkNode = {
        ...node2,
        probability: [0.25, 1]
      }

      link.updateNodeProbabilities()

      expect(link.nodes.get("test")).to.eql(expectedNode1)
      expect(link.nodes.get("test2")).to.eql(expectedNode2)
    })
  })

  describe("getNextLinkKey()", () => {
    beforeEach(() => {
      link.updateNodeProbabilities()
    })

    it("returns a linkKey with expected randomness", () => {
      let testCounter : number = 0
      let test2Counter : number = 0

      for (let i = 0; i < 1000; i++) {
        if(link.getNextLinkKey().second === "test") testCounter++
        else test2Counter++
      }

      const expectedRatio = 0.3333333
      const actualRatio = testCounter/test2Counter 
      const difference = Math.abs(actualRatio - expectedRatio)

      expect(difference).to.be.lessThan(0.1)

    })
  })

  describe("toJSON()", () => {
    it("returns JSON object of itself", () => {
      link.updateNodeProbabilities()

      const expectedLink = require("./exampleLink.json")

      const actualLink = link.toJSON()

      expect(actualLink).to.eql(expectedLink)
    })
  })
})