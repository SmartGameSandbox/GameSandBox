require('dotenv').config()
const express = require("express");
const app = express();
const cors = require('cors');
var http = require("http").Server(app);
const { check, validationResult } = require('express-validator');

var io;
if (process.env.NODE_ENV !== "production") {
  app.use(cors());
  io = require("socket.io")(http, { cors: { origin: "*" } });
} else {
  io = require("socket.io")(http);
}
const path = require("path");
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const { roomSchema, Room } = require("./schemas/room");
const idGenerator = require("./utils/id_generator");
const { Check } = require('@mui/icons-material');
app.use(express.json());

// Web sockets
io.on("connection", async (socket) => {
  // Join room
  socket.on("joinRoom", async (data) => {
    const roomID = data.id;
    const password = data.password;
    if (roomID && password) {
      const roomData = await Room.findOne({ id: roomID, password: password });
      if (roomData) {
        socket.join(roomID);
        console.log("User joined room " + roomID);
      } else {
        socket.emit("error", "Invalid room ID or password");
      }
      // TODO: add user to the user array
    } else {
      socket.emit("error", "Room ID and password are required");
    }
  });

  socket.on("cardMove", ({ x, y, username, roomID }) => {
    socket.broadcast.to(roomID).emit("cardPositionUpdate", {
      x: x,
      y: y,
      username: username,
    });
  });

  socket.on("keepalive", async ({ roomID }) => {
    await Room.findOneAndUpdate({ id: roomID }, { expireAt: Date.now });
  });

  socket.on("disconnect", () => {
    // TODO: remove user from the user array
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
      res.json({ status: "success" });
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
    const gameRoomData = new Room({
      id: roomID,
      password: req.body.password,
      name: req.body.name
    });
    const result = await gameRoomData.save();
    if (!result) {
      throw new Error("Error: Room not created");
    }
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

// createAccount 
app.get("/api/admin", (req, res) => res.render('createAccount'));
app.post("/api/register",
  [
    check('username', 'Username is required')
      .trim()
      .exists()
      .notEmpty()
      .isLength({ min: 5, max: 20 })
      .withMessage('Username must be between 5 and 20 characters'),
    check('email', 'Email is required')
      .notEmpty()
      .exists()
      .isEmail(),
    check('password', 'Password is required')
      .trim()
      .exists()
      .notEmpty()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters')
  ],
  async (req, res) => {
    let incorrectInput = validationResult(req);
    console.log(incorrectInput);

    if (!incorrectInput.isEmpty()) {
      return res.status(400).json({ errors: incorrectInput.array() });
    } else {
      queryData = newUserModel(req.body.username, req.body.email, req.body.password);
      let queryData = await User.find({ $or: [{ username: queryData.username }, { email: queryData.email }, { password: queryData.password }] });
      console.log(queryData);

      if (queryData.length === 0) {
        queryData.save().
          then((result) => {
            console.log(result);
            res.render(createAccount, { registerSuccess: "Account is set up with GameSandBox!" });
          }).
          catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
          });

      } else if (queryData.length > 0) {
        let matchQueryEmails = [];
        let matchQueryUsername = [];

        for (let i = 0; i < queryData.length; i++) {
          if (queryData[i].email === queryData.email) {
            matchQueryEmails.push(queryData[i].email);
          }
          if (queryData[i].username === queryData.username) {
            matchQueryUsername.push(queryData[i].username);
          }
        }

        let emailMatchresult = matchQueryEmails.filter(emailMatch => emailMatch === queryData.email);
        let usernameMatchResult = matchQueryUsername.filter(usernameMatch => usernameMatch === queryData.username);
        console.log(emailMatchresult);
        console.log(usernameMatchResult);
      }

      if (usernameMatchResult.length > 0 && emailMatchresult.length > 0) {
        return res.render(createAccount, { registerError: "Username and email already exist" });
      }
      else if (usernameMatch.length > 0) {
        return res.render(createAccount, { registerError: "Username already exist" });
      } else if (emailmatch.length > 0) {
        return res.render(createAccount, { registerError: "Email already exist" });
      }
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
