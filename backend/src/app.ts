import express from "express";
import authRoutes from "./Modules/auth/routes/auth.routes.js";
import filesRoutes from "./Modules/auth/routes/files.routes.js"
const cors = require('cors'); // Import cors

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      // "https://distributed-file-syste.vercel.app/",
      "https://filesystem.utkarshshukla.dev"   ,
     ],
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/files", filesRoutes);
app.get("/", (req, res) => {
  res.json({ message: "Distributed systems api working properly" });
});


export default app;