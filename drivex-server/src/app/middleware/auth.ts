import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../../config';
import pool from '../../db/db';

const auth = (...roles: string[]) => {
    return async (req: any, res: any, next: any) => {

        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        let decoded;

        try{
            decoded = jwt.verify(token, config.jwtSecret as string) as JwtPayload;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        console.log(decoded)

        const isUserExist = await pool.query('SELECT * FROM users WHERE email = $1', [decoded.email]);

        if (isUserExist.rowCount === 0) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        req.user = decoded;

        if (roles.length && !roles.includes(isUserExist.rows[0].role)) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden access'
            });
        }

        next();
    }
}

export default auth;