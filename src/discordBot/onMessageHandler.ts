import { Message, TextChannel } from "discord.js";
import DiscordBot, { IIngestChannelMessagesOutput } from "./discordBot";
import { getRepository } from "typeorm";
import { MessageLogEntry } from "../entity/MessageLogEntry";

enum Command {
  INVALID,
  LEARN,
  SETFREQ,
  MUTE,
  UNMUTE
}

const handleLearnCommand = async (bot : DiscordBot, message : Message) => {
  bot.ingestChannelMessages(message.channel as TextChannel).then((output : IIngestChannelMessagesOutput) => {
    const messageLogRepo = getRepository(MessageLogEntry)
    if(!!output.error) {
      console.debug("Error: ", output.error)
      message.channel.send(`I could not ingest messages: ${output.error}`)
      messageLogRepo.insert({
        messageString: `I could not ingest messages: ${output.error}`,
        messageLinks: [],
        triggerMessage: message.cleanContent
      })
    }
    message.channel.send(`Ingested ${output.messagesIngested} messages.`)
    messageLogRepo.insert({
      messageString: `Ingested ${output.messagesIngested} messages.`,
      messageLinks: [],
      triggerMessage: message.cleanContent
    })
  })
}

const handleSetFreqCommand = (bot: DiscordBot, message : Message, options : string[]) => {
  const messageLogRepo = getRepository(MessageLogEntry)
  const isValidCommand = (
    !!options &&
    options.length === 1 && 
    parseInt(options[0]) >= 0 &&
    parseInt(options[0]) <= 100 
  )

  if(!isValidCommand) {
    message.channel.send("!setFreq usage: `!setFreq [0-100]`")
    messageLogRepo.insert({
      messageString: "!setFreq usage: `!setFreq [0-100]`",
      messageLinks: [],
      triggerMessage: message.cleanContent
    })
    return
  }

  bot.setResponseFrequency(parseInt(options[0]))
  message.channel.send(`I will respond to ${options[0]}% of messages now!`)
  messageLogRepo.insert({
    messageString: `I will respond to ${options[0]}% of messages now!`,
    messageLinks: [],
    triggerMessage: message.cleanContent
  })
}

const handleMuteCommand = (bot: DiscordBot, message: Message) => {
  const messageLogRepo = getRepository(MessageLogEntry)

  bot.mutedChannels.add(message.channel.id)
  message.channel.send("I am now muted on this channel. To unmute me, please use the `!unmute` command on this channel.")
  messageLogRepo.insert({
    messageString: "I am now muted on this channel. To unmute me, please use the `!unmute` command on this channel.",
    messageLinks: [],
    triggerMessage: message.cleanContent
  })
}

const handleUnmuteCommand = (bot: DiscordBot, message: Message) => {
  const messageLogRepo = getRepository(MessageLogEntry)

  bot.mutedChannels.delete(message.channel.id)
  message.channel.send("I am now unmuted on this channel.")
  messageLogRepo.insert({
    messageString: "I am now unmuted on this channel.",
    messageLinks: [],
    triggerMessage: message.cleanContent
  })
}

const handleCommands = async (command : Command, options : string[], bot: DiscordBot, message: Message) => {
  console.debug(`Recieved ${Command[command]} command`)

  options = message.cleanContent.split(" ").slice(1)
  console.debug(`Command Options: ${options}`)

  switch(command) {
    case (Command.LEARN) : {
      await handleLearnCommand(bot, message)
      break
    }
    case (Command.SETFREQ) : {
      handleSetFreqCommand(bot, message, options)
      break
    }
    case (Command.MUTE) : {
      handleMuteCommand(bot, message)
      break
    }
    case (Command.UNMUTE) : {
      handleUnmuteCommand(bot, message)
      break
    }
  }
}

const onMessageHandler = async (bot: DiscordBot, message : Message) => {
  let clientWasMentioned : boolean = message.isMemberMentioned(message.client.user) 
  let commandCalled : Command
  let commandOptions : string[]
  const messageLogRepo = getRepository(MessageLogEntry)

  if (!message.cleanContent) return
  if (message.author.bot) return
  
  commandCalled = Command[message.cleanContent.split(" ")[0].slice(1).toUpperCase()]
  commandOptions = message.cleanContent.split(" ").slice(1)
  if(!!commandCalled) {
    await handleCommands(commandCalled, commandOptions, bot, message)
  }

  if(clientWasMentioned && !commandCalled) {
    const sentence = bot.chain.getSentence()
    message.channel.send(sentence.sentence)
    messageLogRepo.insert({
      messageString: sentence.sentence,
      messageLinks: sentence.links,
      triggerMessage: message.cleanContent
    })
  }

  if(!(clientWasMentioned || commandCalled)) {
    if(Math.random() <= (bot.getResponseFrequency()/100)) {
      const sentence = bot.chain.getSentence()
      message.channel.send(sentence.sentence)
      messageLogRepo.insert({
        messageString: sentence.sentence,
        messageLinks: sentence.links,
        triggerMessage: message.cleanContent
      })
    }
  }
}

export default onMessageHandler