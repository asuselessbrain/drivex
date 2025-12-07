import express from 'express';
import { bookingController } from './booking.controller';

const router = express.Router();

router.post('/', bookingController.createBooking);
router.get('/admin', bookingController.getAllBookingsForAdmin);

export const bookingRoutes = router;