require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
var http = require("http").Server(app);
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { ObjectId } = require("bson");

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
const port = process.env.PORT || 8000;
const mongoose = require("mongoose");
const { roomSchema, Room } = require("./schemas/room");
const { cardSchema, Card } = require("./schemas/card");
const { cardv2Schema, CardV2 } = require("./schemas/cardv2");
const { gridSchema, Grid } = require("./schemas/grid");
const { gameSchema, Game } = require("./schemas/game");

const idGenerator = require("./utils/id_generator");
app.use(express.json());

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
var upload = multer({ storage: storage });

const ALLROOMSDATA = {};
var cron = require("node-cron");
cron.schedule(
  "00 04 * * *",
  async () => {
    // find room with id in ALLROOMSDATA index
    const rooms = await Room.find({ id: { $in: Object.keys(ALLROOMSDATA) } });
    for (const roomID in ALLROOMSDATA) {
      const found = rooms.find((room) => room.id === roomID);
      if (!found) {
        delete ALLROOMSDATA[roomID];
      }
    }
  },
  {
    scheduled: true,
    timezone: "America/Vancouver",
  }
);

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
        io.to(socket.id).emit("tableReload", {
          cards: ALLROOMSDATA[roomID].cards,
          deck: ALLROOMSDATA[roomID].deck,
          hand: ALLROOMSDATA[roomID].hand[username]
            ? ALLROOMSDATA[roomID].hand[username]
            : [],
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
        },
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
    const roomData = await Room.findOne({ id: id });
    if (roomData) {
      res.json(roomData);
    } else {
      res.status(400).json({ status: "error", message: "Invalid room ID" });
    }
  } catch (err) {
    res.status(404).json({ status: "error", message: err.message });
  }
});

//create room
app.post("/api/room", async (req, res) => {
  const ROOM_ID_LENGTH = 10;
  let roomID = 0;
  let cardDeckId = null;
  try {
    do {
      roomID = idGenerator(ROOM_ID_LENGTH);
    } while (await Room.findOne({ id: roomID }));
    if (!req.body) {
      throw new Error("Error: No room body provided");
    }
    if (req.body.cardDeck) {
      cardDeckId = req.body.cardDeck[0];
    }

    let allCards;

    if (cardDeckId === null) {
      allCards= await Card.find();
    } else {
      deck = await Grid.find({_id: new ObjectId(cardDeckId)});
      allCards = deck[0].deck;
    }

    const gameRoomData = {
      id: roomID,
      name: req.body.name,
      image: req.body.image,
      deck: allCards,
      hand: {},
      cards: allCards,
    };

    console.log(gameRoomData);
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
// const { constants } = require("buffer");
const { assert } = require("console");

// createAccount
app.post("/api/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    if (await User.findOne({ username: req.body.username })) {
      throw new Error("Username already exists");
    }
    const result = await newUser.save();
    if (!result) {
      throw new Error("Error: User failed to be created");
    }
    res.json({ status: "success", message: "User created", user: newUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Session
app.post("/api/login", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
      password: req.body.password,
    });
    if (!user) {
      throw new Error("Invalid username or password");
    }
    res.json({
      status: "success",
      message: "User login successful",
      user: user,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/api/games", async (req, res) => {
  try {
    let games = null;
    if (req.query.gameId) {
      games = await Game.findOne({ _id: new ObjectId(req.query.gameId) });
    } else {
      games = await Game.find({ creator: req.query.creatorId });
    }
    if (!games) {
      throw new Error("No games");
    }
    res
      .status(200)
      .json({ status: "success", message: "Games received", games: games });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json())

//Image Upload REST APIs
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {

    const totalCards = parseInt(req.body.totalCards);
    const cardDeckName = req.file.filename;
    const imageData = fs.readFileSync(
      path.join(__dirname + "/uploads/" + req.file.filename)
    );

    const numCols = parseInt(req.body.cardsAcross);
    const numRows = parseInt(req.body.cardsDown);

    cardArray = await sliceImages(imageData, numCols, numRows);

    assert(cardArray.length == totalCards);

    let cardDocuments = await createCardObjects(cardArray);

    const cardDeck = {
      name: cardDeckName,
      numCards: totalCards,
      imageGrid: {
        data: imageData,
        contentType: "image/png",
      },
      deck: cardDocuments,
    };

    const result = await Grid.create(cardDeck);
    res.status(200).send({
      message: "Grid inserted successfully",
      newDeckId: result._id,
      displayDeck: cardDocuments,
    });
  } catch (error) {
    console.error("Failed to insert grid", error);
    res.status(500).send("Failed to insert grid");
  }
});

app.post("/api/saveGame", async (req, res) => {
  try {
    let name = req.body.name; //Game name.
    let numPlayers = parseInt(req.body.players);
    let creatorId = req.body.creatorId; //User name for the creator of the game
    let carDeckId = req.body.newDeckId;
    if (creatorId) {
      //Create a game now
      const gameObject = {
        name: name,
        players: numPlayers,
        creator: new ObjectId(creatorId),
        cardDeck: [new ObjectId(carDeckId)],
      };
      const result = await Game.create(gameObject);
      res.status(200).send("Game created successfully");
    }
  } catch (error) {
    console.error("Failed to save game", error);
    res.status(500).send("Failed to save game");
  }
});

const sliceImages = async (BufferData, cols, rows) => {
  cardArray = [];
  const inputBuffer = Buffer.from(BufferData);
  const numCols = cols;
  const numRows = rows;

  const inputImage = sharp(inputBuffer);
  const metadata = await inputImage.metadata();

  const cardWidth = Math.floor(metadata.width / numCols);
  const cardHeight = Math.floor(metadata.height / numRows);

  // extract the cards
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const input = sharp(inputBuffer); //Need to create instance every time as extract alters the instance.
      let x = j * cardWidth;
      let y = i * cardHeight;

      let cardImage;
      if (
        x + cardWidth <= metadata.width &&
        y + cardHeight <= metadata.height
      ) {
        cardImage = await input
          .extract({ left: x, top: y, width: cardWidth, height: cardHeight })
          .toBuffer();
        cardArray.push(cardImage);
      }
    }
  }
  return cardArray;
};

const createCardObjects = async (cardArray) => {
  //Card Array consists of buffers for every card in the deck.
  const cardObjects = [];

  for (const buffer of cardArray) {
    const cardObject = {
      id: uuidv4(),
      x: 600,
      y: 200,
      imageSource: {
        data: buffer,
        contentType: "image/png",
      },
      type: "front",
      isFlipped: false,
    };
    await CardV2.create(cardObject);
    cardObjects.push(cardObject);
  }

  return cardObjects;
};

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
