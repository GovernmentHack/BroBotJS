import Discord from 'discord.js'
import * as secret from '../token.json'

const client = new Discord.Client();

const bot = {
  "client": client,
  "log": []
}

bot.client.on('ready', () => {
  if (!!client.user) { 
    console.log(`Logged in as ${client.user.tag}!`)
  }
});

bot.client.on('message', (msg) => {
  if (msg.content === 'ping') {
    msg.channel.send('pong');
    bot.log.push('pong')
  }
});

bot.client.login(secret.token);

export default bot