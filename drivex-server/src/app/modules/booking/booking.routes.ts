import express from 'express';
import { bookingController } from './booking.controller';

const router = express.Router();

router.post('/', bookingController.createBooking);
router.get('/admin', bookingController.getAllBookingsForAdmin);
router.get('/customer/:userId', bookingController.getMyBookingsForCustomer);
router.put('/return/:bookingId', bookingController.returnBookingStatus);
router.put('/cancel/:bookingId', bookingController.cancelBooking);

export const bookingRoutes = router;