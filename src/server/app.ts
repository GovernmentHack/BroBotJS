import express from 'express';
import bodyParser from 'body-parser'
import DiscordBot from '../discordBot/DiscordBot'

let app = express()
app.use(bodyParser.json())
let apiRouter = express.Router()

const discordBot = new DiscordBot()

apiRouter.get('/messageLog', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(discordBot.getMessageLog())
})

apiRouter.get('/messageLog/:entry', (req, res) => {
    if(req.params && req.params.entry) {
        res.setHeader('Content-Type', 'application/json');
        res.json(discordBot.getMessageLog()[req.params.entry])
    }
    else {
        res.writeHead(400)
        res.end();
    }
})

app.get('/', (req, res) => {
    res.writeHead(200);
    res.end();
});

app.use('/api', apiRouter)

export default app
export {discordBot}