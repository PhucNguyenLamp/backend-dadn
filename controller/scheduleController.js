import { updateDeviceSchedule } from "../models/scheduleModel.js";

export const updateSchedule = async (req, res) => {
    try {
        let device_name = req.body._id;
        let schedule = req.body.schedule;
        console.log(req.schedule)

        let result = updateDeviceSchedule(device_name, schedule);
        res.status(204).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to add record");
    }
};