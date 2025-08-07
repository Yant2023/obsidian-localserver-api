// src/constants.ts

export interface LocalServerAPISettings {
	enabled: boolean;
	port: number;
	apiKey: string;
}

export const DEFAULT_SETTINGS: LocalServerAPISettings = {
	enabled: true, // 默认启用
	port: 8888,
	apiKey: '' // 初始为空，将在第一次加载时生成
}