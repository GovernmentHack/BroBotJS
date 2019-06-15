import { Message, TextChannel } from "discord.js";
import DiscordBot, { IIngestChannelMessagesOutput } from "./discordBot";

enum Command {
  INVALID,
  LEARN,
  SETFREQ
}

const onMessageHandler = async (bot: DiscordBot, message : Message) => {
  let clientWasMentioned : boolean = message.isMemberMentioned(message.client.user) 
  let commandCalled : Command
  let commandOptions : string[]

  if (!message.cleanContent) return
  if (message.author.bot) return
  
  commandCalled = Command[message.cleanContent.split(" ")[0].slice(1).toUpperCase()]
  if(!!commandCalled) {
    console.debug(`Recieved ${Command[commandCalled]} command`)

    commandOptions = message.cleanContent.split(" ").slice(1)
    console.debug(`Command Options: ${commandOptions}`)

    switch(commandCalled) {
      case (Command.LEARN) : {
        await bot.ingestChannelMessages(message.channel as TextChannel).then((output : IIngestChannelMessagesOutput) => {
          if(!!output.error) message.channel.send(`I could not ingest messages: ${output.error}`)
          message.channel.send(`Ingested ${output.messagesIngested} messages.`)
        })
        break
      }
      case (Command.SETFREQ) : {
        const isValidCommand = (
          !!commandOptions &&
          commandOptions.length === 1 && 
          parseInt(commandOptions[0]) >= 0 &&
          parseInt(commandOptions[0]) <= 100 
        )

        if(!isValidCommand) {
          message.channel.send("!setFreq usage: `!setFreq [0-100]`")
          return
        }

        bot.setResponseFrequency(parseInt(commandOptions[0]))
        message.channel.send(`I will respond to ${commandOptions[0]}% of messages now!`)
        break
      }
    }
  }

  if(clientWasMentioned && !commandCalled) {
    message.channel.send(bot.chain.getSentence())
  }

  if(!(clientWasMentioned || commandCalled)) {
    if(Math.random() <= (bot.getResponseFrequency()/100)) {
      message.channel.send(bot.chain.getSentence())
    }
  }

}

export default onMessageHandler