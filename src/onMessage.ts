import { Message } from "discord.js";

const onMessage = (msg : Message) => {
  let clientWasMentioned : boolean = msg.isMemberMentioned(msg.client.user)

  if(clientWasMentioned) {
    msg.channel.send('...You rang?')
  }
}

export default onMessage