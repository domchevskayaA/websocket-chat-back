require('dotenv').config();
const mongoose = require("mongoose");

const authRoute = require("./routes/auth.route");
const usersRoute = require("./routes/user.route");
const chatRoute = require("./routes/chat.route");

const express = require("express");

const cookieParser = require('cookie-parser');

const app = express();

app.use((req, res, next) => {
  res.set({
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': process.env.CLIENT_URL,
    'Access-Control-Allow-Headers': 'content-type',
  });
  next();
});

const server = app.listen(3000, () => {
  console.log('server running on port 3000');
});

const io = require('socket.io')(server);

//use config module to get the privatekey, if no private key set, end the application
if (!process.env.MY_PRIVATE_KEY) {
  console.error("FATAL ERROR: secret key is not defined.");
  process.exit(1);
}

//connect to mongodb
mongoose
  .connect(process.env.DB_URL, {useNewUrlParser: true})
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB..."));

app.use(express.json({ limit: '300kb' }));
app.use('/static', express.static('static'));
app.use(cookieParser());

app.use("/api/users", usersRoute);
app.use("/api/chat", chatRoute);
app.use("/api/auth", authRoute);

io.on('connection', socket => {
  // console.log(socket.id, 'connection')
});

io.on('connection', socket => {
  socket.on('SEND_MESSAGE',data => {
    io.emit('MESSAGE', data)
  });
});
