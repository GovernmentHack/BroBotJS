import express from 'express';
import DiscordBot from '../discordBot/DiscordBot'

let app = express()
let apiRouter = express.Router()

const discordBot = new DiscordBot()

apiRouter.get('/messageLog', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(discordBot.getMessageLog())
})

app.get('/', (req, res) => {
    res.writeHead(200);
    res.end();
});

app.use('/api', apiRouter)

export default app
export {discordBot}