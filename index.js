const express = require('express');
var favicon = require('serve-favicon');
require('dotenv').config();

const app = express();
// if (process.env.NODE_ENV === 'production') {
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') === 'http')
    res.redirect(`https://${req.header('host')}${req.url}`)
  else
    next()
})
// }
/* Sockets */
const http = require("http");
const cors = require("cors");
// const { Server } = require("socket.io");
app.use(cors());


app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

require('./server/database');
const squares = require('./server/routes/squares');
app.use('/squares', squares);
const users = require('./server/routes/users');
app.use('/users', users);

const PORT = process.env.PORT || 8080;

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

const server = app.listen(PORT, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log(`Server is listening at http://localhost:${PORT}`);
    }
});
var count = 0;
const io = require("socket.io")(server);

// const PATH = 'http://localhost:8080';
// const PATH = 'https://geoplacer.herokuapp.com';

/* Sockets */
// const io = new Server(server, {
//   cors: {
//     origin: PATH,
//     methods: ["GET", "POST"],
//   },
// });



// app.get('', (req, res) => {
//   res.send('<h1>Our App</h1>');
// });

// app.listen(PORT, () => {
//   console.log(`App running on port ${PORT}`);
// });

// const CHATPORT = process.env.PORT || 3000;

// const INDEX = '/index.html';

// const server2 = express()
//   .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
//   .listen(CHATPORT, () => console.log(`Listening on ${CHATPORT}`));

// const { Server } = require('ws');
// const wss = new Server({ server });


io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    socket.on("join_chat", (data) => {
        if (count < 0) {
            count = 0;
        }
      socket.join(data);
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
      count++
      console.log("count: " + count);
      socket.emit('count', count);
    });
  
    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
    });
  
    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
      count--;
      if (count < 0) {
          count = 0;
      }
      socket.emit('count', count);
    });
  });

// setInterval(() => {
// wss.clients.forEach((client) => {
//     client.send(new Date().toTimeString());
// });
// }, 1000);
function tick() {
    let dt = new Date();
    /*
    dt = dateTimeApi.dateAdd(dt, "month", -4);
    dt = dateTimeApi.dateAdd(dt, "day", -9);
    dt = dateTimeApi.dateAdd(dt, "hour", -6);
    dt = dateTimeApi.dateAdd(dt, "minute", 12);*/
    dt = dt.toLocaleString();
    io.sockets.emit("realtime", dt);
  }
  setInterval(tick, 1000);