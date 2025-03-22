require('dotenv').config();
const mongoose = require("mongoose");

const connectToDb = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("The connection to database was successful");
    }catch(err){
        console.log("Connection to the database was not successful");
        console.log("Error: ", err);
    }
}

module.exports = connectToDb;