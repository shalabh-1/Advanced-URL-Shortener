        const mongoose=require("mongoose")

        function connectToDatabase(Url){

            return mongoose.connect(Url)
        }

module.exports=connectToDatabase