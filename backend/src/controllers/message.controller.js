import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

// fetch every single user but not ourselves for our contacts
export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select('-password');

        res.status(200).json(filteredUsers)

    } catch (error) {
        console.error("Error in getUsersForSidebar controller: ", error.message);
        res.status(500).json({mssg: "Internal server error"});
    }
}

// get messages between two users in chronological order
export const getMessages = async (req, res) => {
    try {
        const {id:userToChatId} = req.params
        const myId = req.user_id;

        const messages = await Message.find({
            $or:[
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.error("Error in getMessages controller: ", error.message);
        res.status(500).json({mssg: "Internal server error"});
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body
        const {id: receiverId } = req.params
        const senderId = req.user_id 

        let imageUrl;
        if (image) {
            // Upload base64 to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        // Create new message
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })
        await newMessage.save();

        // todo: realtime functionality with socket.io 
        
        res.status(201).json(newMessage)
    } catch (error) {
        console.error("Error in sendMessage controller: ", error.message);
        res.status(500).json({mssg: "Internal server error"});
    }
};