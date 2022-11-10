require('dotenv').config()
const express = require("express");
const app = express();
const cors = require('cors');
var http = require("http").Server(app);

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
  socket.on("joinRoom", async ({ roomID, password, username}) => {
    if (roomID && password) {
      const roomData = await Room.findOne({ id: roomID, password: password });
      if (roomData) {
        socket.join(roomID);
        // add user to the user array here
        console.log(`User ${username} joined room ${roomID}`);
      }
    }
  });

  socket.on("cardMove", ({ x, y, username, roomID, cardID }) => {
    io.to(roomID).emit("cardPositionUpdate", {
      cardID: cardID,
      x: x,
      y: y,
      username: username
    });
  });

  socket.on("cardFlip", ({ isFlipped, username, roomID, cardID }) => {
    console.log("get flipped mesg", isFlipped, username, roomID, cardID);
    io.to(roomID).emit("cardFlipUpdate", {
      cardID: cardID,
      isFlipped: isFlipped,
      username: username,
    });
  });

  socket.on("mouseMove", ({ x, y, username, roomID }) => {
    io.to(roomID).emit("mousePositionUpdate", {
      x: x,
      y: y,
      username: username,
    });
  });
  
  socket.on("cardDraw", ({ username, roomID, cardID }) => {
    io.to(roomID).emit("cardDrawUpdate", {
      cardID: cardID,
      username: username,
    });
  });

  //socket for playerDiscardCard
  socket.on("playerDiscardCard", ({ username, roomID, card }) => {
    io.to(roomID).emit("playerDiscardCardUpdate", {
      card: card,
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
    const gameRoomData = new Room({
      id: roomID,
      password: req.body.password,
      name: req.body.name,
      image: req.body.image
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


// Register
const { check, validationResult } = require('express-validator');
const { User } = require("./schemas/user");

// createAccount 
app.get("/api/register", (req, res) => res.render('createAccount'));
app.post("/api/register", async (req, res) => {
  const newUserModel = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  // const result = await newUserModel.save();

  //queryData = newUserModel(req.body.username, req.body.email, req.body.password);
  //let queryData = await newUserModel.find({ $or: [{ username: queryData.username }, { email: queryData.email }, { password: queryData.password }] });
  //console.log(queryData);
  newUserModel.save((err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
    } else {
      res.status(200).json({ message: { msgBody: "Account successfully created", msgError: false } });
    }
  });

  /*
  if (queryData.length === 0) {
    queryData.save().
      then((result) => {
        console.log(result);
        res.json({ registerSuccess: "true" });
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
  */
}
);

// Session

// const session = require('express-session');
// const MongoDBStore = require('session-file-store')(session);
// const MONGODB_URI = "http://localhost:5000"

// const mongoDBStore = new MongoDBStore({
//   uri: process.env.MONGODB_URI,
//   collection: 'sessions'
// });

// app.use(
//   session({
//     httpOnly: true,
//     secure: true,
//     secret: 'secret key',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       secure: true,
//     },
//     store: mongoDBStore,
//   }
//   ));
// app.use(cors(corsOptions));
// app.use(express.json());

// const loginRouter = require('./routes/login');
// const { Router } = require('express');
// app.use("/api", loginRouter);

// app.listen(port, () => console.log(`Server started on port ${port}`));


// Router.post('/login', async (req, res) => {
//   const { username, email, password } = req.body;
//   if (!email || !password) {
//     res.status(400).json({ message: { msgBody: "All fields are required", msgError: true } });
//   }
//   const user = await User.findOne({ username });
//   if (!user) {
//     return res.status(400).json({ message: { msgBody: "Username is not found", msgError: true } });
//   }
//   if (user.password !== password) {
//     return res.status(400).json({ message: { msgBody: "Password is incorrect", msgError: true } });
//   }
//   req.session.user = user;
//   res.status(200).json({ message: { msgBody: "Login successful", msgError: false } });
// });


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
