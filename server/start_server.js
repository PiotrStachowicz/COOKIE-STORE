let server = require('C:/Users/pansm/Cookie-Store/COOKIE-STORE/app.js')
let http = require('http')
let port = 5000

http.createServer(server).listen(port)

console.log(`server listening on port ${port}`)