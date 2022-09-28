var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.json('index.html');
});

users = [];
io.on("connection", (socket) => {
    let roomID = 2436;
    socket.join(roomID);
    socket.on("cardMove", ({ x, y, username }) => {
        console.log(x, y);
        socket.broadcast.to(roomID).emit("cardPositionUpdate", {
            x: x,
            y: y,
            username: username
        });
    });
    socket.on("disconnect", () => {
    });
})


http.listen(8080, function () {
    console.log('listening on localhost:8080');
});