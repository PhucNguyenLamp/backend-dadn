import db from "../db/database.js"

export const fetchLogs = async () => await db.collection("Log").find({}).toArray();
export const fetchDHTData = async(filter = {}) => await db.collection("DHT20_Sensor_Data").find(filter).toArray();
export const fetchLightData = async(filter = {}) => await db.collection("Light_Sensor_Data").find(filter).toArray();
