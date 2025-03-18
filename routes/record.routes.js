import express from "express";
import db from "../db/database.js";

import { ObjectId } from "mongodb";
// import temperatureHumidity from "../models/DHT20SensorData.js";
// import light from "../models/LightSensorData.js";

const router = express.Router();

//-----CREATE-----//

// Create a new record
router.post("/", async (req, res) => {
    try {
        let newDocument = req.body;
        let collection = db.collection("records");

        if (!newDocument || Object.keys(newDocument).length == 0) {
            return res.status(400).send("Request cannot be empty");
        }

        let result = await collection.insertOne(newDocument);
        res.send(result).status(204);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to add record");
    }
});

//-----RETRIEVE-----//

//Get all records
router.get("/", async (req, res) => {
    let { Humidity: humidity, Temperature: temperature } = await db.collection("DHT20_Sensor_Data").findOne({});
    let { intensity: lightsensor } = await db.collection("Light_Sensor_Data").findOne({});
    let { fanSpeed: fanspeed } = await db.collection("Log").findOne({ fanSpeed: { $exists: true } });
    let { intensity: ledintensity } = await db.collection("Log").findOne({ intensity: { $exists: true } });
    let distancesensor = 0;
    let status = true;

    let result = {
        temperature_humidity: {
            status, temperature, humidity
        },
        light: { status, lightsensor },
        fan_device: { status, fanspeed },
        light_device: { status, ledintensity },
        distance: {
            status, distancesensor
        }
    };
    res.send(result).status(200);
});

// Get a single record by ID (for now)
/* Issue, cannot get ID or name at the moment
*/
router.get("/:device", async (req, res) => {
    let devicename = req.params.device;
    let status = true;
    let ledintensity = null;
    let fanspeed = null;
    let distance = null;
    let humidity = null;
    let temperature = null;
    let lightsensor = null;

    if (devicename == 'led') {
        ({ intensity: ledintensity } = await db.collection("Log").findOne({ intensity: { $exists: true } }) || {});
    } else if (devicename == 'fan') {
        ({ fanSpeed: fanspeed } = await db.collection("Log").findOne({ fanSpeed: { $exists: true } }) || {});
    } else if (devicename == 'distance') {
        distance = 0;
    } else if (devicename == 'temperature') {
        ({ Humidity: humidity, Temperature: temperature } = await db.collection("DHT20_Sensor_Data").findOne({}) || {});
    } else if (devicename == 'lightsensor') {
        ({ intensity: lightsensor } = await db.collection("Light_Sensor_Data").findOne({}) || {});
    }

    let data = { ledintensity, fanspeed, distance, humidity, temperature, lightsensor };
    let schedule = null;
    let automation = null;
    let result = { devicename, status, data, schedule, automation };
    res.send(result).status(200);
});

//-----UPDATE-----//

router.patch("/:id", async (req, res) => {
    try {
        let aidee = new ObjectId(req.params.id);
        const query = { _id: aidee };
        const updates = {
            $set: {
                name: req.body.name,
                age: req.body.age,
                gpa: req.body.gpa,
            },
        };

        let collection = await db.collection("records");
        let result = await collection.updateOne(query, updates);
        res.send(result).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to update record");
    }
});

//-----DELETE-----//

router.delete("/:id", async (req, res) => {
    try {
        let aidee = new ObjectId(req.params.id);
        const query = { _id: aidee };

        const collection = await db.collection("records");
        let result = await collection.deleteOne(query);

        res.send(result).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to delete record");
    }
});

export default router;
