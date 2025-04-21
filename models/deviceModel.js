import db from "../db/database.js"

export const fetchDeviceByID = async (id, projection = {}) => {
    return await db.collection("Device").findOne({ _id: id }, { projection });
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

export const updateDeviceAutomation = async (deviceId, automation) => {
    return await db.collection("Device").updateOne(
        { _id: deviceId },
        { $set: { automation } },
        { upsert: true }
    );
};

export const updateDeviceStatus = async (device_name, updateFields) => {
    return await db.collection("Device").updateOne(
        { _id: device_name },
        { $set: updateFields },
        { upsert: true }
    );
}