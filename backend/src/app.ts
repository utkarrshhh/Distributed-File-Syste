import express from "express";
import authRoutes from "./Modules/auth/routes/auth.routes.ts";
import filesRoutes from "./Modules/auth/routes/files.routes.ts"
const cors = require('cors'); // Import cors

const app = express();


app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/files", filesRoutes);
app.get("/", (req, res) => {
  res.json({ message: "Distributed systems api working properly" });
});


export default app;