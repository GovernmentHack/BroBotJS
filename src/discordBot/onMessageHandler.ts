import { Message } from "discord.js";
import DiscordBot from "./discordBot";

const onMessageHandler = (bot: DiscordBot, msg : Message) => {
  let clientWasMentioned : boolean = msg.isMemberMentioned(msg.client.user)

  if(clientWasMentioned) {
    msg.channel.send('...You rang?')
  }
}

export default onMessageHandler