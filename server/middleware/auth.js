import jwt from 'jsonwebtoken';
import { User } from '../model/user.model.js';

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ message: 'Not Authorised, token missing' });
    }

    const token = authHeader.split(' ')[1]; // Bearer tokenstring 
    try {

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Not Authorised, user not found' });
        }
        if (user.blocked) return res.status(403).json({ message: 'Your account is blocked' });
        req.user = user;
        next();
    } catch (error) {
        console.error("JWT verification failed:", error);
        return res.status(401).json({ message: 'Not Authorised, token failed' });
    }

}

export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Access denied: Admin only" });
    }
    next();
};
