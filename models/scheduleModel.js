import db from "../db/database.js"

export const updateDeviceSchedule = async (device_name, schedule) => {
    console.log(schedule)
    return await db.collection("Device").updateOne(
        { _id: device_name },
        { $set: { schedule } },
        { upsert: true }
    );
};