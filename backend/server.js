// server.js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json()); // para leer datos enviados en JSON

app.get("/", (req, res) => {
  res.send("Servidor funcionando 🌙");
});

app.listen(3000, () => console.log("Servidor en puerto 3000"));
