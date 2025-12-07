import { Request, Response } from "express";
import { bookingService } from "./booking.services";

const createBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingService.createBooking(req.body);
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to create booking',
            error: error.message
        });
    }
}

const getAllBookingsForAdmin = async (req: Request, res: Response) => {
    try {
        const result = await bookingService.getAllBookingsForAdmin();

        const formatted = result.map(row => ({
            id: row.id,
            customer_id: row.user_id,
            vehicle_id: row.vehicle_id,
            rent_start_date: row.rent_start_date,
            rent_end_date: row.rent_end_date,
            total_price: row.total_price,
            status: row.status,
            customer: {
                name: row.customer_name,
                email: row.customer_email
            },
            vehicle: {
                vehicle_name: row.vehicle_name,
                registration_number: row.registration_number
            }
        }));
        res.status(200).json({
            success: true,
            message: 'Bookings retrieved successfully',
            data: formatted
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve bookings',
            error: error.message
        });
    }
}

const getMyBookingsForCustomer = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const result = await bookingService.getMyBookingsForCustomer(Number(userId));
        const formatted = result.map(row => ({
            id: row.id,
            customer_id: row.user_id,
            vehicle_id: row.vehicle_id,
            rent_start_date: row.rent_start_date,
            rent_end_date: row.rent_end_date,
            total_price: row.total_price,
            status: row.status,
            vehicle: {
                vehicle_name: row.vehicle_name,
                registration_number: row.registration_number,
                type: row.type,
            }
        }));
        res.status(200).json({
            success: true,
            message: 'Bookings retrieved successfully',
            data: formatted
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve bookings',
            error: error.message
        });
    }
}

export const bookingController = {
    createBooking,
    getAllBookingsForAdmin,
    getMyBookingsForCustomer
}