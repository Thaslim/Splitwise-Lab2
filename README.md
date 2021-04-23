# Splitwise-lab2
React application with Express server and MongoDB database, Kafka, passportjwt authentication and react-redux store 
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). 
Then an Express server was added in the backend directory. The server is proxied via the proxy key in package.json. The backend server makes teh request to kafka and the kafka backend server handles the requests

Using this project
Clone the project, cd into the directory and install the dependencies

```
git clone https://github.com/Thaslim/Splitwise-Lab2.git
cd frontend
npm install
cd backend
npm install
cd kafka-backend
npm install
```

## Setup .env file
Create a .env file in your backend config folder which will hold database config and passwords 
First start the zookeper and kafka server using the following commands. Download Kafka, unzip and cd into the folder.
```bin/kafka-server-start.sh config/server.properties```
```bin/zookeeper-server-start.sh config/zookeeper.properties```

You can start the client and server on its own with the command:
```npm start```
start the Kafka-backend server using 
```node index.js```

The application runs on ```http://localhost:3000/```
