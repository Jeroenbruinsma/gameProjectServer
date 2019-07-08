const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const jsonParser = bodyParser.json()
let port;
require("./db.js")
//const advertisement = require('./advertisement/router')
//const tokens = require('./tokens/middleware')
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
//app.use(advertisement)
