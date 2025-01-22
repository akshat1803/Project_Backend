import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./src/routes/auth.js";
import fileRoutes from "./src/routes/files.js";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
connectDB();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
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
