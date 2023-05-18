require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { ObjectId } = require("bson");

const path = require("path");
const mongoose = require("mongoose");
const idGenerator = require("./utils/id_generator");
const cron = require("node-cron");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { Room } = require("./schemas/room");
// const { CardV2 } = require("./schemas/cardv2");
const { Grid } = require("./schemas/grid");
const { Game } = require("./schemas/game");
const { User } = require("./schemas/user");

const app = express();
const http = require("http").Server(app);
app.use(cors());
app.use(express.json({limit: '500kb'}));
app.use(express.urlencoded({ extended: false }));

const io = require("socket.io")(http, { cors: { origin: "*" } });

const port = process.env.PORT || 8000;


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + uuidv4())
  },
});
const upload = multer({ storage: storage });

const ALLROOMSDATA = {};
cron.schedule(
  "00 04 * * *",
  async () => {
    // find room with id in ALLROOMSDATA index
    const rooms = await Room.find({
      id: {
        $in: Object.keys(ALLROOMSDATA)
      }
    });
    for (const roomID in ALLROOMSDATA) {
      const found = rooms.find((room) => room.id === roomID);
      if (!found) {
        delete ALLROOMSDATA[roomID];
      }
    }
  }, {
    scheduled: true,
    timezone: "America/Vancouver",
  }
);

