// src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';

// 这是一个“工厂函数”，它接收apiKey，然后返回一个真正的中间件函数
// 这样做的好处是让中间件能访问到我们插件的设置
export const authMiddleware = (apiKey: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        // 1. 检查是否存在 Authorization header
        if (!authHeader) {
            return res.status(401).json({ message: 'Unauthorized: Missing Authorization header' });
        }

        // 2. 检查header格式是否为 "Bearer <token>"
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
        }

        const token = parts[1];

        // 3. 检查token是否匹配
        if (token !== apiKey) {
            return res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
        }

        // 4. 所有检查通过，放行请求
        next();
    };
};