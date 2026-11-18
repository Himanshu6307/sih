import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/configurations/db.js";
import adminRoutes from "./src/routes/admin.route.js";
import userRoutes from "./src/routes/user.route.js";

dotenv.config();

connectDB();

// OkQlZJ3o44EvceKj

// physicslegend27_db_user

// mongodb+srv://physicslegend27_db_user:OkQlZJ3o44EvceKj@cluster0.ovrcxmx.mongodb.net/

const app = express();
app.use(cookieParser());

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/user", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running ✅");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
