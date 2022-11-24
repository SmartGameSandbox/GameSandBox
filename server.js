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
const { cardSchema, Card } = require("./schemas/card");
const idGenerator = require("./utils/id_generator");
app.use(express.json());

// later need to reset this
// TODO: Need to track user's hands and deck
const ALLROOMSDATA = {};

// Web sockets
io.on("connection", async (socket) => {
  // Join room
  socket.on("joinRoom", async ({ roomID, password, username}) => {
    if (roomID) {
      const roomData = await Room.findOne({ id: roomID, password: password });
      if (roomData) {
        if (!ALLROOMSDATA[roomID]) {
          ALLROOMSDATA[roomID] = roomData;
        }
        socket.join(roomID);
        if (!ALLROOMSDATA[roomID].hands) {
          ALLROOMSDATA[roomID].hands = {};
        }
        ALLROOMSDATA[roomID].hands[username] = [];
        io.to(socket.id).emit('roomCardData', ALLROOMSDATA[roomID]);
        // add user to the user array here
        console.log(`User ${username} joined room ${roomID}`);
      }
    } else {
      res.json({ error: "Room not found" });
    }
  });

  socket.on("cardChangeOnTable", ({ username, roomID, card }) => {
    let index = ALLROOMSDATA[roomID].cards.findIndex((c) => c.id === card.id);   
    ALLROOMSDATA[roomID].cards.splice(index, 1);
    ALLROOMSDATA[roomID].cards.push(card);
    io.to(roomID).emit("cardChangeOnTableUpdate", {
      card,
      username: username
    });
  });

  socket.on("cardChangeOnDeck", ({ username, roomID, card }) => {
    let index = ALLROOMSDATA[roomID].deck.findIndex((c) => c.id === card.id);   
    ALLROOMSDATA[roomID].deck.splice(index, 1);
    ALLROOMSDATA[roomID].deck.push(card);
    io.to(roomID).emit("cardChangeOnDeckUpdate", {
      card,
      username: username
    });
  });

  socket.on("cardChangeOnHand", ({ username, roomID, card }) => {
    let index = ALLROOMSDATA[roomID].hands[username].findIndex((c) => c.id === card.id);
    ALLROOMSDATA[roomID].hands[username].push(ALLROOMSDATA[roomID].hands[username][index]);
    ALLROOMSDATA[roomID].hands[username].splice(index, 1);
  });

  socket.on("mouseMove", ({ x, y, username, roomID }) => {
    io.to(roomID).emit("mousePositionUpdate", {
      x: x,
      y: y,
      username: username,
    });
  });
  
  socket.on("cardTableToHand", ({ username, roomID, card }) => {
    // remove cardID
    ALLROOMSDATA[roomID].hands[username].push(card);
    let index = ALLROOMSDATA[roomID].cards.findIndex((c) => c.id === card.id);
    ALLROOMSDATA[roomID].cards.splice(index, 1);
    io.to(roomID).emit("cardTableToHandUpdate", {
      card: card,
      username: username,
    });
  });

  socket.on("cardHandToTable", ({ username, roomID, card }) => {
    // add card
    ALLROOMSDATA[roomID].cards.push(card);
    // remove card from hand
    let index = ALLROOMSDATA[roomID].hands[username].findIndex((c) => c.id === card.id);
    ALLROOMSDATA[roomID].hands[username].splice(index, 1);
    io.to(roomID).emit("cardHandToTableUpdate", {
      card: card,
      username: username,
    });
  });

  socket.on("cardTableToDeck", ({ username, roomID, card }) => {
    // remove cardID
    let index = ALLROOMSDATA[roomID].cards.findIndex((c) => c.id === card.id);
    ALLROOMSDATA[roomID].cards.splice(index, 1);
    ALLROOMSDATA[roomID].deck.push(card);
    io.to(roomID).emit("cardTableToDeckUpdate", {
      card: card,
      username: username,
    });
  });

  socket.on("cardDeckToTable", ({ username, roomID, card }) => {
    // add card
    ALLROOMSDATA[roomID].cards.push(card);
    // remove card from deck
    let index = ALLROOMSDATA[roomID].deck.findIndex((c) => c.id === card.id);
    ALLROOMSDATA[roomID].deck.splice(index, 1);
    io.to(roomID).emit("cardDeckToTableUpdate", {
      card: card,
      username: username,
    });
  });

  socket.on("cardDeckToHand", ({ username, roomID, card }) => {
    // add card
    ALLROOMSDATA[roomID].hands[username].push(card);
    // remove card from deck
    let index = ALLROOMSDATA[roomID].deck.findIndex((c) => c.id === card.id);
    ALLROOMSDATA[roomID].deck.splice(index, 1);
    io.to(roomID).emit("cardDeckToHandUpdate", {
      card: card,
      username: username,
    });
  });

  socket.on("cardHandToDeck", ({ username, roomID, card }) => {
    // add card
    ALLROOMSDATA[roomID].deck.push(card);
    // remove card from deck
    let index = ALLROOMSDATA[roomID].hands[username].findIndex((c) => c.id === card.id);
    ALLROOMSDATA[roomID].hands[username].splice(index, 1);
    io.to(roomID).emit("cardHandToDeckUpdate", {
      card: card,
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
    const gameRoomData = new Room({
      id: roomID,
      password: req.body.password,
      name: req.body.name,
      image: req.body.image,
      deck: allCards,
      hands: {},
      cards: [],
    });
    const result = await gameRoomData.save();
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
