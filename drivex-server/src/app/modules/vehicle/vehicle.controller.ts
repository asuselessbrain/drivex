import { Request, Response } from "express";
import { vehicleService } from "./vehicle.services";

const createVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleService.createVehicleIntoDB(req.body);
        res.status(201).json({
            success: true,
            message: 'Vehicle created successfully',
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to create vehicle',
            error: error.message
        });
    }
}

export const vehicleController = {
    createVehicle
}