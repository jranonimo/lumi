const express = require("express");
const cors = require("cors");
const lumiRoutes = require("./lumi.routes");

const app = express();

// Configurar o middleware CORS
app.use(
  cors({
    origin: "https://lumi-ashy.vercel.app",
  })
);

app.use(express.json());

const port = process.env.PORT ?? 4000;

app.use(lumiRoutes);

app.listen(port, () => console.log("Server is running on port ", port));
