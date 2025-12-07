import pool from "../../../db/db";

const getAllUsersFromDB = async () => {
    const result = await pool.query('SELECT id, name, email, phone, role FROM users');
    return result.rows;
}

const updateUserInDB = async (userId: number, updateData: any) => {
    const { name, email, phone, role } = updateData;
    const result = await pool.query(`
        UPDATE users 
        SET 
            name = COALESCE($1, name),
            email = COALESCE($2, email),
            phone = COALESCE($3, phone),
            role = COALESCE($4, role),
            updated_at = Now() 
        WHERE id = $5 
        RETURNING id, name, email, phone, role
    `, [name, email, phone, role, userId]);

    return result.rows[0];
}

const deleteUserFromDB = async (userId: number) => {
    const bookingCheck = await pool.query(
        `SELECT * FROM bookings WHERE user_id = $1 AND status = 'active'`,
        [userId]
    );

    if (bookingCheck.rows.length > 0) {
        throw new Error("Cannot delete user: active bookings exist");
    }

    const result = await pool.query(
        `DELETE FROM users WHERE id = $1 RETURNING *`,
        [userId]
    );

    return result.rows[0];
};

export const userService = {
    getAllUsersFromDB,
    updateUserInDB,
    deleteUserFromDB
}