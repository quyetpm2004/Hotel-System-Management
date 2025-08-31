
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import "dotenv/config"
const checkValidJWT = (req: Request, res: Response, next: NextFunction) => {

    const path = req.path
    const whiteList = [
        '/register',
        '/login'
    ]

    const isWhiteList = whiteList.some(route => route === path)

    if (isWhiteList) {
        next()
        return;
    }

    const token = req.headers['authorization']?.split(' ')[1] as string; // format: Bearer <token>

    try {
        const dataDecoded: any = jwt.verify(token, process.env.JWT_SECRET ?? "default_secret_key")
        req.user = {
            id: dataDecoded.userId,
            role: dataDecoded.role
        }
        next()
    } catch (error) {
        res.status(401).json({
            data: null,
            message: "Token không hợp lệ (không truyền lên token or token hết hạn)"
        })
    }
}

export { checkValidJWT }