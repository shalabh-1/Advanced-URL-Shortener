const express=require("express");
const connectToDatabase=require('./connection/dbconnection.js')
const app=express();
const routes=require("./routes/api.js")
const dotenv = require("dotenv");
const { uniqueVisitors}=require("./middlewares/middleware.js")
const helmet=require("helmet") 
const cors = require('cors')

const limiter=require('./config/ratelimiter.js')
dotenv.config();

const PORT=process.env.PORT || 8000



    connectToDatabase(process.env.DB_URL)
    .then(()=>console.log("Your database is connected"))
    .catch((err) => {
    console.error("Database connection failed", err);
    process.exit(1); 
        }
    );

    app.use(limiter)
app.use(helmet());
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use( uniqueVisitors);

app.use("/api",routes)

app.listen(PORT,()=>{
    console.log("server created")}
)

