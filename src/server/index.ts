import http from 'http'
import app, {discordBot} from './app'
import {createConnection} from "typeorm"
import config from "../../ormconfig"
import "reflect-metadata"

const connection = createConnection(config).catch((err) => {throw err})

discordBot.login()
const server = http.createServer(app)
server.listen(process.env.PORT || 3000)

export default server