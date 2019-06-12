import Discord, { Client } from 'discord.js'
import * as secret from '../../token.json'
import onMessageHandler from './onMessageHandler'


class DiscordBot {
  client : Client
  log: string[]
  
  constructor() {
    this.client = new Discord.Client();
    this.client.on('ready', () => {
      if (!!this.client.user) { 
        console.log(`Logged in as ${this.client.user.tag}!`)
      }
    });
    this.client.on('message', onMessageHandler);

    this.log = []
  }

  login() {
    this.client.login(secret.token);
  }

  logout() {
    this.client.destroy()
    console.log('Logged out!')
  }
}

export default DiscordBot