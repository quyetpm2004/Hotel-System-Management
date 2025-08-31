import prisma from 'config/prismaClient'
import { Request, Response } from "express";
import { hashPassword, comparePassword } from 'validation/password';
import jwt from 'jsonwebtoken';
import 'dotenv/config'

const handleLogin = async (email: string, password: string) => {

    const user = await prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw new Error("User not found");
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }

    const payload = {
        userId: user.id,
        role: user.role
    }

    const secretKey = process.env.JWT_SECRET || "default_secret_key";

    const access_token = jwt.sign(
        payload,
        secretKey,
        {
            expiresIn: "365d"
        }
    )

    return { access_token, user: { id: user.id, username: user.username, email: user.email, role: user.role } };
}

const handleRegister = async (email: string, password: string, username: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
    }

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new Error("Email already in use");
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            username
        }
    });

    return user;
}


export { handleLogin, handleRegister }
