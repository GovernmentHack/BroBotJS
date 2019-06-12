import chai from 'chai'
import { Collection, Message } from 'discord.js';
import mockMessageGenerator from '../discordBot/mockMessageGenerator'

import Link, { LinkNode } from '../../src/vocabulary/Link'

const expect = chai.expect

describe("vocabulary", () => {
  let messages = new Collection<string, Message>()
  let messsageGenerator = new mockMessageGenerator()
  let link : Link
  let node1 : LinkNode
  let node2 : LinkNode 

  beforeEach(() => {
    let message1 = messsageGenerator.getMessage({cleanContent: "I am a message from someone."})
    let message2 = messsageGenerator.getMessage({cleanContent: "I am a message from someone else."})
    let message3 = messsageGenerator.getMessage({cleanContent: "I got a message from someone."})
    let message4 = messsageGenerator.getMessage({cleanContent: "I got a different message from someone else."})

    messages.set("00000", message1)
    messages.set("00001", message2)
    messages.set("00002", message3)
    messages.set("00003", message4)

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

  describe("addNode()", () => {
    it("adds new node if next doesn't exist", () => {
      const expectedNode = node1
      link.addNode("test")
  
      expect(link.nodes.get("test")).to.eql(expectedNode)
    })

    it("updates weight on node if next already exists", () => {
      const expectedNode : LinkNode = {
        weight: 2,
        probability: [0,0],
        next: "test"
      }
      link.nodes.set("test", node1)
      link.addNode("test")
  
      expect(link.nodes.get("test")).to.eql(expectedNode)
    })
  })

  describe("updateNodeProbabilities()", () => {
    it("correctly weights probabilities", () => {
      const expectedNode1 : LinkNode = {
        ...node1,
        probability: [0, 0.25]
      }
      const expectedNode2 : LinkNode= {
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
})