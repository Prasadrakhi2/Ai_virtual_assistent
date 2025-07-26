import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true,
        unique : true
    },
    password :{
        type : String,
        required : true
    },
    assistantName : {
        type : String,
        default : ""
    },
    assistantImage : {
        type : String,
        default : ""
    },
    history : [{
        type : String
    }]    
}, {timestamps : true}); // Corrected option name: timestamps (not timeStamps)

const userModel = mongoose.model("user", userSchema)

export default userModel;