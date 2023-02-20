import twilio from "twilio";
import express from "express";
import { config } from "dotenv";

const PORT = process.env.PORT || 3000;

config();

const app = express();
app.listen(PORT);
app.use(express.json());

const {
  jwt: { AccessToken },
} = twilio;

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKey = process.env.TWILIO_API_KEY;
const twilioApiSecret = process.env.TWILIO_API_SECRET;

app.get("/", (req, res) => {
  const { roomName, identity } = req.body;

  if (roomName && identity) {
    const token = new AccessToken(
      twilioAccountSid,
      twilioApiKey,
      twilioApiSecret,
      { identity: identity }
    );

    const videoGrant = new AccessToken.VideoGrant({
      room: roomName,
    });

    token.addGrant(videoGrant);

    const responseToken = token.toJwt();

    return res.json({ message: "OK", token: responseToken });
  }

  res.json({ message: "ERROR" });
});

app.get("/credentials", (req, res) => {
  const client = twilio(twilioAccountSid, twilioApiKey);

  client.tokens.create().then((token) => res.send({ token }));
});
