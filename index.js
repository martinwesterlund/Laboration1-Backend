const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const router = require('./router.js')
const fs = require('fs')

let results

app.use('/', router)

io.on('connection', (socket) => {

    // Skickar en uppdatering av resultaten till den allmänna resultatsidan vid varje connection
    socket.emit('update results', (results))
    
    // Lyssnar på eventet 'send results' som kommer från rapporteringssidorna
    socket.on('send result', (data) => {
        results.lastDistrict = data.lastDistrict
        results.time = data.time
        results.party1 += data.result1
        results.party2 += data.result2
        results.party3 += data.result3
        results.party4 += data.result4
        results.party5 += data.result5

        //Skriver över det nya resultatet till fil
        fs.writeFile('./results.json', JSON.stringify(results), (err) => {
            if(err){
                console.log(err)
            } else {
                console.log('Resultatfilen uppdaterad')
            }
        })
        //Skickar iväg en uppdatering av resultaten till den allmänna resultatsidan
        io.sockets.emit('update results', (results))
    })
})

server.listen(8080, () => {
    console.log('Server igång på 8080')

    // Varje gång serven startar hämtar vi data från resultatfilen 
    fs.readFile('./results.json', 'utf8', (err, data) => {
        if(err){
            console.error(err)
        }
        else{
            results = JSON.parse(data)
        }
    })
})