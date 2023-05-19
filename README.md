# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

`npm run dev`

To deploy use the heroku cli

Database is in mongodb

1. setup guide: npm i, .env file with the jwt_token (request the jwt_secret from Alan) explain what npm run dev does Eric Hemming
2. big libraries and techs that are being used. MERN stack (Mongodb, express, react, node.js), webSocket, konva, sharp, multer, bcryptjs for hashing password, axios, dotenv, heroku for deployment Eric Dong
3. Frequently used confusing terminologies: Deck, Pile, Tokens, Pieces, Game, Grid, Room, Table (Cards refer to cards in table), Hand Brian
4. how to create games Jin
5. how to play games Jin
6. logics behind. Brief outline/diagram like logic for creating an item, room, etc Jin
7. code style (directory directions) (how actions should go to action, deck specific to deck) Brian

## Technologies and libraries used
1. MERN Stack: This game is built with React.js on the front end, Express.js and Node.js on the back end, with MongDB being used as our database option.
2. [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket): We use Websocket for sending and receiving data between the client side and server side.
3. [Konva](https://konvajs.org/docs/): A Canvas JavaScript framework that allows animations, transitions, layering and event handling etc. We use react-konva to handle the layering and the interactions among various game components.
4. [multer](https://www.npmjs.com/package/multer): A node.js module which is primarily used for uploading images/files. It enables users to upload their own images and create customized games.
5. [sharp](https://www.npmjs.com/package/sharp): Another node.js module that allows users to convert large images in common formats to smaller images of different dimensions.
6. [Axios](https://www.npmjs.com/package/axios): Axios is used for sending  GET and POST requests and receiving response between client and server side.
7. [bcryptjs](https://www.npmjs.com/package/bcryptjs): A JavaScript library that generates a 'salt' (a piece of randomly generated data) and combine it with the original password to perform hashing for additional security.
8. [Dotenv](https://www.npmjs.com/package/dotenv): A node.js module that loads environment variables from a ".env" file into "process.env".
9. [Heroku](https://www.heroku.com/):A cloud application platform for the deployment of our application