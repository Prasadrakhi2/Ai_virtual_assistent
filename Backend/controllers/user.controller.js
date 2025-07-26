import { response } from "express"
import uploadOnCloudinary from "../config/cloudinary.js"
import geminiResponse from "../gemini.js"
import userModel from "../models/user.model.js"
import moment from "moment"

export const getCurrentUser = async (req, res) =>{
    try {
        const userId = req.userId
        const user = await userModel.findById(userId).select("-password")
        if(!user){
            return res.status(400).json({message : "user not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
         return res.status(400).json({message : "get current user error"})
    }
}

export const updateAssistant = async (req, res) => {
    try {
        const { assistantName, imageUrl } = req.body;
        let assistantImage = imageUrl;

        if (req.file) {
            const uploadResult = await uploadOnCloudinary(req.file.path);
            assistantImage = uploadResult?.url || imageUrl;
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            req.userId,
            { assistantName, assistantImage },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(400).json({ message: "User not found" });
        }

        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(400).json({ message: "Update assistant error" });
    }
}


export const askToAssistant = async (req, res) =>{
    try {
        const {command} = req.body
        const user = await userModel.findById(req.userId)
        const userName = user.name
        const assistantName = user.assistantName
        const result = await geminiResponse(command, assistantName,userName)

        const jsonMatch = result.match(/{[\s\S]*}/)
        if(!jsonMatch){
            return res.status(400).json({response: "sorry, i can't understand"})
        }
        const gemResult = JSON.parse(jsonMatch[0])
        const type = gemResult.type

        switch(type){
            case 'get_date' : 
            return res.json({
                type,
                userInput : gemResult.userInput,
                response:`current date is ${moment().format('YYYY-MM-DD')}`
            })
            case 'get_time' : 
            return res.json({
                type,
                userInput : gemResult.userInput,
                response:`current time is ${moment().format('hh:A')}`
            })
            case 'get_day' : 
            return res.json({
                type,
                userInput : gemResult.userInput,
                response:`today is ${moment().format('dddd')}`
            })
            case 'get_month' : 
            return res.json({
                type,
                userInput : gemResult.userInput,
                response:`current month is ${moment().format('MMMM')}`
            })
            case 'google_search':
            case 'youtube_search':
            case 'youtube_play':
            case 'general':
            case 'calculator_open':
            case 'instagram_open':
            case 'facebook_open':
            case 'weather_show':
                return res.json({
                    type,
                    userInput : gemResult.userInput,
                    response: gemResult.response,
                });
                default :
                return res.status(400).json({
                    response : "I did't understand that command."
                })
        }
    } catch (error) {
        return res.status(500).json({
                    response : "ask assistent error"
                })
    }
}