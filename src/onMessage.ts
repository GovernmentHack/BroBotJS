import { Message } from "discord.js";

const onMessage = (msg : Message) => {
  const clientId = msg.client.user.id
  const firstMentionId = 
    msg.mentions &&
    msg.mentions.members &&
    msg.mentions.members.first() &&
    msg.mentions.members.first().id
  if (firstMentionId === clientId) {
    msg.channel.send('...You rang?')
  }
}

export default onMessage