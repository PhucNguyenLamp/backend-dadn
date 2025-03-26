// create device model
import mongoose from 'mongoose';

const DHT20_Sensor_DataSchema = new mongoose.Schema({
    Humidity: {
        type: Number,
    },
    Temperature: {
        type: Number,
    },
    timestamp: {
        type: Date,
    },
});

export default mongoose.model('DHT20_Sensor_Data', DHT20_Sensor_DataSchema, 'DHT20_Sensor_Data');