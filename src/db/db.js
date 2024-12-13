const mongoose = require('mongoose');

const dbName = process.env.DB_NAME;
const dbContainer = 'mongodb';
// Test editing
// MongoDB connection URI
const mongoURI = `mongodb://${dbContainer}:27017`;

async function dbConnect() {
    mongoose.connection.on('connected', () => {
        console.log("Connected: ", dbName);
    });
    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
        dbName,
    });
}
module.exports = dbConnect
