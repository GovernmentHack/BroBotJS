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
      msg = mockGenerator.getMessage({cleanContent: "!learn"})

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
  
    it("doesn't send any messages if the client is not mentioned", () => {
      msg = mockGenerator.getMessage({includeMentions: true})
  
      sendSpy = sinon.spy(msg.channel, "send")
  
      onMessageHandler(bot, msg)
      expect(sendSpy.notCalled).to.be.true
    })
  })
})