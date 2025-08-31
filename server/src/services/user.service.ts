import prisma from 'config/prismaClient'
import { comparePassword, hashPassword } from 'validation/password';

const handleGetUsers = async () => {
    try {
        const users = await prisma.user.findMany();
        return users

    } catch (error) {
        console.error("Error fetching users:", error);
        return []
    }
}

const handleUpdateInfo = async (email: string, username: string, avatar: string) => {
    try {
        if (avatar === '') {
            const user = await prisma.user.update({
                where: { email },
                data: {
                    username,
                },
            });
            return {
                email: user.email,
                username: user.username,
                id: user.id,
                role: user.role,
                avatar: user.avatar
            }
        } else {
            const user = await prisma.user.update({
                where: { email },
                data: {
                    username,
                    avatar
                },
            });
            return {
                email: user.email,
                username: user.username,
                id: user.id,
                role: user.role,
                avatar: user.avatar
            }
        }

    } catch (error) {
        console.error("Error fetching users:", error);
        return []
    }
}

const handleUpdatePassword = async (email: string, password: string, confirmPassword: string, newPassword: string) => {
    const user = await prisma.user.findUnique({
        where: { email }
    })
    if (user) {
        const isValid = await comparePassword(password, user?.password)
        if (!isValid) {
            throw new Error("Mật khẩu cũ không chính xác!")

        }
        if (newPassword !== confirmPassword) {
            throw new Error("Mật khẩu mới không khớp!")
        }
        const passwordHash = await hashPassword(newPassword)
        await prisma.user.update({
            where: { email },
            data: {
                password: passwordHash
            }
        })
    }
    return user
}

export { handleGetUsers, handleUpdateInfo, handleUpdatePassword };