import sinon, { SinonSpy} from 'sinon'
import chai from 'chai'
import onMessageHandler from '../../src/discordBot/onMessageHandler'
import { Message } from 'discord.js'
import MockGenerator from './MockGenerator'
import DiscordBot from '../../src/discordBot/DiscordBot';

const expect = chai.expect

let sendSpy : SinonSpy

describe("onMessage", () => {
  let msg : Message
  let mockGenerator = new MockGenerator()
  let bot : DiscordBot

  afterEach(() => {
    sendSpy.restore()
    bot = new DiscordBot()
    mockGenerator.resetMocks()
  })

  describe("!learn", () => {
    it("will run ingestChannelMessages()", () => {
      msg = mockGenerator.getMessage({cleanContent: "!learn"})

      const ingestChannelMessagesSpy = sinon.spy(bot, "ingestChannelMessages")

      onMessageHandler(bot, msg)

      expect(ingestChannelMessagesSpy.calledOnce).to.be.true
    })
  })
  describe("mentions", () => {
    it("replies to message if client is mentioned", () => {
      msg = mockGenerator.getMessage({includeMentions: true, includeClientMention: true})
  
      sendSpy = sinon.spy(msg.channel, "send")
  
      onMessageHandler(bot, msg)
      expect(sendSpy.calledOnce).to.be.true
    })
  
    it("doesn't send any messages if the client is not mentioned", () => {
      msg = mockGenerator.getMessage({includeMentions: true})
  
      sendSpy = sinon.spy(msg.channel, "send")
  
      onMessageHandler(bot, msg)
      expect(sendSpy.notCalled).to.be.true
    })
  })
})