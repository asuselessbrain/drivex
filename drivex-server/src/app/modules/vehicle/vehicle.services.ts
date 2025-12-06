import pool from "../../../db/db";

const createVehicleIntoDB = async (vehicleData: any) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = vehicleData;

    const result = await pool.query(`
        INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    )

    return result.rows[0];
}

export const vehicleService = {
    createVehicleIntoDB
}