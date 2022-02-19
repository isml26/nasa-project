const mongoose = require("mongoose");

const planetSchema = new mongoose.Schema({
    keplerName: {
        type: String,
        required: true
    }
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

module.exports = mongoose.model('Planet', planetSchema);