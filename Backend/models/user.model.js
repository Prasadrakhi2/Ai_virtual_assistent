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
    assistantName : String,
    assistantImage : String,
    history : [{
        type : String
    }]    
}, {timeStamps : true});

const userModel = mongoose.model("user", userSchema)

export default userModel;