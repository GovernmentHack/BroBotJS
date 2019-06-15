import { Message, ClientUser, Collection, GuildMember, MessageMentions, Client, TextChannel, User } from 'discord.js';
import { mock, instance, when, reset } from 'ts-mockito'

const CLIENT_ID = "12345"
const OTHER_ID = "00000"

interface IGetMessageOptions {
  includeMentions?: boolean,
  includeClientMention?: boolean,
  cleanContent?: string,
  author?: User
}

interface IGetUserOptions {
  bot? : boolean,
  id?: string
}

class MockGenerator {
  
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

  getChannel() : TextChannel {
    this.mockTextChannel = mock(TextChannel)
    let textChannel : TextChannel = instance(this.mockTextChannel)

    return textChannel
  }

  getUser(options?: IGetUserOptions) : User {
    const userID = (!!options && !!options.id) ? options.id : OTHER_ID
    const isBot = (!!options && !!options.bot) ? options.bot : false
    this.mockUser = mock(User)
    when(this.mockUser.id).thenReturn(userID)
    when(this.mockUser.bot).thenReturn(isBot)
    return instance(this.mockUser)
  }
  
  getMessage(options: IGetMessageOptions = {includeMentions: false, includeClientMention: false}) : Message {
    this.mockMsg = mock(Message)
    this.mockMentions = mock(MessageMentions)
    this.mockClientGuildMember = mock(GuildMember)
    this.mockGuildMember = mock(GuildMember)
    this.mockClient = mock(Client)
    this.mockClientUser = mock(ClientUser)
    const otherUser = this.getUser({id: OTHER_ID})
    
    when(this.mockClientUser.id).thenReturn(CLIENT_ID)
    when(this.mockClientUser.bot).thenReturn(true)
    let clientUser : ClientUser = instance(this.mockClientUser)
    
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
  
    if(!!options.cleanContent) {
      when(this.mockMsg.cleanContent).thenReturn(options.cleanContent)
    } else {
      when(this.mockMsg.cleanContent).thenReturn(" ")
    }

    if(!!options.author) {
      when(this.mockMsg.author).thenReturn(options.author)
    } else {
      when(this.mockMsg.author).thenReturn(otherUser)
    }

    when(this.mockMsg.client).thenReturn(client)
    when(this.mockMsg.channel).thenReturn(this.getChannel())
    if(options.includeClientMention){
      when(this.mockMsg.isMemberMentioned(client.user)).thenReturn(true)
    }
  
    return instance(this.mockMsg)
  }
}

export default MockGenerator