import chai from 'chai'
import fs from 'fs'
import DiscordBot from '../../src/discordBot/DiscordBot'
import sinon, { SinonStub, SinonSandbox, SinonFakeTimers } from 'sinon'
import { TextChannel, Collection, Message, User } from 'discord.js';
import MockGenerator from './mockGenerator';
import Link from '../../src/vocabulary/Link';

const expect = chai.expect
const mockGenerator = new MockGenerator()
const VOCABULARY_FILE = process.env.VOCABULARY_FILE? process.env.VOCABULARY_FILE : './vocabulary.json' 

describe("DiscordBot", () => {
  let bot : DiscordBot
  let sandbox : SinonSandbox
  let clock : SinonFakeTimers
  const now = new Date()

  beforeEach(() => {
    bot = new DiscordBot()
    sandbox = sinon.createSandbox();
    clock = sinon.useFakeTimers(now.getTime());
  })

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });

  it("initilaizes its members on creation", () => {
    expect(!!bot.client).to.be.true
    expect(!!bot.chain).to.be.true
    expect(bot.getMessageLog()).to.eql([])
    expect(bot.getResponseFrequency()).to.eql(33)
  })

  it("login() will import Vocabulary file if it exists", () => {
    const setChainFromFileSpy = sinon.spy(bot, "setChainFromFile")
    const loginStub = sinon.stub(bot.client, "login")

    const exampleVocabulary = require('./exampleVocabulary.json')
    fs.writeFileSync(VOCABULARY_FILE, JSON.stringify(exampleVocabulary))

    bot.login()

    expect(setChainFromFileSpy.callCount).to.eql(1)
    expect(bot.chain.getStartingLink({first:"test1",second:"test2"}).nodes.has(".")).to.be.true
  })

  describe("ingestChannelMessages()", () => {
    let channel : TextChannel
    let botUser : User
    let messages : Collection<string, Message>
    let emptyMessages : Collection<string, Message>
    let fetchMessagesStub : SinonStub

    beforeEach(() => {
      channel = mockGenerator.getChannel()
      botUser = mockGenerator.getUser({bot: true})
      messages = new Collection<string, Message>()
      messages.set("00001", mockGenerator.getMessage({cleanContent: "test1 test2."}))
      messages.set("00002", mockGenerator.getMessage({cleanContent: "test2 test3.", author: botUser}))
      messages.set("00003", mockGenerator.getMessage({cleanContent: "test2 test3?"}))
      messages.set("00004", mockGenerator.getMessage({cleanContent: "!testCommand"}))
      
      emptyMessages = new Collection<string, Message>()

      fetchMessagesStub = sinon.stub(channel, "fetchMessages").onFirstCall().resolves(messages)
      fetchMessagesStub.onSecondCall().resolves(emptyMessages)
    })

    afterEach(() => {
      fetchMessagesStub.reset()
    })

    it("can read in all user messages from channel and parse them into its chain, ignoring Bot and command messages", () => {
      return bot.ingestChannelMessages(channel).then(() => {
        expect(fetchMessagesStub.calledOnce).to.be.true
        expect(bot.chain.getChainSize()).to.eql(6)
      }).catch((err) => {
        throw err
      })
    })

    it("returns statistics on read-in messages", () => {
      return bot.ingestChannelMessages(channel).then((output) => {
        expect(output.messagesIngested).to.eql(2)
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

    it("writes current chain contents to local json", () => {
      const writeChainToFileSpy = sinon.spy(bot, "writeChainToFile")

      return bot.ingestChannelMessages(channel).then((output) => {
        expect(writeChainToFileSpy.callCount).to.eql(1)
      }).catch((error) => {
        throw error
      })
    })
  })

  describe("setResponseFrequency()", () => {
    it("will accept values between 0 and 100", () => {
      bot.setResponseFrequency(0)

      expect(bot.getResponseFrequency()).to.eql(0)

      bot.setResponseFrequency(100)

      expect(bot.getResponseFrequency()).to.eql(100)
    })

    it("wont set the frequency if the number is smaller or larger than 0 and 100", () => {
      bot.setResponseFrequency(100.1)

      expect(bot.getResponseFrequency()).to.eql(33)
      
      bot.setResponseFrequency(-1)

      expect(bot.getResponseFrequency()).to.eql(33)
    })
  })

  describe("addMEssageLogEntry()", () => {
    let dummyLink : Link
    let dummyMessage : Message
    
    beforeEach(() => {
      dummyLink = new Link({first:"a", second:"string"})
      dummyMessage =  mockGenerator.getMessage()
      bot.addMessageLogEntry("a string", [dummyLink], dummyMessage)
    })
    
    it("adds new log entry to end of message list", () => {
      const expectedLogEntry = {
        messageString: "a string",
        messageLinks: [dummyLink],
        triggerMessage: dummyMessage,
        timeStamp: new Date()
      }
      expect(bot.getMessageLog()).to.eql([expectedLogEntry])
    })

    it("returns new length of log", () => {
      expect(bot.addMessageLogEntry("a string", [dummyLink], dummyMessage)).to.eq(2)
    })
  })
})