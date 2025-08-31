import { Request, Response } from "express";
import 'dotenv/config'
import { handleLogin, handleRegister } from 'services/auth.service';
import { error } from "console";
import prisma from "config/prismaClient";


const loginApi = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const { access_token, user } = await handleLogin(email, password);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                access_token,
                user
            }
        });
    } catch (error: Error | any) {
        return res.status(401).json({
            success: false,
            message: error.message || "Login failed",
            error: error.message
        });
    }
}

const registerApi = async (req: Request, res: Response) => {
    const { email, password, username, confirmPassword } = req.body;
    try {
        const user = await handleRegister(email, password, username, confirmPassword);
        return res.status(201).json({
            success: true,
            message: "Registration successful",
            data: {
                user
            }
        });
    } catch (error: Error | any) {
        return res.status(401).json({
            success: false,
            message: error.message || "Registration failed",
            error: error
        });
    }
}

const fetchAccount = async (req: Request, res: Response) => {
    // Assuming req.user is set by the JWT middleware
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
            error: "No user found"
        });
    }


    const { id } = req.user as any;


    const user = await prisma.user.findUnique({
        where: {
            id: +id // Ensure id is a number
        },
        select: {
            id: true,
            email: true,
            username: true,
            role: true,
            avatar: true
        }
    });


    return res.status(200).json({
        success: true,
        message: "Fetch account successful",
        data: {
            user
        }
    });
}

export { loginApi, registerApi, fetchAccount };