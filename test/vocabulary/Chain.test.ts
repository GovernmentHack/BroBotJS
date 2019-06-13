import { Collection, Message } from "discord.js";
import mockMessageGenerator from "../discordBot/mockMessageGenerator";
import Chain from '../../src/vocabulary/Chain'
import Link, { ILinkKey, ILinkNode } from '../../src/vocabulary/Link'
import chai from 'chai'
import { stringify } from "querystring";

const expect = chai.expect

describe("Chain", () => {
  let messages = new Collection<string, Message>()
  let messsageGenerator = new mockMessageGenerator()
  let chain : Chain
  
  beforeEach(() => {
    let message1 = messsageGenerator.getMessage({cleanContent: "I am a message from someone."})
    let message2 = messsageGenerator.getMessage({cleanContent: "I am a message from someone else."})
    let message3 = messsageGenerator.getMessage({cleanContent: "I got a message from someone."})
    let message4 = messsageGenerator.getMessage({cleanContent: "I got a different message from someone else."})
    
    messages.set("00000", message1)
    messages.set("00001", message2)
    messages.set("00002", message3)
    messages.set("00003", message4)
    chain = new Chain()
  })

  it("Initializes with no links", () => {
    expect(chain.links.size).to.eql(0)
  })

  describe("insertLink()", () => {
    it("will insert new link if it doesn't exist", () => {
      const newLinkKey : ILinkKey = {first: "test1", second: "test2"}

      const expectedLink : Link = new Link(newLinkKey)
      expectedLink.insertNode("test3")

      chain.insertLink(newLinkKey, "test3")

      expect(chain.links.size).to.eql(1)
      expect(chain.links.get(newLinkKey)).to.eql(expectedLink)
    })

    describe("will update existing link if it already exists", () => {
      it("with existing next", () => {
        const newLink : ILinkKey = {first: "test1", second: "test2"}

        const expectedLink : Link = new Link(newLink)
        expectedLink.insertNode("test3")
        expectedLink.insertNode("test3")

        chain.insertLink(newLink, "test3")
        chain.insertLink(newLink, "test3")

        expect(chain.links.size).to.eql(1)
        expect(chain.links.get(newLink)).to.eql(expectedLink)
      })
      it("with new next", () => {
        const newLink : ILinkKey = {first: "test1", second: "test2"}

        const expectedLink : Link = new Link(newLink)
        expectedLink.insertNode("test3")
        expectedLink.insertNode("test4")

        chain.insertLink(newLink, "test3")
        chain.insertLink(newLink, "test4")

        expect(chain.links.size).to.eql(1)
        expect(chain.links.get(newLink)).to.eql(expectedLink)
      })
    })
  })

  describe("updateProbabilities()", () => {
    it("updates the probabilities of all links and respective nodes", () => {
      const linkKey1 : ILinkKey = {first: "test1", second: "test2"}
      const linkKey2 : ILinkKey = {first: "test1", second: "test3"}
      chain.insertLink(linkKey1, "test3")
      chain.insertLink(linkKey2, "test2")

      chain.updateProbabilities()

      expect(chain.links.get(linkKey1).nodes.get("test3").probability).to.eql([0,1])
      expect(chain.links.get(linkKey2).nodes.get("test2").probability).to.eql([0,1])
    })
  })
})