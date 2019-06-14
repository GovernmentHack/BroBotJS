import Discord, { Client, TextChannel, Collection, Message, Channel } from 'discord.js'
import * as secret from '../../token.json'
import onMessageHandler from './onMessageHandler'
import onReadyHandler from './onReadyHandler'
import Chain from '../vocabulary/Chain'

const fetchAllMessages = async (channel: TextChannel, messagesBucket: Collection<string, Message>) => {
  return channel
    .fetchMessages({limit: 100})
    .then((messagesCollected) => {
      if (!!messagesCollected && messagesCollected.size > 0){
        messagesBucket = messagesBucket.concat(messagesCollected)
        return fetchAllMessages(channel, messagesBucket)
      }
      return messagesBucket
    })
    .catch((error) => {
      throw error
    })
}

interface IIngestChannelMessagesOutput {
  messagesIngested: number,
  error? : string
}

class DiscordBot {
  client : Client
  chain : Chain
  
  constructor() {
    this.client = new Discord.Client()
    this.client.on('ready', () => {
      onReadyHandler(this)
    });
    this.client.on('message', (message) => {
      onMessageHandler(this, message)
    });
    
    this.chain = new Chain()
  }
  
  login() {
    this.client.login(secret.token)
  }
  
  logout() {
    this.client.destroy()
    console.log('Logged out!')
  }

  async ingestChannelMessages(channel: TextChannel) : Promise<IIngestChannelMessagesOutput> {
    let messages : Collection<string, Message> = new Collection<string, Message>()
    return fetchAllMessages(channel, messages)
      .then((collectedMessages) => {
        collectedMessages.forEach((message: Message) => {
          this.chain.parseSentence(message.cleanContent)
        })
        this.chain.updateProbabilities()
        return {
          messagesIngested: collectedMessages.size
        }
      })
      .catch((error) => {
        return {
          messagesIngested: 0,
          error,
        }
      })
  }
}

export default DiscordBot
export { IIngestChannelMessagesOutput }