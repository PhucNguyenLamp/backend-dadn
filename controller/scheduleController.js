import { updateDeviceSchedule } from "../models/scheduleModel";

export const updateSchedule = async (req, res) => {
    try {
        let device_name = req.body._id;
        let schedule = req.body.schedule;
        // console.log(req.body)

        // 2025-04-10T17:00:00.000Z process this to hh:mm
        const originalTime = schedule.time;
        schedule.set = originalTime.split("T")[1].split(":").slice(0, 2).join(":");
        console.log(schedule)
        let result = updateDeviceSchedule(device_name, schedule);
        res.status(204).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to add record");
    }
};