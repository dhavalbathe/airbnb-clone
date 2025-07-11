const mongoose = require('mongoose');
const Listing = require('../models/listing.js');
const initData = require('./data.js');

const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

main().then(() => {
    console.log("MongoDB Connected Successfully");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj, owner: "6859048f9e66faf67fc4b460",
    }));

    await Listing.insertMany(initData.data);
    console.log("Data Initialization Success!");
}

initDB();