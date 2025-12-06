import express from 'express';
import { vehicleController } from './vehicle.controller';

const router = express.Router();

router.post('/', vehicleController.createVehicle);
router.get('/', vehicleController.getAllVehicles);
router.get('/:vehicleId', vehicleController.getSingleVehicle);
router.patch('/:vehicleId', vehicleController.updateVehicle);
router.delete('/:vehicleId', vehicleController.deleteVehicle);

export const vehicleRoutes = router;