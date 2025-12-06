import pool from "../../../db/db";

const createVehicleIntoDB = async (vehicleData: any) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = vehicleData;

    const result = await pool.query(`
        INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    )

    return result.rows[0];
}

const getAllVehiclesFromDB = async () => {
    const result = await pool.query(`SELECT * FROM vehicles`);
    return result.rows;
}

const getSingleVehicleFromDB = async (vehicleId: number) => {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicleId]);
    return result.rows[0];
}

const updateVehicleInDB = async (vehicleId: number, updateData: any) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = updateData;

    const result = await pool.query(`
        UPDATE vehicles 
        SET 
            vehicle_name = COALESCE($1, vehicle_name), 
            type = COALESCE($2, type), 
            registration_number = COALESCE($3, registration_number), 
            daily_rent_price = COALESCE($4, daily_rent_price), 
            availability_status = COALESCE($5, availability_status), 
            updated_at = Now() 
        WHERE id = $6 
        RETURNING *
    `,
        [vehicle_name, type, registration_number, daily_rent_price, availability_status, vehicleId]
    );

    return result.rows[0];
}

const deleteVehicleFromDB = async (vehicleId: number) => {
    const bookingCheck = await pool.query(
        `SELECT * FROM bookings WHERE vehicle_id = $1 AND status = 'active'`,
        [vehicleId]
    );

    if (bookingCheck.rows.length > 0) {
        throw new Error("Cannot delete vehicle: there are active bookings");
    }

    const result = await pool.query(
        `DELETE FROM vehicles WHERE id = $1 RETURNING *`,
        [vehicleId]
    );

    return result.rows[0];
};


export const vehicleService = {
    createVehicleIntoDB,
    getAllVehiclesFromDB,
    getSingleVehicleFromDB,
    updateVehicleInDB,
    deleteVehicleFromDB
}