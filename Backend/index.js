import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import errorHandler from "./middleware/errorHandler.js";  
connectDB();
const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL;
const PORT = process.env.PORT;
const corsOptions = {
  origin: FRONTEND_URL,
  methods: ["GET", "PUT", "POST", "DELETE"],
  withcredentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Your server is running at port ${PORT}`);
});
