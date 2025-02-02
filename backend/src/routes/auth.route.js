import express from 'express';
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router()

router.post('/signup', signup); 
router.post('/login',  login);
router.post('/logout', logout);

// update profile (must be authenticated, so check first (middleware) then update)
router.put('/update-profile', protectRoute, updateProfile);

// call when we refresh our application, just need to check if user is authenticated
router.get('/check', protectRoute, checkAuth);

export default router;