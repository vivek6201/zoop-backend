import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import SocketService from "./services/SocketService";
import router from "./routes";

configDotenv();
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is up at port " + port,
  });
});

const httpServer = app.listen(port, () => {
  console.log("server is up at: " + port);
});

// adding socket service
export const socketCLient = SocketService.getInstance(httpServer);
