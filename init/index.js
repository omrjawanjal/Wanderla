const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
//all the above code is copied from app.js 


const initDB = async () => {
  await Listing.deleteMany({}); //delete the db presented before
  initData.data = initData.data.map((obj)=>({...obj,owner:"669776de25d6ead60fec1f08"}));
  await Listing.insertMany(initData.data); //insert data.js database
  console.log("data was initialized");
};

initDB();