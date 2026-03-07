

const mongoose = require("mongoose");

const initializeDatabase = async () => {

    try {

        const database = await mongoose.connect(process.env.MONGO_URI);

        console.log(`Database connected successfully: ${database.connection.host}`);

    } catch (err) {

        console.log("Error connecting to MongoDB:", err.message);

        // Exit application if DB fails
        process.exit(1);

    }

};

module.exports = initializeDatabase;