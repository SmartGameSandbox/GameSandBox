require('dotenv').config()
const express = require("express");
const app = express();
const cors = require('cors');
var http = require("http").Server(app);

var io;
app.use(cors());
io = require("socket.io")(http, { cors: { origin: "*" } });
// if (process.env.NODE_ENV !== "production") {
//   app.use(cors());
//   io = require("socket.io")(http, { cors: { origin: "*" } });
// } else {
//   io = require("socket.io")(http);
// }
const path = require("path");
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const { roomSchema, Room } = require("./schemas/room");
const { cardSchema, Card } = require("./schemas/card");
const idGenerator = require("./utils/id_generator");
app.use(express.json());

const ALLROOMSDATA = {};
var cron = require('node-cron');
cron.schedule('00 04 * * *', async () => {
  // find room with id in ALLROOMSDATA index
  const rooms = await Room.find({ id: { $in: Object.keys(ALLROOMSDATA) } });
  for (const roomID in ALLROOMSDATA) {
    const found = rooms.find(room => room.id === roomID);
    if (!found) {
      delete ALLROOMSDATA[roomID];
    }
  }
}, {
  scheduled: true,
  timezone: "America/Vancouver"
});

// Web sockets
io.on("connection", async (socket) => {
  // Join room
  socket.on("joinRoom", async ({ roomID, password, username }) => {
    if (roomID) {
      const roomData = await Room.findOne({ id: roomID, password: password });
      if (roomData) {
        if (ALLROOMSDATA[roomID] === undefined) {
          ALLROOMSDATA[roomID] = roomData;
        }
        socket.join(roomID);
        if (ALLROOMSDATA[roomID].hand === undefined) {
          ALLROOMSDATA[roomID].hand = {};
        }
        if (ALLROOMSDATA[roomID].hand[username] === undefined) {
          ALLROOMSDATA[roomID].hand[username] = [];
        }
        io.to(socket.id).emit('tableReload', {
          cards: ALLROOMSDATA[roomID].cards,
          deck: ALLROOMSDATA[roomID].deck,
          hand: ALLROOMSDATA[roomID].hand[username] ? ALLROOMSDATA[roomID].hand[username] : []
        });
        // add user to the user array here
        console.log(`User ${username} joined room ${roomID}`);
      }
    } else {
      console.error("Room Invalid");
    }
  });

  socket.on("tableChange", ({ username, roomID, tableData }) => {
    if (ALLROOMSDATA[roomID] && tableData) {
      ALLROOMSDATA[roomID].cards = tableData.cards;
      ALLROOMSDATA[roomID].deck = tableData.deck;
      ALLROOMSDATA[roomID].hand[username] = tableData.hand;
      io.to(roomID).emit("tableChangeUpdate", {
        username: username,
        tableData: {
          cards: ALLROOMSDATA[roomID].cards,
          deck: ALLROOMSDATA[roomID].deck,
        }
      });
    }
  });

  socket.on("mouseMove", ({ x, y, username, roomID }) => {
    io.to(roomID).emit("mousePositionUpdate", {
      x: x,
      y: y,
      username: username,
    });
  });
});

io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

// Restful Apis
// Rooms
app.get("/api/rooms", async (req, res) => {
  try {
    res.json(await Room.find());
  } catch (err) {
    res.json({ status: "error", message: err });
    console.log(err);
  }
});

// Get room by id
app.get("/api/room", async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      throw new Error("Room ID is required");
    }
    const password = req.query.password;
    const roomData = await Room.findOne({ id: id, password: password });
    if (roomData) {
      res.json(roomData);
    } else {
      res.json({ status: "error", message: "Invalid room ID or password" });
    }
  } catch (err) {
    res.json({ status: "error", message: err });
    console.log(err);
  }
});

//create room
app.post("/api/room", async (req, res) => {
  const ROOM_ID_LENGTH = 4;
  let roomID = 0;
  try {
    do {
      roomID = idGenerator(ROOM_ID_LENGTH);
    } while (await Room.findOne({ id: roomID }));
    if (!req.body) {
      throw new Error("Error: No room body provided");
    }
    const allCards = await Card.find();
    const gameRoomData = {
      id: roomID,
      password: req.body.password,
      name: req.body.name,
      image: req.body.image,
      deck: allCards,
      hand: {},
      cards: [],
    }
    const room = new Room(gameRoomData);
    const result = await room.save();
    if (!result) {
      throw new Error("Error: Room not created");
    }
    ALLROOMSDATA[roomID] = gameRoomData;
    res.json(result);
  } catch (err) {
    res.json({ status: "error", message: err });
    console.log(err);
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}

// Register
const { User } = require("./schemas/user");

// createAccount 
app.post("/api/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  try {
    if (await User.findOne({ username: req.body.username })) {
      throw new Error("Username already exists");
    }
    const result = await newUser.save();
    if (!result) {
      throw new Error("Error: User failed to be created");
    }
    res.json({ "status": "success", "message": "User login successful" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Session
app.post('/api/login', async (req, res) => {
  try {
    const user = await User.findOne({ "username": req.body.username, "password": req.body.password });
    if (!user) {
      throw new Error("Invalid username or password");
    }
    res.json({ "status": "success", "message": "User created", "user": user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

http.listen(port, async (err) => {
  if (err) return console.loge(err);
  try {
    await mongoose.connect(
      "mongodb+srv://root:S4ndB0x@game-sandbox.altns89.mongodb.net/data?retryWrites=true&w=majority"
    );
  } catch (error) {
    console.log("db error");
  }
  console.log("Server running on port: ", port);
});
