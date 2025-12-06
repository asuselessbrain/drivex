import { Request, Response } from "express";
import { userService } from "./user.services";

const getAllUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.getAllUsersFromDB();
        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve users',
            error: error.message
        });
    }
}

export const userController = {
    getAllUser
}