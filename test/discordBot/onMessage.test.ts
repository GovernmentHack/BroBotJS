import sinon, { SinonSpy} from 'sinon'
import chai from 'chai'
import onMessageHandler from '../../src/discordBot/onMessageHandler'
import { Message } from 'discord.js'
import mockMessageGenerator from './mockMessageGenerator'

const expect = chai.expect

let sendSpy : SinonSpy

describe("onMessage", () => {
  let msg : Message
  let messsageGenerator = new mockMessageGenerator()

  afterEach(() => {
    sendSpy.restore()
    messsageGenerator.resetMocks()
  })

  it("replies to message if client is mentioned", () => {
    
    msg = messsageGenerator.getMessage({includeMentions: true, includeClientMention: true})

    sendSpy = sinon.spy(msg.channel, "send")

    onMessageHandler(msg)
    expect(sendSpy.calledOnce).to.be.true
  })

  it("doesn't send any messages if the client is not mentioned", () => {
    msg = messsageGenerator.getMessage({includeMentions: true})

    sendSpy = sinon.spy(msg.channel, "send")

    onMessageHandler(msg)
    expect(sendSpy.notCalled).to.be.true
  })

  it("doesn't send any messages if there are no mentions", () => {
    msg = messsageGenerator.getMessage()

    sendSpy = sinon.spy(msg.channel, "send")

    onMessageHandler(msg)
    expect(sendSpy.notCalled).to.be.true
  })
})