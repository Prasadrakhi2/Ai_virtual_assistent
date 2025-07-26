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

        return res.status(200).json({ user: updatedUser });
    } catch (error) {
        return res.status(400).json({ message: "Update assistant error" });
    }
}
