import { Message, TextChannel } from "discord.js";
import DiscordBot, { IIngestChannelMessagesOutput } from "./discordBot";

enum Command {
  INVALID,
  LEARN,
  SETFREQ
}

const handleLearnCommand = async (bot : DiscordBot, message : Message) => {
  bot.ingestChannelMessages(message.channel as TextChannel).then((output : IIngestChannelMessagesOutput) => {
    if(!!output.error) message.channel.send(`I could not ingest messages: ${output.error}`)
    message.channel.send(`Ingested ${output.messagesIngested} messages.`)
  })
}

const handleSetFreqCommand = (bot: DiscordBot, message : Message, options : string[]) => {
  const isValidCommand = (
    !!options &&
    options.length === 1 && 
    parseInt(options[0]) >= 0 &&
    parseInt(options[0]) <= 100 
  )

  if(!isValidCommand) {
    message.channel.send("!setFreq usage: `!setFreq [0-100]`")
    return
  }

  bot.setResponseFrequency(parseInt(options[0]))
  message.channel.send(`I will respond to ${options[0]}% of messages now!`)
}

const handleCommands = async (command : Command, options : string[], bot: DiscordBot, message: Message) => {
  console.info(`Recieved ${Command[command]} command`)

  options = message.cleanContent.split(" ").slice(1)
  console.info(`Command Options: ${options}`)

  switch(command) {
    case (Command.LEARN) : {
      await handleLearnCommand(bot, message)
      break
    }
    case (Command.SETFREQ) : {
      handleSetFreqCommand(bot, message, options)
      break
    }
  }
}

const onMessageHandler = async (bot: DiscordBot, message : Message) => {
  let clientWasMentioned : boolean = message.isMemberMentioned(message.client.user) 
  let commandCalled : Command
  let commandOptions : string[]

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
    bot.addMessageLogEntry(sentence.sentence, sentence.links, message)
  }

  if(!(clientWasMentioned || commandCalled)) {
    if(Math.random() <= (bot.getResponseFrequency()/100)) {
      const sentence = bot.chain.getSentence()
      message.channel.send(sentence.sentence)
      bot.addMessageLogEntry(sentence.sentence, sentence.links, message)
    }
  }

}

export default onMessageHandler