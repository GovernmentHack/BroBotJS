import sinon, { SinonSpy} from 'sinon'
import chai from 'chai'
import onMessageHandler from '../../src/discordBot/onMessageHandler'
import { Message } from 'discord.js'
import MockGenerator from './MockGenerator'
import DiscordBot from '../../src/discordBot/DiscordBot';
import { doesNotReject } from 'assert';

const expect = chai.expect


describe("onMessage", () => {
  let sendSpy : SinonSpy
  let msg : Message
  let mockGenerator = new MockGenerator()
  let bot : DiscordBot

  beforeEach(() => {
    bot = new DiscordBot()
  })

  afterEach(() => {
    mockGenerator.resetMocks()
  })

  describe("!learn", () => {
    it("will run ingestChannelMessages()", () => {
      msg = mockGenerator.getMessage({cleanContent: "!learn",author: mockGenerator.getUser()})

      const ingestChannelMessagesSpy = sinon.spy(bot, "ingestChannelMessages")

      return onMessageHandler(bot, msg).then(() => {
        expect(ingestChannelMessagesSpy.calledOnce).to.be.true
      }).catch((error) => {
        throw error
      })
    })
    
    it("will return a response", () => {
      msg = mockGenerator.getMessage({cleanContent: "!learn"})
      sendSpy = sinon.spy(msg.channel, "send")
      
      return onMessageHandler(bot, msg).then(() => {
        expect(sendSpy.getCall(0).args[0]).to.include("I could not ingest messages: ")
        expect(sendSpy.getCall(1).args[0]).to.include("Ingested 0 messages.")
      }).catch((error) => {
        throw error
      })
    })
  })
  describe("!setFreq", () => {
    it("requires a single number following the command", () => {
      msg = mockGenerator.getMessage({cleanContent: "!setFreq"})
      sendSpy = sinon.spy(msg.channel, "send")
      
      return onMessageHandler(bot, msg).then(() => {
        expect(sendSpy.getCall(0).args[0]).to.include("!setFreq usage: `!setFreq [0-100]`")
      }).catch((error) => {
        throw error
      })
    })

    it("will set the frequency of the bot", () => {
      msg = mockGenerator.getMessage({cleanContent: "!setFreq 69"})
      sendSpy = sinon.spy(msg.channel, "send")
      const setResponseFrequencySpy = sinon.spy(bot, "setResponseFrequency")

      return onMessageHandler(bot, msg).then(() => {
        expect(sendSpy.getCall(0).args[0]).to.include("I will respond to 69% of messages now!")
        expect(setResponseFrequencySpy.callCount).to.eql(1)
      }).catch((error) => {
        throw error
      })
    })
  })
  describe("mentions", () => {
    it("replies to message if client is mentioned", () => {
      msg = mockGenerator.getMessage({includeMentions: true, includeClientMention: true})
  
      sendSpy = sinon.spy(msg.channel, "send")
      const getSentenceSpy = sinon.spy(bot.chain, "getSentence")
  
      onMessageHandler(bot, msg)
      expect(sendSpy.calledOnce).to.be.true
      expect(getSentenceSpy.calledOnce).to.be.true
    })
  })
  describe("random replies", () => {
    it("will not respond to messages from bots", () => {
      msg = mockGenerator.getMessage({author: mockGenerator.getUser({bot: true}), includeClientMention: true})
  
      sendSpy = sinon.spy(msg.channel, "send")
      const getSentenceSpy = sinon.spy(bot.chain, "getSentence")
  
      onMessageHandler(bot, msg)
      expect(sendSpy.callCount).to.eql(0)
      expect(getSentenceSpy.callCount).to.eql(0)
    })

    it("will respond to a random amount of messages based on bot's responseFrequency", () => {
      msg = mockGenerator.getMessage()
  
      sendSpy = sinon.spy(msg.channel, "send")
      const getSentenceSpy = sinon.spy(bot.chain, "getSentence")
  
      for(let i = 0; i < 1000; i++) onMessageHandler(bot, msg)
      
      const variation = Math.abs((getSentenceSpy.callCount/1000) - (bot.getResponseFrequency()/100))

      expect(getSentenceSpy.callCount === sendSpy.callCount).to.be.true
      expect(variation).to.be.lessThan(0.1)
      
    })
  })
})