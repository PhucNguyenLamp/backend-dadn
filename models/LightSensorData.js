// create device model
import mongoose from 'mongoose';

const Light_Sensor_DataSchema  = new mongoose.Schema({
    intensity: {
        type: Number,
    },
    timestamp: {
        type: Date,
    }
});

export default mongoose.model('Light_Sensor_Data', Light_Sensor_DataSchema, 'Light_Sensor_Data');
