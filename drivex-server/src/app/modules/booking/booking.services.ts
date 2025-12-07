import pool from "../../../db/db";

const createBooking = async (payload: any) => {
    const isCustomerExist = await pool.query(`SELECT * FROM users WHERE id = $1`, [payload.customer_id]);

    if (isCustomerExist.rowCount === 0) {
        throw new Error('Customer does not exist');
    }

    const isVehicleExist = await pool.query(`SELECT * FROM vehicles WHERE id = $1 AND availability_status = 'available'`, [payload.vehicle_id]);

    if (isVehicleExist.rowCount === 0) {
        throw new Error('Vehicle does not exist or is not available');
    }

    await pool.query(`UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`, [payload.vehicle_id]);

    const total_price = isVehicleExist.rows[0].daily_rent_price * (new Date(payload.rent_end_date).getTime() - new Date(payload.rent_start_date).getTime()) / (1000 * 3600 * 24);

    payload.total_price = total_price;

    const result = await pool.query(`
        INSERT INTO bookings (user_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [payload.customer_id, payload.vehicle_id, payload.rent_start_date, payload.rent_end_date, payload.total_price, 'active']
    );

    return result.rows[0];
}

const getAllBookingsForAdmin = async () => {
    const result = await pool.query(`
    SELECT 
      b.id,
      b.user_id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      u.name AS customer_name,
      u.email AS customer_email,
      v.vehicle_name,
      v.registration_number
    FROM bookings b
    LEFT JOIN users u ON b.user_id = u.id
    LEFT JOIN vehicles v ON b.vehicle_id = v.id;
  `);

    return result.rows;
}

const getMyBookingsForCustomer = async (customerId: number) => {
    const result = await pool.query(`
    SELECT
        b.id,
        b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.total_price,
        b.status,
        v.vehicle_name,
        v.registration_number,
        v.type
    FROM bookings b
    LEFT JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.user_id = $1;
  `, [customerId]);

    return result.rows;
}

const returnBookingStatus = async (bookingId: number) => {

    const vehicleUpdate = await pool.query(`
        UPDATE vehicles 
        SET availability_status = 'available',
        updated_at = Now() 
        WHERE id = (SELECT vehicle_id FROM bookings WHERE id = $1)
        RETURNING availability_status
    `, [bookingId]);

    const bookingUpdate = await pool.query(`
        UPDATE bookings 
        SET 
            status = 'returned', 
            updated_at = Now() 
        WHERE id = $1 
        RETURNING *
    `, [bookingId]);
    const booking = bookingUpdate.rows[0];
    const vehicle = vehicleUpdate.rows[0];

    return {
        id: booking.id,
        customer_id: booking.customer_id,
        vehicle_id: booking.vehicle_id,
        rent_start_date: booking.rent_start_date,
        rent_end_date: booking.rent_end_date,
        total_price: booking.total_price,
        status: booking.status,
        vehicle: {
            availability_status: vehicle.availability_status
        }
    }

}

const cancelBooking = async (bookingId: number) => {

    await pool.query(`
        UPDATE vehicles
        SET
            availability_status = 'available',
            updated_at = Now()
        WHERE id = (SELECT vehicle_id FROM bookings WHERE id = $1)
        RETURNING availability_status
    `, [bookingId]);
    const bookingUpdate = await pool.query(`
        UPDATE bookings
        SET 
            status = 'cancelled',
            updated_at = Now()
        WHERE id = $1
        RETURNING *
    `, [bookingId]);
    return bookingUpdate.rows[0];
}

export const bookingService = {
    createBooking,
    getAllBookingsForAdmin,
    getMyBookingsForCustomer,
    returnBookingStatus,
    cancelBooking
}