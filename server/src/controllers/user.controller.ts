import prisma from 'config/prismaClient'
import { Request, Response } from "express";
import { handleGetUsers, handleUpdateInfo, handleUpdatePassword } from 'services/user.service';
import 'dotenv/config'

const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await handleGetUsers();

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users
        });

    } catch (error) {
        console.error("Error fetching users:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error
        });
    }
};

const updateInfoUser = async (req: Request, res: Response) => {
    const { email, username } = req.body;
    const avatarFile = req.file?.filename || '';

    try {
        const user = await handleUpdateInfo(email, username, avatarFile)

        return res.status(201).json({
            success: true,
            message: "Update user successfully",
            data: user
        });

    } catch (error) {
        console.error("Error fetching users:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error
        });
    }
}

const updatePassword = async (req: Request, res: Response) => {
    const { email, password, confirmPassword, newPassword } = req.body
    try {
        const user = await handleUpdatePassword(email, password, confirmPassword, newPassword)
        return res.status(201).json({
            success: true,
            message: "Update password successfully",
            data: user
        });
    } catch (error) {
        console.error("Error fetching users:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error
        });
    }
}

export { getUsers, updateInfoUser, updatePassword };