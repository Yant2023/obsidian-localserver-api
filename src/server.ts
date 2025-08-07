// src/server.ts

import express, { Express, Request, Response } from 'express';
import { Server as HttpServer } from 'http';
import { App } from 'obsidian';
import { authMiddleware } from './middleware/auth';
import { createNotesRouter } from './routes/notes';

export class Server {
    private expressApp: Express;
    private server: HttpServer | null = null;
    private readonly port: number;
    private readonly apiKey: string;
    private readonly obsidianApp: App;

    constructor(port: number, apiKey: string, app: App) {
        this.port = port;
        this.apiKey = apiKey;
        this.obsidianApp = app;
        this.expressApp = express();

        // 使用 express.json() 中间件来解析JSON格式的请求体
        this.expressApp.use(express.json());

        this.setupRoutes();
    }

    private setupRoutes(): void {
        // 创建一个无需认证的“状态”端点，方便检查服务器是否在线
        this.expressApp.get('/status', (req: Request, res: Response) => {
            res.json({
                status: 'ok',
                message: 'LocalServer-API is running'
            });
        });

        // ----------------- 核心改动 -----------------
        // 创建需要认证的守卫
        const requireAuth = authMiddleware(this.apiKey);
        // 创建笔记路由
        const notesRouter = createNotesRouter(this.obsidianApp);

        // 为所有 /note 开头的路径启用“认证守卫”和“笔记路由”
        this.expressApp.use('/note', requireAuth, notesRouter);
        // ------------------------------------------
    }

    public start(): void {
        if (this.server) {
            console.log('Server is already running.');
            return;
        }
        this.server = this.expressApp.listen(this.port, '127.0.0.1', () => {
            console.log(`LocalServer-API started on http://127.0.0.1:${this.port}`);
        });
    }

    public stop(): void {
        if (this.server) {
            this.server.close(() => {
                console.log('LocalServer-API stopped.');
                this.server = null;
            });
        }
    }
}