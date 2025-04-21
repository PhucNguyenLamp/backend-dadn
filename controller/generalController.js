import { insertNewRecord, fetchLatestDHT, fetchLatestLight, fetchFanID, fetchLEDid } from "../models/generalModule.js";

export const createNewRecord = async (req, res) => {
    try {
        let newDocument = req.body;

        if (!newDocument || Object.keys(newDocument).length == 0) {
            return res.status(400).send("Request cannot be empty");
        }

        let result = await insertNewRecord(newDocument);
        res.send(result).status(204);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to add record");
    }
};

export const getNormalRecord = async (req, res) => {
    let { Humidity: humidity, Temperature: temperature } =
        await fetchLatestDHT();

    let { intensity: lightsensor } =
        await fetchLatestLight();

    let { fanSpeed: fanspeed, status: fanStatus } =
        await fetchFanID();
    let { ledColor: ledcolor, status: ledStatus } =
        await fetchLEDid();

    console.log(lightsensor)

    let result = {
        temperature_humidity: {
            status: null, temperature, humidity
        },
        light: { status: null, lightsensor },
        fan_device: { status: fanStatus, fanspeed },
        light_device: { status: ledStatus, ledcolor },
    };
    res.send(result).status(200);
};