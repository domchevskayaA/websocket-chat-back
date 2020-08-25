require('dotenv').config();
const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);

const errorHandlingMiddleware = require("./middleware/errorHandling");
const ServerError = require("./modules/error");

const authRoute = require("./routes/auth.route");
const usersRoute = require("./routes/users.route");
const chatsRoute = require("./routes/chats.route");

const express = require("express");

const cookieParser = require('cookie-parser');

const app = express();

const cors = require('cors')
app.use(cors({credentials: true, origin: process.env.CLIENT_URL}), (req, res, next) => {
  next();
});

//use config module to get the privatekey, if no private key set, end the application
if (!process.env.MY_PRIVATE_KEY) {
  console.error("FATAL ERROR: secret key is not defined.");
  process.exit(1);
}

//connect to mongodb
mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB..."));

app.use(express.json({ limit: '300kb' }));
app.use(cookieParser());

app.use("/api/users", usersRoute);
app.use("/api/chats", chatsRoute);
app.use("/api/auth", authRoute);

app.all('*', (req, res, next) => {
  const err = new ServerError(404, `Can't find ${req.originalUrl} on this server!`);
  next(err);
});

app.use(errorHandlingMiddleware);

const server = app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});

const io = require('socket.io')(server);

io.on('connection', socket => {
  socket.on('SEND_MESSAGE',data => {
    io.emit('MESSAGE', data)
  });
});
