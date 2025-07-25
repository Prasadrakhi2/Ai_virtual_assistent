import genToken from "../config/token.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) =>{
    try {
        const {name, password, email} = req.body;

        const existEmail = await userModel.findOne({email});

        if(existEmail){
            return res.status(400).json({message : "Email already exist"})
        }

        // check password lenght is more than 6
        if(password.length < 6){
            return res.status(400).json({message : "Password must contain more than 6 characters"})
        }

        // hash password
        bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt,async function(err, hash) {

        const user = userModel.create({
            name,
            password : hash,
            email
        })

        // pass token in cookie
        const token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly : true,
            maxAge : 2*24*60*60*1000, //2day * 24h *60min * 60sec * 1000ms
            sameSite : "strict",
            secure : false

        })
         return res.status(200).json(user);
    });
   
});
    } catch (error) {
      return res.status(500).json({message : `sign up error : ${error}`});
    }
}

// login user
export const login = async (req, res) =>{
    try {
        const {password, email} = req.body;

        const user = await userModel.findOne({email});

        if(!existEmail){
            return res.status(400).json({message : "User not exist"})
        }
        
        // compaire password
        const isMathPassword = await bcrypt.compare(password, user.password);

        if(!isMathPassword){
            return res.status(400).json({message : "Invalid password"})
        }

      // pass token in cookie
        const token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly : true,
            maxAge : 2*24*60*60*1000, //2day * 24h *60min * 60sec * 1000ms
            sameSite : "strict",
            secure : false

        })

         return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({message : `login error : ${error}`});
    }
}

// logout
export const logout = (req, res)=>{
    try {
        res.clearCookie("token");
        return res.status(200).json({message : 'logout successfully'});
    } catch (error) {
        return res.status(500).json({message : `login error : ${error}`});
    }
}
