import { fetchLogs, fetchDHTData, fetchLightData } from "../models/logModel.js";

export const getLogs = async(req, res) => {
    try {
        const logs = await fetchLogs();
        const temperatureHumidity = await fetchDHTData();
        const light = await fetchLightData();
        const data = [...logs, ...temperatureHumidity, ...light];
        res.status(200).send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to fetch logs");
    }
};

export const getStatistics = async(req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const filter = { timestamp: { $gte: today } };

        const temperatureHumidity = await fetchDHTData(filter);
        const light = await fetchLightData(filter);

        const temperature_value_time = {
            temperature: temperatureHumidity.map(d => d.temperature),
            time: temperatureHumidity.map(d => d.timestamp)
        };
        const humidity_value_time = {
            humidity: temperatureHumidity.map(d => d.humidity),
            time: temperatureHumidity.map(d => d.timestamp)
        };
        const light_value_time = {
            light: light.map(d => d.intensity),
            time: light.map(d => d.timestamp)
        };

        const result = {
            temperature_value_time,
            humidity_value_time,
            light_value_time,
            distance_value_time: {}
        };

        res.status(200).send(result);
    } catch (err) {
        console.error(err);
        res.statuc(500).send("Failed to get statistics");
    }
};