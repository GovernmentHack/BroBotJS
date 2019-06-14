import { Message, TextChannel } from "discord.js";
import DiscordBot, { IIngestChannelMessagesOutput } from "./discordBot";

enum Command {
  INVALID,
  LEARN
}

const onMessageHandler = async (bot: DiscordBot, msg : Message) => {
  let clientWasMentioned : boolean = msg.isMemberMentioned(msg.client.user) 
  let commandCalled : Command

  if (!!msg.cleanContent) commandCalled = Command[msg.cleanContent.slice(1).toUpperCase()]
  if(!!commandCalled) {
    console.debug(`Recieved ${Command[commandCalled]} command`)
    await bot.ingestChannelMessages(msg.channel as TextChannel).then((output : IIngestChannelMessagesOutput) => {
      if(!!output.error) msg.channel.send(`I could not ingest messages: ${output.error}`)
      msg.channel.send(`Ingested ${output.messagesIngested} messages.`)
    })
  }

  if(clientWasMentioned) {
    msg.channel.send(bot.chain.getSentence())
  }
}

export default onMessageHandler