import sinon, { SinonSpy} from 'sinon'
import { mock, instance, when, reset } from 'ts-mockito'
import chai from 'chai'
import onMessage from '../src/onMessage'
import { Message, ClientUser, Collection, GuildMember, MessageMentions, Client, Channel, TextChannel } from 'discord.js';

const expect = chai.expect

const CLIENT_ID = "12345"
const OTHER_MEMBER = "00000"

let sendSpy : SinonSpy

let mockMsg : Message = mock(Message)
let msg : Message

let mockTextChannel : TextChannel = mock(TextChannel)
let textChannel : TextChannel

let mockMentions : MessageMentions = mock(MessageMentions)
let mentions : MessageMentions

let mockGuildMember : GuildMember = mock(GuildMember)
let guildMember : GuildMember

let mockClient : Client = mock(Client)
let client: Client

let mockClientUser : ClientUser = mock(ClientUser)
let clientUser : ClientUser

const getMessageWithMentionID = (id : string) : Message => {
  when(mockClientUser.id).thenReturn(CLIENT_ID)
  clientUser = instance(mockClientUser)
  
  when(mockClient.user).thenReturn(clientUser)
  client = instance(mockClient)

  when(mockGuildMember.id).thenReturn(id)
  guildMember = instance(mockGuildMember)
  let members = new Collection<string, GuildMember>()
  members.set("0",guildMember)
  
  when(mockMentions.members).thenReturn(members)
  mentions = instance(mockMentions)

  textChannel = instance(mockTextChannel)

  when(mockMsg.mentions).thenReturn(mentions)
  when(mockMsg.client).thenReturn(client)
  when(mockMsg.channel).thenReturn(textChannel)

  return instance(mockMsg)
}

const resetMocks = () => {
  reset(mockMsg)
  reset(mockMentions)
  reset(mockGuildMember)
  reset(mockClient)
  reset(mockClientUser)
}

describe("onMessage", () => {

  afterEach(() => {
    sendSpy.restore()
    resetMocks()
  })

  it("replies to message if client is mentioned", () => {
    
    msg = getMessageWithMentionID(CLIENT_ID)

    sendSpy = sinon.spy(msg.channel, "send")

    onMessage(msg)
    expect(sendSpy.calledOnce).to.be.true
  })

  it("doesn't send any messages if the client is not mentioned", () => {
    msg = getMessageWithMentionID(OTHER_MEMBER)

    sendSpy = sinon.spy(msg.channel, "send")

    onMessage(msg)
    expect(sendSpy.notCalled).to.be.true
  })
})