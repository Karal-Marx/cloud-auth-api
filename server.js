require("dotenv").config(); //to use the .env variables
const express = require("express"); 
const connectToDb = require("./database/db");
const authRoutes = require("./routes/auth-routes");
const homeRoutes = require("./routes/home-routes");
const adminRoutes = require('./routes/admin-routes');
const uploadImageRoutes = require('./routes/img-routes');


//connecting to the database
connectToDb();

const app = express();
const PORT = process.env.PORT || 3000;

//using json as the default method
app.use(express.json());

//routing
app.use("/api/auth",authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image', uploadImageRoutes);


//starting the server
app.listen(PORT, ()=>{
    console.log(`The server is listening on port ${PORT}`);
})
