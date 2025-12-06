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

const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehicleService.getAllVehiclesFromDB();
        if (result.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No vehicles found',
                data: []
            });
        }
        res.status(200).json({
            success: true,
            message: 'Vehicles retrieved successfully',
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve vehicles',
            error: error.message
        });
    }
}

const getSingleVehicle = async (req: Request, res: Response) => {
    const {vehicleId} = req.params;
    try{
        const result = await vehicleService.getSingleVehicleFromDB(Number(vehicleId));
        res.status(200).json({
            success: true,
            message: 'Vehicle retrieved successfully',
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve vehicle',
            error: error.message
        });
    }
}

export const vehicleController = {
    createVehicle,
    getAllVehicles,
    getSingleVehicle
}