import express from 'express';
import DiscordBot from '../discordBot/DiscordBot'

let app = express()

const discordBot = new DiscordBot()

app.get('/', function(req, res){
    res.writeHead(200);
    res.end();
});

export default app
export {discordBot}