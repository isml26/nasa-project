const mongoose = require("mongoose");
require('dotenv').config();

const uri = process.env.uri;

async function connectDB() {
    try {
        await mongoose.connect(uri).then(console.log("Connected to database")).catch((err) => console.log(err))
    } catch (error) {
        console.error(error);
    }
}
async function disconnectDB() {
    try {
        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    connectDB,
    disconnectDB
};