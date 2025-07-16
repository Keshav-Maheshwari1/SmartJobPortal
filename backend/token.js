import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AccessToken } from "livekit-server-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;
const livekitHost = process.env.LIVEKIT_URL;

app.post("/room/get-token", async (req, res) => {
  const { roomName, userName } = req.body;

  const token = new AccessToken(apiKey, apiSecret, {
    identity: userName,
  });

  token.addGrant({ roomJoin: true, room: roomName });
  res.send({ token: await token.toJwt(), url: livekitHost });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {});
