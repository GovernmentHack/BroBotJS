import { Collection, Message } from "discord.js";
import mockMessageGenerator from "../discordBot/mockMessageGenerator";
import Chain from '../../src/vocabulary/Chain'
import Link, { ILinkKey } from '../../src/vocabulary/Link'
import chai from 'chai'

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
    expect(chain.getChainSize()).to.eql(0)
  })

  describe("insertLink()", () => {
    it("will insert new link if it doesn't exist", () => {
      const newLinkKey : ILinkKey = {first: "test1", second: "test2"}

      const expectedLink : Link = new Link(newLinkKey)
      expectedLink.insertNode("test3")

      chain.insertLink(newLinkKey, "test3")

      expect(chain.getChainSize()).to.eql(1)
      expect(chain.getLink(newLinkKey)).to.eql(expectedLink)
    })

    describe("will update existing link if it already exists", () => {
      let newLink : ILinkKey
      let expectedLink : Link

      beforeEach(() => {
        newLink = {first: "test1", second: "test2"}
        expectedLink = new Link(newLink)
      })
      
      it("with existing next", () => {
        expectedLink.insertNode("test3")
        expectedLink.insertNode("test3")
  
        chain.insertLink(newLink, "test3")
        chain.insertLink(newLink, "test3")

        expect(chain.getChainSize()).to.eql(1)
        expect(chain.getLink(newLink)).to.eql(expectedLink)
      })
      it("with new next", () => {
        expectedLink.insertNode("test3")
        expectedLink.insertNode("test4")

        chain.insertLink(newLink, "test3")
        chain.insertLink(newLink, "test4")

        expect(chain.getChainSize()).to.eql(1)
        expect(chain.getLink(newLink)).to.eql(expectedLink)
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

      expect(chain.getLink(linkKey1).nodes.get("test3").probability).to.eql([0,1])
      expect(chain.getLink(linkKey2).nodes.get("test2").probability).to.eql([0,1])
    })

    it("updates the probabilities of all starting links and respective nodes", () => {
      const linkKey1 : ILinkKey = {first: "test1", second: "test2"}
      chain.insertStartingLink(linkKey1, "test3")

      chain.updateProbabilities()

      expect(chain.getStartingLink(linkKey1).nodes.get("test3").probability).to.eql([0,1])
    })
  })

  describe("parseSentence()", () => {
    it("will add an entire sentence into its chain", () => {
      const sentenceToParse = "test1 test2 test3 test4."
      const expectedKey2 : ILinkKey = {first: "test2", second: "test3"}
      const expectedKey3 : ILinkKey = {first: "test3", second: "test4"}
      const expectedKey4 : ILinkKey = {first: "test4", second: "."}

      chain.parseSentence(sentenceToParse)

      expect(chain.getLink(expectedKey2).nodes.has("test4")).to.be.true
      expect(chain.getLink(expectedKey3).nodes.has(".")).to.be.true
      expect(chain.getLink(expectedKey4).nodes.has("")).to.be.true
    })

    
    it("will store the first two words as starting links", () => {
      const sentenceToParse = "test1 test2 test3 test4."
      const expectedKey1 : ILinkKey = {first: "test1", second: "test2"}
      
      chain.parseSentence(sentenceToParse)
      
      expect(chain.getStartingLink(expectedKey1).nodes.has("test3")).to.be.true
      
    })
    
    it("can handle sentences of 1 word", () => {
      const sentenceToParse = "test1"
      const expectedKey1 : ILinkKey = {first: "test1", second: ""}
      
      chain.parseSentence(sentenceToParse)
      
      expect(chain.getStartingLink(expectedKey1).nodes.has("")).to.be.true
    })

    it("can handle sentences of 2 words", () => {
      const sentenceToParse = "test1 test2"
      const expectedKey1 : ILinkKey = {first: "test1", second: "test2"}
      
      chain.parseSentence(sentenceToParse)
      
      expect(chain.getStartingLink(expectedKey1).nodes.has("")).to.be.true
    })
  })

  it("getRandomStartingLink()", () => {
    const sentenceToParse = "test1 test2 test3 test4."
    const expectedKey1 : ILinkKey = {first: "test1", second: "test2"}

    chain.parseSentence(sentenceToParse)

    const actualLink = chain.getRandomStartingLink()

    expect(actualLink.key).to.eql(expectedKey1)
  })

  describe("getSentence()", () => {
    it("will produce a random sentence from its chain", () => {
      const sentenceToParse = "test1 test2 test3 test4."
      chain.parseSentence(sentenceToParse)
      chain.updateProbabilities()

      const actualSentence = chain.getSentence()

      expect(actualSentence).to.eql(sentenceToParse)
    })
  })
})