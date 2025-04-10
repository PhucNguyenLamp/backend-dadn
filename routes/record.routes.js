import express from "express";
import db from "../db/database.js";

import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
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

    let { fanSpeed: fanspeed, status: fanStatus } =
        await db.collection("Device").findOne({ _id: "FAN_1" }, {
            projection: { fanSpeed: 1, status: 1 }
        });
    let { ledColor: ledcolor, status: ledStatus } =
        await db.collection("Device").findOne({ _id: "LED_1" }, {
            projection: { ledColor: 1, status: 1 }
        });

    let distancesensor = 0;

    let result = {
        temperature_humidity: {
            status: null, temperature, humidity
        },
        light: { status: null, lightsensor },
        fan_device: { status: fanStatus, fanspeed },
        light_device: { status: ledStatus, ledcolor },
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
        temperature: temperature_himidity_list.map((data) => data.Temperature),
        time: temperature_himidity_list.map((data) => data.timestamp)
    }
    let humidity_value_time = {
        humidity: temperature_himidity_list.map((data) => data.Humidity),
        time: temperature_himidity_list.map((data) => data.timestamp)
    }
    let light_value_time = {
        light: light_list.map((data) => data.intensity),
        time: light_list.map((data) => data.timestamp)
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




// TODO: UPDATE 

router.post("/login", async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log(req.body)
    try {
        let user = await db.collection("User").findOne({ username }, {
            projection: { username: 1, password: 1 }
        });

        if (user && user.password === password) {
            const token = jwt.sign({ username: user.username }, "secret_key", { expiresIn: "1h" });
            return res.status(200).send({ message: "Login successful", token, username });
        }
        res.status(401).send("Login failed");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/device_status", async (req, res) => {
    try {
        let device_name = req.body._id;
        let device_status = req.body.status;
        let data = req.body.data;
        
        if (!device_name || Object.keys(device_name).length == 0) {
            return res.status(400).send("Name cannot be empty!");
        }

        if (!device_status || Object.keys(device_status).length == 0) {
            return res.status(400).send("Status cannot be empty!");
        }

        console.log(device_name, device_status, data)

        let updateFields = { status: device_status, shouldUpdate: true };
        if (data != null) {
            Object.assign(updateFields, device_name === "LED_1" ? { ledColor: data } : { fanSpeed: data });
        }

        let result = await db.collection("Device").updateOne(
            { _id: device_name },
            { $set: updateFields },
            { upsert: true }
        );
        res.status(204).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to add record");
    }
});

router.post("/schedule", async (req, res) => {
    try {
        let device_name = req.body._id;
        let schedule = req.body.schedule;
        console.log(req.body)
        if (!device_name) {
            return res.status(400).send("Name cannot be empty!");
        }

        if (!schedule) {
            return res.status(400).send("schedule cannot be empty!");
        }

        let result = await db.collection("Device").updateOne(
            { _id: device_name },
            { $set: { schedule } },
            { upsert: true }
        );
        res.status(204).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to add record");
    }
});

router.post("/automation", async (req, res) => {
    try {
        let device_name = req.body._id;
        let automation = req.body.automation;

        if (!device_name || Object.keys(device_name).length == 0) {
            return res.status(400).send("Name cannot be empty!");
        }

        if (!automation || Object.keys(automation).length == 0) {
            return res.status(400).send("Status cannot be empty!");
        }
        let result = await db.collection("Device").updateOne(
            { _id: device_name },
            { $set: { automation } },
            { upsert: true }
        );
        res.status(204).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to add record");
    }
});

// router.get("/schedule", async (req, res) => {
//     try {
//         let device_name = req.query._id;
//         let result = await db.collection('Device').findOne({_id: device_name})
//         res.status(200).send(result);
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         res.status(500).send({ error: "Internal Server Error" });
//     }
// });

// router.get("/automation", async (req, res) => {
//     try {
//         let device_name = req.params.device;
//         let condition = req.params.cond;
//         let do_something = req.params.do;

//         if (!device_name || Object.keys(device_name).length == 0) {
//             return res.status(400).send("Name cannot be empty!");
//         }

//         if (!condition || Object.keys(condition).length == 0) {
//             return res.status(400).send("Status cannot be empty!");
//         }

//         if (!do_something || Object.keys(do_something).length == 0) {
//             return res.status(400).send("Status cannot be empty!");
//         }

//         let result = await collection.findOne(device_name, schedule)
//         res.status(204).send(result);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Failed to add record");
//     }
// });

router.get("/:device", async (req, res) => {
    let devicename = req.params.device;
    let ledcolor = null;
    let fanspeed = null;
    let distance = null;
    let humidity = null;
    let temperature = null;
    let lightsensor = null;
    let status = null;
    let schedule = null;
    let deviceid = devicename === 'light_device' ? 'LED_1' : devicename === 'fan_device' ? 'FAN_1' : null;
    if (deviceid) {
        ({ status } = await db.collection("Device").findOne({ _id: deviceid }, {
            projection: { status: 1 }
        }));
    }

    try {
        if (devicename === 'light_device') {
            ({ ledColor: ledcolor, schedule } = await db.collection("Device").findOne(
                { _id: "LED_1" },
                { projection: { ledColor: 1, schedule: 1 } }
            ) || {});
        } else if (devicename === 'fan_device') {
            ({ fanSpeed: fanspeed, schedule } = await db.collection("Device").findOne(
                { _id: "FAN_1" },
                { projection: { fanSpeed: 1, schedule: 1 } }
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
        let automation = null;
        let result = { devicename, status, data, schedule, automation };

        res.status(200).send(result);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});



export default router;
