# Setup Guide

To set up and run this web application on a local machine, please follow the steps below:

Prerequisites:
    • Make sure you have Node.js installed on your system, which can be accessed from the official website here: [Node.js](https://nodejs.org/en)

1. Clone this repository to your local machine. 
`git clone https://github.com/SmartGameSandbox/GameSandBox.git`
2. Install the necessary dependencies by running `npm i` in the root directory of the project: 

   This command will download and install all the necessary dependencies listed in the package.json file.
3. As a security measure, the application requires a JSON Web Token (JWT) secret key to be stored in an environment variable.
   Create a file named `.env` in the root directory of the project and add the following line to it:
   JWT_SECRET = `secret_key`

   *Note: The actual `secret_key` must be requested from the project owner*

   Replace `secret_key` with the actual secret key. This key will be used to sign and verify the JWT tokens used for authentication.
4. Start the Development Server by running the following command: `npm run dev`

   This command will build the application and start the server. Once the server is up and running, you can access the web application by opening your browser and visiting `http://localhost:3000`
5. The project is currently hosted using Heroku and can be accessed at http://smartgamesandbox.herokuapp.com/
   Updates pushed to the main branch will automatically be deployed to the Heroku server.