// create device model
import mongoose from 'mongoose';

const deviceSchema  = new mongoose.Schema({
    name: {
        type: String,
        // required: true
    },
    status: {
        type: String,
        // required: true
    },
    threshold: {
        type: Number,
    }
});

export default mongoose.model('Device', deviceSchema);