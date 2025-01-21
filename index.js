const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./src/routes/auth');
const fileRoutes = require('./src/routes/files');
const dotenv = require('dotenv');
const http = require('http'); 
const socketIo = require('socket.io');
dotenv.config();

const app = express();
connectDB();

const corsOptions = {
  origin: "http://localhost:5175", 
  methods: ["GET", "POST"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5175", 
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
