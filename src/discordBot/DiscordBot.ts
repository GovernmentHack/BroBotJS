import Discord, { Client, TextChannel, Collection, Message, Channel } from 'discord.js'
import fs from 'fs'
import * as secret from '../../token.json'
import onMessageHandler from './discordEventHandlers/onMessageHandler'
import onReadyHandler from './discordEventHandlers/onReadyHandler'
import Chain from '../vocabulary/Chain'

const VOCABULARY_FILE = process.env.VOCABULARY_FILE? process.env.VOCABULARY_FILE : './vocabulary.json' 

interface IIngestChannelMessagesOutput {
  messagesIngested: number,
  error? : string
}

class DiscordBot {
  client : Client
  chain : Chain
  private responseFrequency : number
  mutedChannels : Set<string>
  
  constructor() {
    this.client = new Discord.Client()
    this.chain = new Chain()
    this.responseFrequency = 33
    this.mutedChannels = new Set<string>()
    this.client.on('ready', () => {
      onReadyHandler(this)
    });
    this.client.on('message', (message) => {
      onMessageHandler(this, message)
    });
  }

  fetchAllMessages = async (channel: TextChannel, messagesBucket: Collection<string, Message>, messageID?: string) => {
    return channel
      .fetchMessages({limit: 100, before: messageID})
      .then((messagesCollected) => {
        console.debug("Fetching messages ...")
        console.debug(`Fetched ${messagesCollected.size} messages in this batch ...`)
        messagesBucket = messagesBucket.concat(messagesCollected)
        if (!!messagesCollected && messagesCollected.size === 100){
          return this.fetchAllMessages(channel, messagesBucket, messagesCollected.lastKey())
        }
        console.debug("Fetched batch of messages.")
        return messagesBucket
      })
      .catch((error) => {
        throw error
      })
  }

  getResponseFrequency() : number {
    return this.responseFrequency
  }

  setResponseFrequency(newFrequency : number) {
    if(newFrequency >= 0 && newFrequency <= 100) {
      this.responseFrequency = newFrequency
    }
  }
  
  login() {
    this.setChainFromFile()
    this.client.login(secret.token)
  }
  
  logout() {
    this.client.destroy()
    console.info('Logged out!')
  }

  writeChainToFile() {
    fs.writeFile(VOCABULARY_FILE, JSON.stringify(this.chain.toJSON()), (error) => {
      if (error) throw error
    })
  }

  setChainFromFile() {
    console.debug("Importing vocabulary from file ...")
    let tempChain : Chain
    try {
      const vocabularyRaw = fs.readFileSync(VOCABULARY_FILE, 'utf8')
      const vocabulary = JSON.parse(vocabularyRaw)
      tempChain = new Chain(vocabulary.links, vocabulary.startingLinks)
      this.chain = tempChain
      console.debug("Imported vocabulary")
    } catch(error) {
      console.warn(`Import failed, chain not initialized: ${error}`)
      tempChain = new Chain()
    }
  }

  async ingestChannelMessages(channel: TextChannel) : Promise<IIngestChannelMessagesOutput> {
    let messages : Collection<string, Message> = new Collection<string, Message>()
    return this.fetchAllMessages(channel, messages)
      .then((collectedMessages) => {
        let messagesIngested = 0
        console.debug("Parsing Sentences...")
        collectedMessages.forEach((message: Message) => {
          if(!(message.author.bot || message.cleanContent[0] === "!")) {
            this.chain.parseSentence(message.cleanContent)
            messagesIngested ++
          }
        })
        console.debug("Parsed Sentences")

        console.debug("Updating Probabilities ...")
        this.chain.updateProbabilities()
        console.debug("Updated Probabilities")

        console.debug("Saving Chain to file ...")
        this.writeChainToFile()
        console.debug("Chain saved.")

        return {
          messagesIngested
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