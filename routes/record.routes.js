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
    let { Humidity: humidity, Temperature: temperature } =
        await db.collection("DHT20_Sensor_Data").findOne({}, {
            sort: { timestamp: -1 },
            projection: { Humidity: 1, Temperature: 1 }
        });

    let { intensity: lightsensor } =
        await db.collection("Light_Sensor_Data").findOne({}, {
            sort: { timestamp: -1 },
            projection: { intensity: 1 }
        });

    let { fanSpeed: fanspeed } =
        await db.collection("Log").findOne({ fanSpeed: { $exists: true } }, {
            sort: { timestamp: -1 },
            projection: { fanSpeed: 1 }
        });

    let { LEDStatus: ledstatus, LEDColor: ledcolor } =
        await db.collection("Log").findOne({ LEDColor: { $exists: true } }, {
            sort: { timestamp: -1 },
            projection: { LEDStatus: 1, LEDColor: 1 }
        });
    
    let distancesensor = 0;
    let status = await db.collection("Device").find({}, {
        projection: { deviceId: 1, status: 1 }
    }).toArray();
    const fan_status = status.find((device) => device._id === "FAN_1").status;
    const light_status = status.find((device) => device._id === "LED_1").status;

    let result = {
        temperature_humidity: {
            status: null, temperature, humidity
        },
        light: { status: null, lightsensor },
        fan_device: { status: fan_status, fanspeed },
        light_device: { status: light_status, ledcolor },
        distance: {
            status: null, distancesensor
        }
    };
    res.send(result).status(200);
});

//logs
router.get("/logs", async (req, res) => {
    let logs = await db.collection("Log").find({}).toArray();
    res.send(logs).status(200);
});

router.get('/statistics', async (req, res) => {
    let temperature_himidity_list = await db.collection("DHT20_Sensor_Data").find({}).toArray();
    let light_list = await db.collection("Light_Sensor_Data").find({}).toArray();
    let distance_list = [];

    let temperature_value_time = {
        temperature: temperature_himidity_list.map((data) =>  data.Temperature),
        time: temperature_himidity_list.map((data) =>  data.timestamp )
    }
    let humidity_value_time = {
        humidity: temperature_himidity_list.map((data) =>  data.Humidity),
        time: temperature_himidity_list.map((data) =>  data.timestamp )
    }
    let light_value_time = {
        light: light_list.map((data) =>  data.intensity),
        time: light_list.map((data) =>  data.timestamp )
    }
    let distance_value_time = {};

    let result = {
        temperature_value_time,
        humidity_value_time,
        light_value_time,
        distance_value_time,
    }
    res.send(result).status(200);
}
);

// Get a single record by ID (for now)
/* Issue, cannot get ID or name at the moment
*/
router.get("/:device", async (req, res) => {
    let devicename = req.params.device;
    let ledcolor = null;
    let fanspeed = null;
    let distance = null;
    let humidity = null;
    let temperature = null;
    let lightsensor = null;
    let status = null;
    let deviceid = devicename === 'light_device' ? 'LED_1' : devicename === 'fan_device' ? 'FAN_1' : null;
    if (deviceid) {
        status = await db.collection("Device").find({ _id: deviceid }, {
            projection: { deviceId: 1, status: 1 }
        }).toArray();
    }

    try {
        if (devicename === 'light_device') {
            ({ LEDColor: ledcolor } = await db.collection("Log").findOne(
                { LEDColor: { $exists: true } },
                { sort: { timestamp: -1 }, projection: { LEDColor: 1 } }
            ) || {});
        } else if (devicename === 'fan_device') {
            ({ fanSpeed: fanspeed } = await db.collection("Log").findOne(
                { fanSpeed: { $exists: true } },
                { sort: { timestamp: -1 }, projection: { fanSpeed: 1 } }
            ) || {});
        } else if (devicename === 'distance') {
            distance = 0;
        } else if (devicename === 'temperature_humidity') {
            ({ Humidity: humidity, Temperature: temperature } = await db.collection("DHT20_Sensor_Data").findOne(
                {},
                { sort: { timestamp: -1 }, projection: { Humidity: 1, Temperature: 1 } }
            ) || {});
        } else if (devicename === 'light') {
            ({ intensity: lightsensor } = await db.collection("Light_Sensor_Data").findOne(
                {},
                { sort: { timestamp: -1 }, projection: { intensity: 1 } }
            ) || {});
        }

        let data = { ledcolor, fanspeed, distance, humidity, temperature, lightsensor };
        let schedule = null;
        let automation = null;
        let result = { devicename, status, data, schedule, automation };

        res.status(200).send(result);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
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
