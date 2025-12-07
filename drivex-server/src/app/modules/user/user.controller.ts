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

const updateUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const result = await userService.updateUserInDB(Number(userId), req.body);
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to update user',
            error: error.message
        });
    }
}

const deleteUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        await userService.deleteUserFromDB(Number(userId));
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete user',
            error: error.message
        });
    }
}

export const userController = {
    getAllUser,
    updateUser,
    deleteUser
}