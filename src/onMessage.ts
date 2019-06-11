import { Message } from "discord.js";

const onMessage = (msg : Message) => {
  const clientId : string = msg.client.user.id
  let clientWasMentioned : boolean = msg.mentions && msg.mentions.members && !!msg.mentions.members.get(clientId)

  if(clientWasMentioned) {
    msg.channel.send('...You rang?')
  }
}

export default onMessage