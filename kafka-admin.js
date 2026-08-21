import {kafkaClient} from "./Kasfka-client.js";

async function setup(){
    const admin = kafkaClient.admin();
    await admin.connect();
    await admin.createTopics({
        topics: [
            {
                topic: "location-updates",
                numPartitions: 1,
            },
        ],
    });
    await admin.disconnect();
}
setup();