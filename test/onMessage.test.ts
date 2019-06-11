import sinon, { SinonSpy} from 'sinon'
import chai from 'chai'
import onMessage from '../src/onMessage'
import { Message } from 'discord.js'
import * as mockMessage from './mockMessage'

const expect = chai.expect

let sendSpy : SinonSpy

describe("onMessage", () => {
  let msg : Message

  afterEach(() => {
    sendSpy.restore()
    mockMessage.resetMocks()
  })

  it("replies to message if client is mentioned", () => {
    
    msg = mockMessage.getMessage({includeMentions: true, includeClientMention: true})

    sendSpy = sinon.spy(msg.channel, "send")

    onMessage(msg)
    expect(sendSpy.calledOnce).to.be.true
  })

  it("doesn't send any messages if the client is not mentioned", () => {
    msg = mockMessage.getMessage({includeMentions: true})

    sendSpy = sinon.spy(msg.channel, "send")

    onMessage(msg)
    expect(sendSpy.notCalled).to.be.true
  })

  it("doesn't send any messages if there are no mentions", () => {
    msg = mockMessage.getMessage()

    sendSpy = sinon.spy(msg.channel, "send")

    onMessage(msg)
    expect(sendSpy.notCalled).to.be.true
  })
})