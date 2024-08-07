
const mongoose= require("mongoose");
const { type } = require("os");


let urlSchema=new mongoose.Schema({

        shortId:{
            type:String,
            require:true,
            unique:true
        },

        redirectURL:{
            type:String,
            require:true,

        },


        TotalClicks:{
            type:Number,
            require:true

        },
        
        count:{
            type:Number
        },
        visitHistory: [
            {
                timestamp: { type: Number },
                ipAddress: { type: String },
                userAgent: { type: String },
                deviceType: { type: String }
            }
        ],
        Status:{
            type: String,
            default:"AVAILABLE",
            
        }
        
}
,{timestamps:true})



const URL=mongoose.model("urls",urlSchema);
module.exports={URL,urlSchema}
