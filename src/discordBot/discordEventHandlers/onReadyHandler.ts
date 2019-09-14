import DiscordBot from "../DiscordBot";

const onReadyHandler = (bot : DiscordBot) => {
  if (!!bot.client.user) { 
    console.info(`Logged in as ${bot.client.user.tag}!`)
  }
}

export default onReadyHandler