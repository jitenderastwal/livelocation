import express from "express";
import  http  from "http";
import { Server } from "socket.io";
import path from "path";

import { kafkaClient } from "./Kasfka-client.js";

async function main(){
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static(path.resolve("public")));

const kafkaproducer= kafkaClient.producer();
await kafkaproducer.connect();

const kafkaconsumer=kafkaClient.consumer({ groupId: "location-group" });
await kafkaconsumer.connect();

await kafkaconsumer.subscribe({ topic: "location-updates", fromBeginning: true }); 

kafkaconsumer.run({
  eachMessage: async ({ topic, partition, message,heartbeat }) => {
    const locationData = JSON.parse(message.value.toString());
    await heartbeat();
    io.emit("locationUpdate", locationData);
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("locationUpdate", (data) => {
    console.log("Received location update:", data);
    const { latitude, longitude } = data;

    kafkaproducer.send({
      topic: "location-updates",
      messages: [
        {
          key: socket.id,
          value: JSON.stringify({ latitude, longitude }),
        },
      ],
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
}
main();



