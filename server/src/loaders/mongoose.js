const mongoose = require("mongoose");

const uri = "mongodb+srv://admin:admin@cluster0.4patz.mongodb.net/nasa_project?retryWrites=true&w=majority";

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