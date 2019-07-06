import sinon, { SinonSpy} from 'sinon'
import chai from 'chai'
import onMessageHandler from '../../src/discordBot/onMessageHandler'
import { Message, Collection } from 'discord.js'
import MockGenerator from './MockGenerator'
import DiscordBot from '../../src/discordBot/DiscordBot';
import { doesNotReject } from 'assert';

const expect = chai.expect


describe("onMessage", () => {
  let sendSpy : SinonSpy
  let message : Message
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
      message = mockGenerator.getMessage({cleanContent: "!learn",author: mockGenerator.getUser()})

      const ingestChannelMessagesSpy = sinon.spy(bot, "ingestChannelMessages")

      return onMessageHandler(bot, message).then(() => {
        expect(ingestChannelMessagesSpy.calledOnce).to.be.true
      }).catch((error) => {
        throw error
      })
    })
    it("will return a response", () => {
      message = mockGenerator.getMessage({cleanContent: "!learn"})
      sendSpy = sinon.spy(message.channel, "send")
      
      return onMessageHandler(bot, message).then(() => {
        expect(sendSpy.getCall(0).args[0]).to.include("I could not ingest messages: ")
        expect(sendSpy.getCall(1).args[0]).to.include("Ingested 0 messages.")
      }).catch((error) => {
        throw error
      })
    })
  })
  describe("!setFreq", () => {
    it("requires a single number following the command", () => {
      message = mockGenerator.getMessage({cleanContent: "!setFreq"})
      sendSpy = sinon.spy(message.channel, "send")
      
      return onMessageHandler(bot, message).then(() => {
        expect(sendSpy.getCall(0).args[0]).to.include("!setFreq usage: `!setFreq [0-100]`")
      }).catch((error) => {
        throw error
      })
    })

    it("will set the frequency of the bot", () => {
      message = mockGenerator.getMessage({cleanContent: "!setFreq 69"})
      sendSpy = sinon.spy(message.channel, "send")
      const setResponseFrequencySpy = sinon.spy(bot, "setResponseFrequency")

      return onMessageHandler(bot, message).then(() => {
        expect(sendSpy.getCall(0).args[0]).to.include("I will respond to 69% of messages now!")
        expect(setResponseFrequencySpy.callCount).to.eql(1)
      }).catch((error) => {
        throw error
      })
    })
  })
  describe("mentions", () => {
    it("replies to message if client is mentioned", () => {
      message = mockGenerator.getMessage({includeMentions: true, includeClientMention: true})
  
      sendSpy = sinon.spy(message.channel, "send")
      const getSentenceSpy = sinon.spy(bot.chain, "getSentence")
  
      onMessageHandler(bot, message)
      expect(sendSpy.calledOnce).to.be.true
      expect(getSentenceSpy.calledOnce).to.be.true
    })
  })
  describe("random replies", () => {
    it("will not respond to messages from bots", () => {
      message = mockGenerator.getMessage({author: mockGenerator.getUser({bot: true}), includeClientMention: true})
  
      sendSpy = sinon.spy(message.channel, "send")
      const getSentenceSpy = sinon.spy(bot.chain, "getSentence")
  
      onMessageHandler(bot, message)
      expect(sendSpy.callCount).to.eql(0)
      expect(getSentenceSpy.callCount).to.eql(0)
    })

    it("will respond to a random amount of messages based on bot's responseFrequency", () => {
      message = mockGenerator.getMessage()
  
      sendSpy = sinon.spy(message.channel, "send")
      const getSentenceSpy = sinon.spy(bot.chain, "getSentence")
  
      for(let i = 0; i < 1000; i++) onMessageHandler(bot, message)
      
      const variation = Math.abs((getSentenceSpy.callCount/1000) - (bot.getResponseFrequency()/100))

      expect(getSentenceSpy.callCount === sendSpy.callCount).to.be.true
      expect(variation).to.be.lessThan(0.1)
      
    })
  })
})