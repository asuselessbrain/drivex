import express from 'express';
import { bookingController } from './booking.controller';
import auth from '../../middleware/auth';

const router = express.Router();

router.post('/', auth('admin', 'customer'), bookingController.createBooking);
router.get('/admin', auth('admin'), bookingController.getAllBookingsForAdmin);
router.get('/customer/:userId', auth('customer'), bookingController.getMyBookingsForCustomer);
router.put('/return/:bookingId', auth('admin'), bookingController.returnBookingStatus);
router.put('/cancel/:bookingId', auth('customer'), bookingController.cancelBooking);

export const bookingRoutes = router;