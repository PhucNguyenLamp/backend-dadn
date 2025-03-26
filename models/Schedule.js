// create device model
import mongoose from 'mongoose';

const scheduleSchema  = new mongoose.Schema({
    repeat: {
        type: string,
    },
    fromTime: {
        type: Date,
    },
    toTime: {
        type: Date,
    },
});

export default mongoose.model('Schedule', scheduleSchema);