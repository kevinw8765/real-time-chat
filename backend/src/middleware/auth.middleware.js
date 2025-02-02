import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt

        if (!token) {
            // unauthorized access
            return res.status(401).json({mssg: "Unauthorized - No token provided"})
        }

        // validate token with cookie parser (payload is userid)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return res.status(401).json({mssg: "Token invalid"})
        }
        // dont send password to client
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(404).json({mssg: "User not found"})
        }

        req.user = user 

        next()
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({mssg: "Interval server error"})
    }
}