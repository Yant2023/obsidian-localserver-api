// main.ts

import { App, Plugin } from 'obsidian';
import { Server } from './src/server';
import { DEFAULT_SETTINGS, LocalServerAPISettings } from './src/constants';
import { ServerSettingTab } from './src/settings';

export default class LocalServerAPI extends Plugin {
	settings: LocalServerAPISettings;
	server: Server;

	async onload() {
		console.log('Loading LocalServer-API plugin...');

		await this.loadSettings();
		this.addSettingTab(new ServerSettingTab(this.app, this));

		if (this.settings.enabled) {
			// 将 apiKey 和 app 对象传递给服务器构造函数
			this.server = new Server(this.settings.port, this.settings.apiKey, this.app);
			this.server.start();
		}
	}

	onunload() {
		console.log('Unloading LocalServer-API plugin...');
		if (this.server) {
			this.server.stop();
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		if (!this.settings.apiKey) {
			this.settings.apiKey = this.generateApiKey();
			await this.saveSettings();
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private generateApiKey(): string {
		const length = 32;
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let apiKey = '';
		for (let i = 0; i < length; i++) {
			apiKey += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return apiKey;
	}
}