// Web sockets
io.on("connection", async (socket) => {
  // Join room
  socket.on("joinRoom", async ({ roomID, username }) => {
    if (!roomID) {
      console.error("Room Invalid");
      return;
    }
    ALLROOMSDATA[roomID] ??= await Room.findOne({ id: roomID });
    if (!ALLROOMSDATA[roomID]) {
      console.error(`Can not find room: ${roomID}`);
      return;
    }
    socket.join(roomID);
    ALLROOMSDATA[roomID].hand ??= {};
    ALLROOMSDATA[roomID].hand[username] ??= [];

    io.to(socket.id).emit("tableReload", {
      cards: ALLROOMSDATA[roomID].cards,
      deck: ALLROOMSDATA[roomID].deck,
      tokens: ALLROOMSDATA[roomID].tokens,
      pieces: ALLROOMSDATA[roomID].pieces,
      hand: ALLROOMSDATA[roomID].hand[username],
    });
    // add user to the user array here
    console.log(`User ${username} joined room ${roomID}`);
  });

  socket.on("tableChange", ({
    username,
    roomID,
    tableData
  }) => {
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

  socket.on("mouseMove", ({
    x,
    y,
    username,
    roomID
  }) => {
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
    res.json({
      status: "error",
      message: err
    });
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
    if (!roomData) {
      res.status(400).json({ status: "error", message: "Invalid room ID" });
      return;
    }
    res.json(roomData);
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err.message
    });
  }
});

//create room
app.post("/api/room", async (req, res) => {
  const ROOM_ID_LENGTH = 10;
  const filterMapItem = (items, itemType) => {
    return items.reduce((acc, item) => {
      if (item.type === itemType) {
        if (itemType !== "Card") {
          acc.push({totalNum: item.numCards, deck: item.deck});
        } else {
          acc.push(item.deck);
        }
      }
      return acc;
    }, []);
  }
  try {
    const deckIds = req.body?.cardDeck;
    if (!deckIds || deckIds.length < 1) {
      throw new Error("Error: room body missing/corrupted.");
    }
    let roomID = idGenerator(ROOM_ID_LENGTH);
    while (await Room.findOne({ id: roomID })) {
      roomID = idGenerator(ROOM_ID_LENGTH);
    }
    
    const gameItemData = await Grid.find({ _id: { $in: deckIds } });
    const gameRoomData = {
      id: roomID,
      name: req.body.name,
      deck: filterMapItem(gameItemData, "Card"),
      tokens: filterMapItem(gameItemData, "Token"),
      pieces: filterMapItem(gameItemData, "Piece"),
      hand: {},
      cards: [],
    };

    const result = await Room.create(gameRoomData);
    if (!result) {
      throw new Error("Error: Room not created");
    }
    ALLROOMSDATA[roomID] = gameRoomData;
    res.json(result);
  } catch (err) {
    res.json({
      status: "error",
      message: err
    });
    console.log(err);
  }
});

// Register
// createAccount
app.post("/api/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  console.log(newUser);
  try {
    if (await User.findOne({
        username: req.body.username
      })) {
      throw new Error("Username already exists");
    }
    const result = await newUser.save();
    if (!result) {
      throw new Error("Error: User failed to be created");
    }
    res.json({
      status: "success",
      message: "User created",
      user: newUser
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
});

// Session
app.post("/api/login", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });
    if (!user) {
      throw new Error("Invalid username or password");
    }

    const passwordMatch = await bcryptjs.compare(req.body.password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      status: "success",
      message: "User login successful",
      user: user,
      token: token,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
});

app.get("/api/games", async (req, res) => {
  try {
    let games = null;
    if (req.query.gameId) {
      games = await Game.findOne({
        _id: new ObjectId(req.query.gameId)
      });
    } else {
      games = await Game.find({
        creator: new ObjectId(req.query.creatorId)
      });
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

//Image Upload REST APIs Deck making logics
app.post("/api/upload",
          upload.fields([{
            name: "image", maxCount: 1}, {
            name: "backFile", maxCount: 1}]), async (req, res) => {
  try {
    const { image, backFile } = req.files;
    const [{ filename: facefile, mimetype: faceType }] = image;
    const {
      isLandscape,
      isSameBack,
      itemType,
      numAcross,
      numDown,
      numTotal
    } = req.body;
    const imageData = fs.readFileSync(
      path.join(__dirname + "/uploads/" + facefile)
    );
    const cardArray = await sliceImages(itemType, imageData, numAcross, numDown, numTotal);
    let backArray = null;
    const backType = backFile?.[0].mimetype || "";

    if (backFile?.[0].filename) {
      const backImageData = fs.readFileSync(
        path.join(__dirname + "/uploads/" + backFile[0].filename)
      );
      backArray = await sliceImages(itemType, backImageData, numAcross, numDown, numTotal, false, isSameBack);
    }
    const cardDocuments = await createCardObjects(
                            cardArray, backArray, faceType, backType, isLandscape, itemType);

      const cardDeck = {
        name: facefile,
        numCards: parseInt(numTotal),
        imageGrid: {
          data: imageData,
          contentType: faceType,
        },
        deck: cardDocuments,
        type: itemType,
      };

    res.status(200).send({
      message: "Deck created successfully",
      newItem: cardDeck,
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
    // await CardV2.create(gameObject.deck);
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

const sliceImages = async (itemType, ImageData, cols, rows, total, isFace = true, isSameBack = false) => {
  const inputBuffer = Buffer.from(ImageData);
  const imageInput = sharp(inputBuffer);
  const numCols = parseInt(cols);
  const numRows = parseInt(rows);
  const numTotal = parseInt(total);
  const { width: imgWidth, height: imgHeight } = await imageInput.metadata();
  const resize = {};
  const extend = itemType === "Card" ? 2 : {};
  
  if (!isFace && isSameBack) {
    if (imgWidth > imgHeight) {
      resize.width = 91;
    } else {
      resize.height = 91;
    }
    const formattedImageBuffer = await imageInput.resize(resize).extend(extend).toBuffer()
    return Array(Math.min(numTotal, cols*rows)).fill(formattedImageBuffer);
  }
  const cardArray = [];

  const cardWidth = Math.floor(imgWidth / numCols);
  const cardHeight = Math.floor(imgHeight / numRows);
  if (itemType !== "Piece") {
    if (cardWidth > cardHeight) {
      resize.width = 91;
    } else {
      resize.height = 91;
    }
  }

  // extract the cards
  for (let i = 0; i < numRows; i++) {
    const y = i * cardHeight;
    for (let j = 0; j < numCols; j++) {
      const input = sharp(inputBuffer);
      const x = j * cardWidth;

      if (
        x + cardWidth <= imgWidth &&
        y + cardHeight <= imgHeight
      ) {
        await input
          .extract({
            left: x,
            top: y,
            width: cardWidth,
            height: cardHeight
          })
          .resize(resize)
          .extend(extend)
          .toBuffer()
          .then((res) => {
            cardArray.push(res);
          });
      }
    }
  }
  return cardArray.slice(0, numTotal);
};

const createCardObjects = async (
  cardArray, backArray, faceType, backType, isLandscape, itemType) => {
  //Card Array consists of buffers for every card in the deck.
  backArray ??= Array(cardArray.length).fill(null);

  return cardArray.map((buffer, index) => ({
      id: uuidv4(),
      x: null,
      y: null,
      imageSource: {
        front: {
          data: buffer,
          contentType: faceType,
        },
        back: {
          data: backArray[index],
          contentType: backType,
        }

      },
      pile: [],
      type: itemType,
      isFlipped: false,
      isLandscape: !!isLandscape,
    }));
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