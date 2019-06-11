import { Message, ClientUser, Collection, GuildMember, MessageMentions, Client, TextChannel } from 'discord.js';
import { mock, instance, when, reset } from 'ts-mockito'

const CLIENT_ID = "12345"
const OTHER_MEMBER = "00000"

let mockMsg : Message = mock(Message)
let mockTextChannel : TextChannel = mock(TextChannel)
let mockMentions : MessageMentions = mock(MessageMentions)
let mockClientGuildMember : GuildMember = mock(GuildMember)
let mockGuildMember : GuildMember = mock(GuildMember)
let mockClient : Client = mock(Client)
let mockClientUser : ClientUser = mock(ClientUser)

interface IGetMessageOptions {
  includeMentions?: boolean,
  includeClientMention?: boolean
}

const getMessage = (options: IGetMessageOptions = {includeMentions: false, includeClientMention: false}) : Message => {
  when(mockClientUser.id).thenReturn(CLIENT_ID)
  let clientUser : ClientUser = instance(mockClientUser)
  
  when(mockClient.user).thenReturn(clientUser)
  let client: Client = instance(mockClient)

  if(options.includeMentions) {
    when(mockGuildMember.id).thenReturn(OTHER_MEMBER)
    let guildMember : GuildMember = instance(mockGuildMember)
    let members = new Collection<string, GuildMember>()
    members.set(OTHER_MEMBER, guildMember)
  
    if(options.includeClientMention){
      when(mockClientGuildMember.id).thenReturn(CLIENT_ID)
      let clientGuildMember : GuildMember = instance(mockClientGuildMember)
      members.set(CLIENT_ID, clientGuildMember)
    }
    
    when(mockMentions.members).thenReturn(members)
    let mentions : MessageMentions = instance(mockMentions)
    when(mockMsg.mentions).thenReturn(mentions)
  }

  let textChannel : TextChannel = instance(mockTextChannel)

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

export {getMessage, resetMocks}