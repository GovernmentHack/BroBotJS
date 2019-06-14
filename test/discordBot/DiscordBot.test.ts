import chai from 'chai'
import DiscordBot from '../../src/discordBot/DiscordBot'
import sinon, { SinonStub } from 'sinon'
import { TextChannel, Collection, Message } from 'discord.js';
import MockGenerator from './mockGenerator';

const expect = chai.expect
const mockGenerator = new MockGenerator()

describe("DiscordBot", () => {
  let bot : DiscordBot

  beforeEach(() => {
    bot = new DiscordBot()
  })

  it("initilaizes its embers on creation", () => {
    expect(!!bot.client).to.be.true
    expect(!!bot.chain).to.be.true
  })

  describe("ingestChannelMessages()", () => {
    let channel : TextChannel
    let messages : Collection<string, Message>
    let emptyMessages : Collection<string, Message>
    let fetchMessagesStub : SinonStub

    beforeEach(() => {
      channel = mockGenerator.getChannel()
      messages = new Collection<string, Message>()
      messages.set("00001", mockGenerator.getMessage({cleanContent: "test1 test2."}))
      messages.set("00002", mockGenerator.getMessage({cleanContent: "test2 test3."}))
      messages.set("00003", mockGenerator.getMessage({cleanContent: "test2 test3?"}))
      
      emptyMessages = new Collection<string, Message>()

      fetchMessagesStub = sinon.stub(channel, "fetchMessages").onFirstCall().resolves(messages)
      fetchMessagesStub.onSecondCall().resolves(emptyMessages)
    })

    afterEach(() => {
      fetchMessagesStub.reset()
    })

    it("can read in all messages from channel and parse them into its chain", () => {
      return bot.ingestChannelMessages(channel).then(() => {
        expect(fetchMessagesStub.calledOnce).to.be.true
        expect(bot.chain.getChainSize()).to.eql(7)
      }).catch((err) => {
        throw err
      })
    })

    it("returns statistics on read-in messages", () => {
      return bot.ingestChannelMessages(channel).then((output) => {
        expect(output.messagesIngested).to.eql(3)
      }).catch((err) => {
        throw err
      })
    })

    it("returns an error message if error occured", () => {
      fetchMessagesStub.onFirstCall().rejects(new Error())
  
      return bot.ingestChannelMessages(channel).then((output) => {
        expect(!!output.error).to.be.true
      }).catch((error) => {
        throw error
      })
    })
  })
})