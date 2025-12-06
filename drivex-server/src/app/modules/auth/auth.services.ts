import bcrypt from 'bcrypt';
import { config } from '../../../config';
const createUserIntoDB = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, config.saltRounds);
    userData.role = 'customer';
    const userWithHashedPassword = { ...userData, password: hashedPassword };
    
    console.log(userWithHashedPassword)
}

export const authService = {
    createUserIntoDB
}