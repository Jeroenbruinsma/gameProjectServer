const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const jsonParser = bodyParser.json()
let port;
require("./db.js")
//const advertisement = require('./advertisement/router')
const User = require('./user/router')
const Login =  require('./login/router')
const Game = require('./game/router')
const Teeth = require('./teeth/router')

const cors = require('cors')

if(!process.env.PORT){
     port = 5000
}else{
     port = process.env.PORT
}
    
console.log("Api server on port", port)
app.get('/', (req, res) => res.send('Server running'))

app.listen(port, () => `Listening on port ${port}`)
app.use(cors())
app.use(jsonParser)
app.use(User)
app.use(Login)
app.use(Game)
app.use(Teeth)