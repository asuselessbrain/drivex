import bcrypt from 'bcrypt';
import { config } from '../../../config';
import pool from '../../../db/db';
import jwt, { Secret } from 'jsonwebtoken';
import type { StringValue } from 'ms';

type TUSER = {
    name: string;
    email: string;
    password: string;
    phone: string;
    role?: string;
}
const createUserIntoDB = async (userData: TUSER) => {
    const { name, email, password, phone } = userData;
    const hashedPassword = await bcrypt.hash(password, config.saltRounds);
    userData.role = 'customer';

    const result = await pool.query(`
        INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [name, email, hashedPassword, phone, userData.role])

    return result.rows[0];
}

const loginUserFromDB = async (payload: { email: string, password: string }) => {
    const { email, password } = payload;

    const isUserExist = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

    if (isUserExist.rowCount === 0) {
        throw new Error('User does not exist');
    }

    const user = isUserExist.rows[0];

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ email: user.email, role: user.role }, config.jwtSecret as Secret, { expiresIn: config.jwtExpiresIn as StringValue })

    return { token, user }
}

export const authService = {
    createUserIntoDB,
    loginUserFromDB
}