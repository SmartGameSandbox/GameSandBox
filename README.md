# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

`npm run dev`

To deploy use the heroku cli

Database is in mongodb


## Setup Guide

To set up and run this web application on a local machine, please follow the steps below:
    
Prerequisites:
    • Make sure you have Node.js installed on your system, which can be accessed from the official website here: [Node.js](https://nodejs.org/en)


1. Clone this repository to your local machine.


2. Install the necessary dependencies by running the following command in the root directory of the project:
    > npm install
    or 
    > npm i 

    This command will download and install all the necessary dependencies listed in the package.json file.


3. As a security measure, the application requires a JSON Web Token (JWT) secret key to be stored in an environment variable. 
    Create a file named .env in the root directory of the project and add the following line to it:
    JWT_SECRET = `secret_key`

    *Note: The actual secret key must be requested from the project owner*

    Replace `secret_key` with the actual secret key. This key will be used to sign and verify the JWT tokens used for authentication.


4. Start the Development Server by running the following command:
    > npm run dev

    This command will build the application and start the server. Once the server is up and running, you can access the web application by opening your browser and visiting http://localhost:3000

5. The project is currently hosted using Heroku and can be accessed at http://smartgamesandbox.herokuapp.com/
    Updates pused to the main branch will automatically be deployed to the Heroku server.

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

## Technologies and libraries used
1. MERN Stack: This game is built with React.js on the front end, Express.js and Node.js on the back end, with MongDB being used as our database option.
2. [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket): We use Websocket for sending and receiving data between the client side and server side.
3. [Konva](https://konvajs.org/docs/): A Canvas JavaScript framework that allows animations, transitions, layering and event handling etc. We use react-konva to handle the layering and the interactions among various game components.
4. [multer](https://www.npmjs.com/package/multer): A node.js module which is primarily used for uploading images and files. It enables users to upload their own images and create customized games.
5. [sharp](https://www.npmjs.com/package/sharp): Another node.js module that allows users to convert large images in common formats to smaller images of different dimensions.
6. [Axios](https://www.npmjs.com/package/axios): Axios is used for sending  GET and POST requests and receiving response between client and server side.
7. [bcryptjs](https://www.npmjs.com/package/bcryptjs): A JavaScript library for password salting and hashing. It generates a 'salt' (a piece of randomly generated data) and combines it with the original password to perform password hashing for additional security.
8. [Dotenv](https://www.npmjs.com/package/dotenv): A node.js module that loads environment variables from a ".env" file into "process.env".
9. [Heroku](https://www.heroku.com/): A cloud application platform for the deployment of our application.