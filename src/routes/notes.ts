// src/routes/notes.ts

import { Router, Request, Response } from 'express';
import { App, TFile, TFolder } from 'obsidian';

export const createNotesRouter = (app: App): Router => {
    const router = Router();

    // POST /note - 创建新笔记 (已存在)
    router.post('/', async (req: Request, res: Response) => {
        try {
            const { path, content } = req.body;

            if (!path || typeof path !== 'string') {
                return res.status(400).json({ message: 'Bad Request: "path" is required and must be a string.' });
            }
            if (content === undefined || typeof content !== 'string') {
                return res.status(400).json({ message: 'Bad Request: "content" is required and must be a string.' });
            }

            await app.vault.create(path, content);
            
            res.status(201).json({ message: `Note '${path}' created successfully.` });

        } catch (error) {
            console.error('Error creating note:', error);
            if (error.message && error.message.includes('file already exists')) {
                return res.status(409).json({ message: 'Conflict: A file with this path already exists.' });
            }
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    });

    // GET /note?path=<file_path> - 读取指定笔记的内容 (已存在)
    router.get('/', async (req: Request, res: Response) => {
        try {
            const path = req.query.path;

            if (!path || typeof path !== 'string') {
                return res.status(400).json({ message: 'Bad Request: "path" query parameter is required.' });
            }

            const file = app.vault.getAbstractFileByPath(path);

            if (!file) {
                return res.status(404).json({ message: `Not Found: File with path '${path}' does not exist.` });
            }
            if (file instanceof TFolder) {
                 return res.status(400).json({ message: `Bad Request: The specified path '${path}' is a folder, not a file.` });
            }

            const content = await app.vault.read(file as TFile);
            
            res.status(200).json({
                path: file.path,
                content: content,
            });

        } catch (error) {
            console.error('Error reading note:', error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    });

    // PUT /note - 更新指定笔记的内容 (已存在)
    router.put('/', async (req: Request, res: Response) => {
        try {
            const { path, content } = req.body;

            if (!path || typeof path !== 'string') {
                return res.status(400).json({ message: 'Bad Request: "path" is required and must be a string.' });
            }
            if (content === undefined || typeof content !== 'string') {
                return res.status(400).json({ message: 'Bad Request: "content" is required and must be a string.' });
            }

            const file = app.vault.getAbstractFileByPath(path);

            if (!file) {
                return res.status(404).json({ message: `Not Found: File with path '${path}' does not exist.` });
            }
            if (file instanceof TFolder) {
                 return res.status(400).json({ message: `Bad Request: The specified path '${path}' is a folder, not a file.` });
            }

            await app.vault.modify(file as TFile, content);
            
            res.status(200).json({ message: `Note '${path}' updated successfully.` });

        } catch (error) {
            console.error('Error updating note:', error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    });

    // ----------------- 新增功能：删除笔记 -----------------
    // DELETE /note?path=<file_path> - 删除指定的笔记
    router.delete('/', async (req: Request, res: Response) => {
        try {
            const path = req.query.path;

            // 1. 验证路径参数
            if (!path || typeof path !== 'string') {
                return res.status(400).json({ message: 'Bad Request: "path" query parameter is required.' });
            }

            // 2. 查找文件
            const file = app.vault.getAbstractFileByPath(path);

            // 3. 处理文件不存在或目标是文件夹的情况
            if (!file) {
                return res.status(404).json({ message: `Not Found: File with path '${path}' does not exist.` });
            }
            if (file instanceof TFolder) {
                 return res.status(400).json({ message: `Bad Request: The specified path '${path}' is a folder, not a file.` });
            }

            // 4. 使用Obsidian API来删除文件
            await app.vault.delete(file);
            
            res.status(200).json({ message: `Note '${path}' deleted successfully.` });

        } catch (error) {
            console.error('Error deleting note:', error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    });
    // ----------------------------------------------------

    return router;
};