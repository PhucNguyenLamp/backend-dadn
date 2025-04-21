import { fetchDeviceByID, fetchLatestDHT, fetchLatestLight, updateDeviceAutomation, updateDeviceStatus } from "../models/deviceModel.js";

export const getDeviceData = async (req, res) => {
    try {
        const { device } = req.params;
        const deviceId = device === "light_device" ? "LED_1" : device === "fan_device" ? "FAN_1" : null;

        let ledcolor = null;
        let fanspeed = null;
        let distance = null;
        let humidity = null;
        let temperature = null;
        let lightsensor = null;
        let status = null;
        let schedule = null;
        let automation = null;

        if (deviceId) {
            const deviceData = await fetchDeviceByID(deviceId, { status: 1 });
            status = deviceData?.status;
        }
        if (device === 'light_device') {
            ({ ledColor: ledcolor, schedule, automation } = await fetchDeviceByID("LED_1", { ledColor: 1, schedule: 1, automation: 1 }) || {});
        } else if (device === 'fan_device') {   
            ({ fanSpeed: fanspeed, schedule, automation } = await fetchDeviceByID("FAN_1", { fanSpeed: 1, schedule: 1, automation: 1 }) || {});
        } else if (device === 'temperature_humidity') {
            ({ Humidity: humidity, Temperature: temperature } = await fetchLatestDHT() || {});
        } else if (device === 'light') {
            ({ intensity: lightsensor } = await fetchLatestLight() || {});
        }
        const data = { ledcolor, fanspeed, distance, humidity, temperature, lightsensor };
        const result = { devicename: device, status, data, schedule, automation };
        res.status(200).send(result);
    } catch (err) {
        console.error("Error fetching device data:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
};

export const setDeviceAutomation = async (req, res) => {
    try {
        const { _id: deviceId, automation } = req.body;

        if (!deviceId || Object.keys(deviceId).length === 0) {
            return res.status(400).send("Name cannot be empty!");
        }
        if (!automation || Object.keys(automation).length === 0) {
            return res.status(400).send("Status cannot be empty!");
        }

        const result = await updateDeviceAutomation(deviceId, automation);
        res.status(204).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to add automation");
    }
};

export const setDeviceStatus = async (req, res) => {
    try {
        let device_name = req.body._id;
        let device_status = req.body.status;
        let data = req.body.data;
        console.log(device_name, device_status, data)
        if (data == null || data == undefined) {
            data = 0;
        }
        if (!device_name || Object.keys(device_name).length == 0) {
            return res.status(400).send("Name cannot be empty!");
        }

        if (!device_status || Object.keys(device_status).length == 0) {
            return res.status(400).send("Status cannot be empty!");
        }

        let updateFields = { status: device_status, shouldUpdate: true };
        if (data != null) {
            Object.assign(updateFields, device_name === "LED_1" ? { ledColor: data } : { fanSpeed: data });
        }
        console.log(updateFields)
        let result = await updateDeviceStatus(device_name, updateFields);
        res.status(204).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to add record");
    }
};