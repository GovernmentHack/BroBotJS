import sinon, { SinonSpy } from 'sinon'
import onMessage from '../src/onMessage'
import { iMockChannel, iMockMember, iMockMentions, iMockMsg, iMockClient, iMockClientUser } from './discordMocks';

describe("onMessage", () => {
  const sendSpy : SinonSpy = sinon.spy()
  const replySpy : SinonSpy = sinon.spy()
  const mockChannel : iMockChannel = {
    send: sendSpy,
  }
  const mockMember : iMockMember = {
    id: "12345",
    nickname: "broBot",
  }
  const mockMentions : iMockMentions = {
    members: [mockMember],
  }
  const mockClientUser : iMockClientUser = {
    id: "12345",
  }
  const mockClient : iMockClient = {
    user: mockClientUser,
  }
  let mockMsg : iMockMsg = {
    reply: replySpy,
    channel: mockChannel,
    mentions: mockMentions,
    client: mockClient,
  }

  afterEach(() => {
    mockMsg.reply.resetHistory()
    mockMsg.channel.send.resetHistory()
  })

  it("replies to mentions of the client", () => {

  })
})