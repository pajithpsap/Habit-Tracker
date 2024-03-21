const mongoose = require('mongoose');

// Define the daily tracking schema
const dailyTrackingSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    done: {
        type: Boolean,
        default: false
    },
    dateString: {
        type:String
    }
});

// Define the habit schema
const habitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    tracking: [dailyTrackingSchema] // Array of daily tracking data
});

// Create a model from the schema
const Habit = mongoose.model('Habit', habitSchema);

// Export the model
module.exports = Habit;
