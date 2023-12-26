let server = require('C:/Users/pansm/Cookie-Store/COOKIE-STORE/app.js')
let https = require('https')
var fs = require('fs')
let port = 5000

async function start_server(){
    var pfx = await fs.promises.readFile('./server/zadanie2.pfx')
    https.createServer(
        {
            pfx: pfx,
            passphrase: 'zadanie2'
        },
        server
    ).listen(port);
}

start_server()
console.log(`server live on http://localhost:${port}`)