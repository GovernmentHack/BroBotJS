import sinon, { SinonSpy, SinonStub} from 'sinon'
import chai from 'chai'
import onMessageHandler from '../../src/discordBot/onMessageHandler'
import { Message } from 'discord.js'
import MockGenerator from './MockGenerator'
import DiscordBot from '../../src/discordBot/DiscordBot'

const typeorm = require("typeorm")

const expect = chai.expect


describe("onMessageHandler", () => {
  let sendSpy : SinonSpy
  let insertSpy : SinonSpy
  let getManagerStub : SinonStub
  let getSentenceSpy : SinonSpy
  let message : Message
  let mockGenerator = new MockGenerator()
  let bot : DiscordBot

  beforeEach(() => {
    bot = new DiscordBot()
    insertSpy = sinon.spy()
    getManagerStub = sinon.stub(typeorm, "getRepository").returns({
      insert: insertSpy
    })
    getSentenceSpy = sinon.spy(bot.chain, "getSentence")
  })

  afterEach(() => {
    mockGenerator.resetMocks()
    insertSpy.resetHistory()
    getSentenceSpy.resetHistory()
    getManagerStub.restore()
  })

  describe("!learn", () => {

    beforeEach(() => {
      message = mockGenerator.getMessage({cleanContent: "!learn", author: mockGenerator.getUser()})
      sendSpy = sinon.spy(message.channel, "send")
    })

    afterEach(() => {
      sendSpy.restore()
    })

    describe("will run ingestChannelMessages()", () => {
      it("on a success", () => {
        const ingestChannelMessagesSpy = sinon.stub(bot, "ingestChannelMessages").resolves({
          messagesIngested: 1
        })
  
        return onMessageHandler(bot, message).then(() => {
          expect(ingestChannelMessagesSpy.calledOnce).to.be.true
          expect(sendSpy.getCall(0).args[0]).to.include("Ingested 1 messages.")
          expect(insertSpy.getCall(0).args[0]).to.eql({
            messageString: `Ingested 1 messages.`,
            messageLinks: [],
            triggerMessage: message.cleanContent
          })
        }).catch((error) => {
          throw error
        })
      })
      it("on a failure", () => {
        const ingestChannelMessagesSpy = sinon.stub(bot, "ingestChannelMessages").resolves({
          messagesIngested: 0,
          error: "Error"
        })

        return onMessageHandler(bot, message).then(() => {
          expect(ingestChannelMessagesSpy.calledOnce).to.be.true
          expect(sendSpy.getCall(0).args[0]).to.include("I could not ingest messages: Error")
          expect(sendSpy.getCall(1).args[0]).to.include("Ingested 0 messages.")
          expect(insertSpy.getCall(0).args[0]).to.eql({
            messageString: `I could not ingest messages: Error`,
            messageLinks: [],
            triggerMessage: message.cleanContent
          })
          expect(insertSpy.getCall(1).args[0]).to.eql({
            messageString: `Ingested 0 messages.`,
            messageLinks: [],
            triggerMessage: message.cleanContent
          })
        }).catch((error) => {
          throw error
        })
      })
    })
  })
  describe("!setFreq", () => {
    it("requires a single number following the command", () => {
      message = mockGenerator.getMessage({cleanContent: "!setFreq"})
      sendSpy = sinon.spy(message.channel, "send")

      return onMessageHandler(bot, message).then(() => {
        expect(sendSpy.getCall(0).args[0]).to.include("!setFreq usage: `!setFreq [0-100]`")
        expect(insertSpy.getCall(0).args[0]).to.eql({
          messageString: "!setFreq usage: `!setFreq [0-100]`",
          messageLinks: [],
          triggerMessage: message.cleanContent
        })
      }).catch((error) => {
        throw error
      })
    })

    it("will set the frequency of the bot", () => {
      message = mockGenerator.getMessage({cleanContent: "!setFreq 69"})
      const setResponseFrequencySpy = sinon.spy(bot, "setResponseFrequency")
      sendSpy = sinon.spy(message.channel, "send")

      return onMessageHandler(bot, message).then(() => {
        expect(sendSpy.getCall(0).args[0]).to.include("I will respond to 69% of messages now!")
        expect(setResponseFrequencySpy.callCount).to.eql(1)
        expect(insertSpy.getCall(0).args[0]).to.eql({
          messageString: "I will respond to 69% of messages now!",
          messageLinks: [],
          triggerMessage: message.cleanContent
        })
      }).catch((error) => {
        throw error
      })
    })
  })
  describe("!mute", () => {
    it("adds the channel to its mute set", () => {
      message = mockGenerator.getMessage({cleanContent: "!mute", channel: mockGenerator.getChannel("12345")})
      sendSpy = sinon.spy(message.channel, "send")

      return onMessageHandler(bot, message).then(() => {
        expect(bot.mutedChannels).to.include("12345")
        expect(sendSpy.getCall(0).args[0]).to.include("I am now muted on this channel. To unmute me, please use the `!unmute` command on this channel.")
        expect(insertSpy.getCall(0).args[0]).to.eql({
          messageString: "I am now muted on this channel. To unmute me, please use the `!unmute` command on this channel.",
          messageLinks: [],
          triggerMessage: message.cleanContent
        })
      }).catch((error) => {
        throw error
      })
    })
  })
  describe("!unmute", () => {
    it("removes the channel from its mute set", () => {
      message = mockGenerator.getMessage({cleanContent: "!unmute", channel: mockGenerator.getChannel("12345")})
      sendSpy = sinon.spy(message.channel, "send")

      bot.mutedChannels.add("12345")

      return onMessageHandler(bot, message).then(() => {
        expect(bot.mutedChannels).to.not.include("12345")
        expect(sendSpy.getCall(0).args[0]).to.include("I am now unmuted on this channel.")
        expect(insertSpy.getCall(0).args[0]).to.eql({
          messageString: "I am now unmuted on this channel.",
          messageLinks: [],
          triggerMessage: message.cleanContent
        })
      }).catch((error) => {
        throw error
      })
    })
  })
  describe("mentions", () => {
    it("replies to message if client is mentioned", () => {
      message = mockGenerator.getMessage({includeMentions: true, includeClientMention: true})
      sendSpy = sinon.spy(message.channel, "send")

      onMessageHandler(bot, message)
      expect(sendSpy.calledOnce).to.be.true
      expect(getSentenceSpy.calledOnce).to.be.true
      expect(insertSpy.calledOnce).to.be.true
    })
  })
  describe("random replies", () => {
    it("will not respond to messages from bots", () => {
      message = mockGenerator.getMessage({author: mockGenerator.getUser({bot: true}), includeClientMention: true})
      sendSpy = sinon.spy(message.channel, "send")

      onMessageHandler(bot, message)
      expect(sendSpy.callCount).to.eql(0)
      expect(getSentenceSpy.callCount).to.eql(0)
    })

    it("will respond to a random amount of messages based on bot's responseFrequency", () => {
      message = mockGenerator.getMessage()

      sendSpy = sinon.spy(message.channel, "send")

      for(let i = 0; i < 1000; i++) onMessageHandler(bot, message)
      
      const variation = Math.abs((getSentenceSpy.callCount/1000) - (bot.getResponseFrequency()/100))

      expect(getSentenceSpy.callCount === sendSpy.callCount).to.be.true
      expect(getSentenceSpy.callCount === insertSpy.callCount).to.be.true
      expect(variation).to.be.lessThan(0.1)
      
    })
  })
})