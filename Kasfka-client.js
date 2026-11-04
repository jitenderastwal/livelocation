import {Kafka} from "kafkajs";  

export const kafkaClient = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

export async function createTopic(topicName) {
  const admin = kafkaClient.admin();
  await admin.connect();
  await admin.createTopics({
    topics: [{ topic: topicName }],
  });
  await admin.disconnect();
}