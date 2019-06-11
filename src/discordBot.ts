import Discord from 'discord.js'
import * as secret from '../token.json'
import onMessage from './onMessage'

const client = new Discord.Client();

const bot = {
  client,
  log: []
}

bot.client.on('ready', () => {
  if (!!client.user) { 
    console.log(`Logged in as ${client.user.tag}!`)
  }
});

bot.client.on('message', onMessage);

bot.client.login(secret.token);

export default bot