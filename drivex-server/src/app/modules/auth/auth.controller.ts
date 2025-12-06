import { Request, Response } from "express";
import { authService } from "./auth.services";

const createUser = async (req: Request, res: Response) => {
    try {
        const result = await authService.createUserIntoDB(req.body);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to create user',
            error: error.message
        });
    }
}

export const authController = {
    createUser
}