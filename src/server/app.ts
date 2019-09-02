import express from 'express';
import bodyParser from 'body-parser'
import DiscordBot from '../discordBot/DiscordBot'
import { getRepository } from 'typeorm';
import { MessageLogEntry } from '../entity/MessageLogEntry';

let staticDir : string
if(!!process.env.VCAP_SERVICES) {
  staticDir = "dist"
} else {
  staticDir = "build/dist"
}

let app = express()
app.use(bodyParser.json())
let apiRouter = express.Router()

const discordBot = new DiscordBot()

apiRouter.get('/messageLog', async (req, res) => {
  const messageLogRepo = getRepository(MessageLogEntry)
  const messageLogs = await messageLogRepo
    .createQueryBuilder("message_log_entry")
    .orderBy("message_log_entry.timeStamp", "DESC")
    .limit(10)
    .getMany()
  res.setHeader('Content-Type', 'application/json');
  res.json(messageLogs)
})

apiRouter.get('/messageLog/:id', async (req, res) => {
  const messageLogRepo = getRepository(MessageLogEntry)
  if(req.params && req.params.id) {
    const messageLog = await messageLogRepo
      .find({id: req.params.id})
    res.setHeader('Content-Type', 'application/json');
    res.json(messageLog)
  }
  else {
    res.writeHead(400)
    res.end();
  }
})

app.use('/', express.static(staticDir))
app.use('/api', apiRouter)

export default app
export {discordBot}