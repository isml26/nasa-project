const mongoose = require("mongoose");

const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
    },
    mission: {
        type: String,
        required: true
    },
    rocket: {
        type: String,
        required: true
    },
    launchDate: {
        type: Date,
        required: true
    },
    target: {
        type: String
    },
    customers: {
        type: [String]
    },
    upcoming: {
        type: Boolean,
        default: true
    },
    success: {
        type: Boolean,
        required: true,
        default: true
    },
}, {
    timestamps: false,
    versionKey: false,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id
        }
    }
});

module.exports = mongoose.model('Launch', launchesSchema);