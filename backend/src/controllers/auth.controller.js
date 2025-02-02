import User from '../models/user.model.js'
import bcrpyt from 'bcryptjs'
import { generateToken } from '../lib/utils.js'
import cloudinary from '../lib/cloudinary.js'

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({mssg: "All fields are required"});
        }
        if (password.length < 5) {
            return res.status(400).json({mssg: "Password must be at least 6 characters"});
        }

        const user = await User.findOne({email});
        if (user) {
            return res.status(400).json({mssg: "User already exists"});
        }
        // hash passwords
        const salt = await bcrpyt.genSalt(10);
        const hashedPassword = await bcrpyt.hash(password, salt)

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        })
        
        if (newUser) {
            // generate jwt token
            generateToken(newUser._id, res)
            await newUser.save();
            // created
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        } else {
            res.status(400).json({mssg: "Invalid user data"})
        }
         
    } catch (error) {
        console.log("error in signup controller:", error.message);
        res.status(500).json({mssg: "Internal Server Error"});
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({mssg: "Invalid credentials"})
        }

        const isPasswordCorrect = await bcrpyt.compare(password, user.password)    
        if (!isPasswordCorrect) {
            return res.status(400).json({mssg: "Invalid credentials"})
        }

        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });
        
    } catch (error) {
        res.status(500).json({mssg: "Internal server error"})
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie('jwt', '', {maxAge: 0}) // clear cookies
        res.status(200).json({mssg: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({mssg: "Internal server error"})
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id; // using protectRoute to get user

        if (!profilePic) {
            return res.send(400).json({mssg: "Profile pic required"})
        }
        // cloudinary is a bucket for the images, need to update database
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true})
        
        res.status(200).json(updatedUser)
    } catch (error) {
        console.log('error in update profile', error);
        res.status(500).json({mssg: "Internal server error"});
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
        // send user back to the client giving authenticated user
    } catch (error) {
        console.log('Error in checkAuth controller', error.message)
        res.status(500).json({mssg: "Internal server error"})
    }
}