import db from "../db/database"

export const updateDeviceSchedule = async (deviceId, schedule) => {
    return await db.collection("Device").updateOne(
        { _id: device_name },
        { $set: { schedule } },
        { upsert: true }
    );
};