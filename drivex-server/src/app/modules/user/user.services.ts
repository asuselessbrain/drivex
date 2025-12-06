import pool from "../../../db/db";

const getAllUsersFromDB = async () => {
    const result = await pool.query('SELECT id, name, email, phone, role FROM users');
    return result.rows;
}

export const userService = {
    getAllUsersFromDB
}