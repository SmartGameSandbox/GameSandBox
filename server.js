require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { ObjectId } = require("bson");
const path = require("path");
const mongoose = require("mongoose");
const idGenerator = require("./utils/id_generator");
var cron = require("node-cron");

const { Room } = require("./schemas/room");
const { Card } = require("./schemas/card");
const { CardV2 } = require("./schemas/cardv2");
const { Grid } = require("./schemas/grid");
const { Game } = require("./schemas/game");
const { User } = require("./schemas/user");

const app = express();
const http = require("http").Server(app);
app.use(cors());
app.use(express.json({limit: '200kb'}));
const io = require("socket.io")(http, { cors: { origin: "*" } });

const port = process.env.PORT || 8000;


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
    if (!roomID) {
      console.error("Room Invalid");
      return;
    }
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

    // cardDeckId = null;
    if (cardDeckId === null) {
      allCards = await Card.find();
    } else {
      const deck = await Grid.find({ _id: new ObjectId(cardDeckId) });
      allCards = deck[0].deck;
    }

    // workaround (for now) for type attribute causing bugs
    allCards = allCards.map((card) => {
      return {
        imageSource: card.imageSource,
        id: card.id,
        x: card.x,
        y: card.y,
        isFlipped: card.isFlipped,
        _id: card._id,
      };
    });

    const gameRoomData = {
      id: roomID,
      name: req.body.name,
      image: req.body.image,
      deck: allCards,
      hand: {},
      cards: [],
    };

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
      games = await Game.find({ creator: new ObjectId(req.query.creatorId) });
    }
    if (!games) {
      throw new Error("No games");
    }
    res.status(200).send({ 
      message: "Games received", 
      savedGames: games 
    });

  } catch (err) {
    console.error("Failed to retreive games", err);
    res.status(500).send("Failed to retreive games.");
  }
});

app.use(bodyParser.urlencoded({ extended: false }));

//Image Upload REST APIs Deck making logics
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    const totalCards = parseInt(req.body.totalCards);
    const cardDeckName = req.file.filename;
    const imageData = fs.readFileSync(
      path.join(__dirname + "/uploads/" + req.file.filename)
    );

    const numCols = parseInt(req.body.cardsAcross);
    const numRows = parseInt(req.body.cardsDown);

    const cardArray = await sliceImages(imageData, numCols, numRows);

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

    res.status(200).send({
      message: "Deck created successfully",
      newDeck: cardDeck,
    });
  } catch (error) {
    console.error("Failed to insert grid", error);
    res.status(500).send("Failed to insert grid");
  }
});

//Image Upload REST APIs Deck making logics
app.post("/api/addDecks", async (req, res) => {
  try {
    const gameObject = req.body;
    await CardV2.create(gameObject.deck);
    const result = await Grid.create(gameObject);
    res.status(200).send({
      deckId: result._id,
    });
  } catch (error) {
    console.error("Failed to insert grid", error);
    res.status(500).send("Failed to insert grid");
  }
});

app.post("/api/saveGame", async (req, res) => {
  try {
    const {
      name,
      players,
      creatorId,
      newDeckIds,
    } = req.body;
    if (creatorId) {
      //Create a game now
      const gameObject = {
        name,
        players: parseInt(players),
        creator: new ObjectId(creatorId),
        cardDeck: newDeckIds.map((id) => new ObjectId(id)),
      };
      await Game.create(gameObject);
      res.status(200).send("Game created successfully");
    }
  } catch (error) {
    console.error("Failed to save game", error);
    res.status(500).send("Failed to save game");
  }
});

const sliceImages = async (BufferData, cols, rows) => {
  const cardArray = [];
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
    cardObjects.push(cardObject);
  }

  return cardObjects;
};

if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}

http.listen(port, async (err) => {
  if (err) return console.log(err);

  try {
    await mongoose.connect(
      "mongodb+srv://root:S4ndB0x@game-sandbox.altns89.mongodb.net/data?retryWrites=true&w=majority"
    );
  } catch (error) {
    console.log("db error");
  }
  console.log("Server running on port: ", port);
});
