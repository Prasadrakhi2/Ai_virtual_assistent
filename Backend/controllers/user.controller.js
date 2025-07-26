import uploadOnCloudinary from "../config/cloudinary.js"
import userModel from "../models/user.model.js"

export const getCurrentUser = async (req, res) =>{
    try {
        const userId = req.userId
        const user = await userModel.findById(userId).select("-password")
        if(!user){
            return res.status(400).json({message : "user not found"})
        }
        return res.status(200).json({ user })
    } catch (error) {
         return res.status(400).json({message : "get current user error"})
    }
}

export const updateAssistant = async (req, res)=>{
    try {
        const {assistentName, imageUrl} = req.body;
        let assistentImage;
        if(req.file){ //user selected image
            assistentImage = await uploadOnCloudinary(req.file.path)
        }
        else{
            assistentImage = imageUrl;
        }

        const user = await userModel.findByIdAndUpdate(req.userId, {
            assistentName, assistentImage
        }, {new : true}).select("-password")

        return res.status(200).json(user)

    } catch (error) {
        return res.status(400).json({message : "update Assistent error"})
    }
}
