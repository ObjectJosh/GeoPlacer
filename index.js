const express = require('express');
var favicon = require('serve-favicon');
require('dotenv').config();

const app = express();
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`)
    else
      next()
  })
}
/* Sockets */
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());
var count = 0;
const server = http.createServer(app);

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

require('./server/database');
const squares = require('./server/routes/squares');
app.use('/squares', squares);

// const PATH = 'http://localhost:8080';
const PATH = 'https://geoplacer.herokuapp.com';

/* Sockets */
const io = new Server(server, {
  cors: {
    origin: PATH,
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_chat", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
    count++
    console.log("count: " + count)
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    count--;
  });
});

const PORT = process.env.PORT || 8080;

app.get('', (req, res) => {
  res.send('<h1>Our App</h1>');
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

const CHATPORT = process.env.CHATPORT || 3001;

server.listen(CHATPORT, () => {
  console.log(`Chat server running on port ${CHATPORT}`);
});
