import http from 'http'
import app, {discordBot} from './app'

discordBot.login()
const server = http.createServer(app);
server.listen(3000)

export default server