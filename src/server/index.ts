import http from 'http'
import app, {discordBot} from './app'
import {createConnection} from "typeorm"
import "reflect-metadata"

const connection = createConnection();

discordBot.login()
const server = http.createServer(app);
server.listen(3000)

export default server