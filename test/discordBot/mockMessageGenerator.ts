import { Message, ClientUser, Collection, GuildMember, MessageMentions, Client, TextChannel, User } from 'discord.js';
import { mock, instance, when, reset } from 'ts-mockito'
import { stringify } from 'querystring';

const CLIENT_ID = "12345"
const OTHER_ID = "00000"

interface IGetMessageOptions {
  includeMentions?: boolean,
  includeClientMention?: boolean,
  cleanContent?: string,
}

class mockMessageGenerator {
  
  mockMsg : Message 
  mockTextChannel : TextChannel
  mockMentions : MessageMentions
  mockClientGuildMember : GuildMember
  mockGuildMember : GuildMember
  mockUser : User
  mockClient : Client
  mockClientUser : ClientUser

  constructor () {
  }
  
  resetMocks() {
    reset(this.mockMsg)
    reset(this.mockMentions)
    reset(this.mockGuildMember)
    reset(this.mockClient)
    reset(this.mockClientUser)
  }
  
  getMessage(options: IGetMessageOptions = {includeMentions: false, includeClientMention: false}) : Message {
    this.mockMsg = mock(Message)
    this.mockTextChannel = mock(TextChannel)
    this.mockMentions = mock(MessageMentions)
    this.mockClientGuildMember = mock(GuildMember)
    this.mockGuildMember = mock(GuildMember)
    this.mockUser = mock(User)
    this.mockClient = mock(Client)
    this.mockClientUser = mock(ClientUser)

    when(this.mockClientUser.id).thenReturn(CLIENT_ID)
    let clientUser : ClientUser = instance(this.mockClientUser)

    when(this.mockUser.id).thenReturn(OTHER_ID)
    let otherUser : User = instance(this.mockUser)
    
    when(this.mockClient.user).thenReturn(clientUser)
    let client: Client = instance(this.mockClient)
  
    if(options.includeMentions) {
      let members = new Collection<string, GuildMember>()
      let users = new Collection<string, User>()

      when(this.mockGuildMember.id).thenReturn(OTHER_ID)
      when(this.mockGuildMember.user).thenReturn(otherUser)
      let otherGuildMember : GuildMember = instance(this.mockGuildMember)
      members.set(OTHER_ID, otherGuildMember)
      users.set(OTHER_ID, otherUser)
    
      if(options.includeClientMention){
        when(this.mockClientGuildMember.id).thenReturn(CLIENT_ID)
        when(this.mockClientGuildMember.user).thenReturn(clientUser)
        let clientGuildMember : GuildMember = instance(this.mockClientGuildMember)

        members.set(CLIENT_ID, clientGuildMember)
        users.set(CLIENT_ID, clientUser)
      }
      
      when(this.mockMentions.members).thenReturn(members)
      when(this.mockMentions.users).thenReturn(users)
      let mentions : MessageMentions = instance(this.mockMentions)
      when(this.mockMsg.mentions).thenReturn(mentions)
    }
  
    let textChannel : TextChannel = instance(this.mockTextChannel)
  
    if(!!options.cleanContent) {
      when(this.mockMsg.cleanContent).thenReturn(options.cleanContent)
    }
    when(this.mockMsg.client).thenReturn(client)
    when(this.mockMsg.channel).thenReturn(textChannel)
    if(options.includeClientMention){
      when(this.mockMsg.isMemberMentioned(client.user)).thenReturn(true)
    }
  
    return instance(this.mockMsg)
  }
}

export default mockMessageGenerator