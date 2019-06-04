import express from 'express'
import http from 'http'
import bot from './discordBot'

let app = express()


app.get('/', function(req, res){
    res.writeHead(200);
    res.write(bot.log.join("\n"));
    res.end();
});

http.createServer(app).listen(3000);

export default app