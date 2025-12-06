import express from 'express';
import { Pool } from 'pg';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
    connectionString: `postgresql://neondb_owner:npg_GVFMBx4PAwb2@ep-cold-cell-a470c795-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
})


const initDb = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        role VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT Now(),
        updated_at TIMESTAMP DEFAULT Now(),

        Constraint email_format CHECK (email = LOWER(email)),

        Constraint chk_password_length CHECK (LENGTH(password) >= 6),

        Constraint chk_role CHECK (role IN ('admin', 'customer'))
        )
        `)

    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(50) NOT NULL,
        type VARCHAR(30) NOT NULL,
        registration_number VARCHAR(50) UNIQUE NOT NULL,
        daily_rent_price NUMERIC(1000,2) NOT NULL,
        availability_status varchar(20) NOT NULL,
        created_at TIMESTAMP DEFAULT Now(),
        updated_at TIMESTAMP DEFAULT Now(),

        Constraint chk_availability_status CHECK (availability_status IN ('available', 'booked')),
        Constraint chk_type CHECK (type IN ('car', 'bike', 'van', 'SUV')),
        Constraint rent_price_positive CHECK (daily_rent_price > 0)
        )`)

    await pool.query(`
        
        CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
        total_price NUMERIC(1000,2) NOT NULL,
        status VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT Now(),
        updated_at TIMESTAMP DEFAULT Now(),

        Constraint chk_status CHECK (status IN ('active', 'cancelled', 'returned')),
        Constraint chk_total_price_positive CHECK (total_price > 0),
        Constraint chk_rent_dates CHECK (rent_end_date > rent_start_date)
        )`)
}

initDb()
export default app;