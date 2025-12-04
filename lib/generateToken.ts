import jwt, { SignOptions } from 'jsonwebtoken'


const JWT_SECRET = process.env.JWT_SECRET

export const generateToken = (payload: any, options?: SignOptions) => {
    return jwt.sign(payload, JWT_SECRET!, { ...options, expiresIn: "30m" })
}