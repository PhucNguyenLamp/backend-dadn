import db from "../db/database.js"

export const insertNewRecord = async (newDocument) => {
    return await db.collection("records").insertOne(newDocument);
};

export const fetchLatestDHT = async () => {
    return await db.collection("DHT20_Sensor_Data").findOne({}, {
        sort: { timestamp: -1 },
        projection: { Humidity: 1, Temperature: 1 }
    });
};

export const fetchLatestLight = async () => {
    return await db.collection("Light_Sensor_Data").findOne({}, {
        sort: { timestamp: -1 },
        projection: { intensity: 1 }
    });
};

export const fetchFanID = async () => {
    return await db.collection("Device").findOne({ _id: "FAN_1" }, {
        projection: { fanSpeed: 1, status: 1 }
    });
};

export const fetchLEDid = async() => {
    return await db.collection("Device").findOne({ _id: "LED_1" }, {
        projection: { ledColor: 1, status: 1 }
    });
};