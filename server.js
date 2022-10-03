const express = require("express")
const app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
const path = require("path")
const port = process.env.PORT || 5000
const mongoose = require('mongoose')
const { roomSchema, Room } = require('./schemas/room')

// Web sockets
io.on("connection", (socket) => {
    let roomID = 2436
    socket.join(roomID)
    socket.on("cardMove", ({ x, y, username }) => {
        console.log(x, y);
        socket.broadcast.to(roomID).emit("cardPositionUpdate", {
            x: x,
            y: y,
            username: username
        })
    })
    socket.on("disconnect", () => {
    })
})


// Restful Apis

// Rooms
app.get('/api/rooms', (req, res) => {
    Room.find({})
        .then(docs => {
            res.json(docs)
        })
        .catch(() => {
            res.json({ msg: "db reading .. err.  Check with server devs" })
        })
})

app.get('/api/room/:id', (req, res) => {
    Room.find({ _id: mongoose.Types.ObjectId(`${req.params.id}`) })
        .then(doc => {
            res.json(doc)
        })
        .catch(() => {
            res.json({ msg: "db reading .. err.  Check with server devs" })
        })
})

app.use(express.json())
app.post('/api/rooms', (req, res) => {
    console.log(123)
    Room.create(req.body, (err) => {
        if (err) console.log(err)
    });
    res.json({"status": "ok"})
})

if (process.env.NODE_ENV === "production") {
    app.use(express.static('build'))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
    })
}

app.listen(port, async (err) => {
    if (err) return console.loge(err)
    try {
        await mongoose.connect('mongodb+srv://root:S4ndB0x@game-sandbox.altns89.mongodb.net/data?retryWrites=true&w=majority');
    } catch (error) {
        console.log('db error')
    }
    console.log("Server running on port: ", port)
})