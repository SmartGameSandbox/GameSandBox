# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

`npm run dev`

To deploy use the heroku cli

Database is in mongodb

1. setup guide: npm i, .env file with the jwt_token (request the jwt_secret from Alan) explain what npm run dev does Eric Hemming
2. big libraries and techs that are being used. MERN stack (Mongodb, express, react, node.js), webSocket, konva, sharp, multer, bcryptjs for hashing password, axios, dotenv, heroku for deployment Eric Dong
3. Frequently Used Terminology:
There are currently 3 types of game objects, of which all can be dragged.
    Card: A card has two sides, front and back. Each side can use a different image. Card can also be flipped and piled.
          *Not to be confused with the poorly named 'cards' zone.
    Token: Similar to card except that tokens from the same deck are all identical.
    Piece: A piece has one side and a singular image. Pieces cannot be flipped and cannot be piled.

A stack of stackable game objects is called a pile. Create piles by dragging game objects of the same kind on top of
another homogeneously-typed game object or pile. Separate the pile by right-clicking and choosing 'disassemble'. Piles
are automatically disassembled when they are moved into a deck or hand.

There are currently 3 zones that game objects can exist in while in-play. 
    Hand: Game objects that are currently in a player's hand. These objects are hidden from and inaccessible by other
          participants while they exist in this zone.
    Deck: Game objects that have either not been dealt from their original deck or have been since them moved back into. 
          Every game object should have a reference to their original deck such that they can be recalled back into it. 
          Game objects that did not start in a deck should never have access to that deck (ie: card from the 'red' deck 
          should never find its way into the 'blue' deck). A pile (ie: 'discard' pile) can however mix and match cards
          from different decks.
    Cards*: Game objects that are not in any hand or deck belongs in this zone. Poorly named due to cards being the only
            game object type back in time. A more accurate name would be "table" or "free".

A Game stores information about that game, such as the name and decks that exist within it. 
A Grid stores information about a deck of homogeneously-typed game objects (ie: deck of exclusively tokens).
A Room allows a Game to be hosted and for other players to join.
A table stores information about the room, such as the players participating and the state of the Game.
    
4. how to create games Jin
5. how to play games Jin
6. logics behind. Brief outline/diagram like logic for creating an item, room, etc Jin
7. Extra notes and recommendations:
    It is recommended that your code follows the functional paradigm.
    Game Actions such as drag, move, flip, rotate, or whatever may be implemented should exist in the gameaction.jsx module.
    Game objects such as card, token, piece, or whatever may be implemented should exist in the gameRoomComponents directory.
    Read module-specific comments for further explanation.