// src/settings.ts

import { App, PluginSettingTab, Setting } from 'obsidian';
import LocalServerAPI from 'main'; // 导入我们主插件的类型

export class ServerSettingTab extends PluginSettingTab {
	plugin: LocalServerAPI;

	constructor(app: App, plugin: LocalServerAPI) {
		super(app, plugin);
		this.plugin = plugin;
	}

	// 生成一个随机的、安全的API Key
	private generateApiKey(): string {
		const length = 32;
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let apiKey = '';
		for (let i = 0; i < length; i++) {
			apiKey += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return apiKey;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty(); // 清空设置页面，防止重复渲染

		containerEl.createEl('h2', { text: 'LocalServer API Settings' });

		// 1. 启用/禁用插件的总开关
		new Setting(containerEl)
			.setName('Enable API Server')
			.setDesc('Turn the local HTTP server on or off. When off, all APIs will be inaccessible.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enabled)
				.onChange(async (value) => {
					this.plugin.settings.enabled = value;
					await this.plugin.saveSettings();
					// 提示用户需要重启插件来应用开关状态
					this.display(); // 重新渲染设置页面以更新状态
				}));
		
		// 只有在启用状态下才显示其他设置
		if (this.plugin.settings.enabled) {
			
			// 2. API Key 管理
			new Setting(containerEl)
				.setName('API Key')
				.setDesc('The security token for accessing the API. Keep it safe and do not share it.')
				.addText(text => text
					.setValue(this.plugin.settings.apiKey)
					.setDisabled(true) // API Key输入框设为只读
					.inputEl.style.width = '350px')
				.addButton(button => button
					.setButtonText('Copy')
					.setTooltip('Copy API Key to clipboard')
					.onClick(() => {
						navigator.clipboard.writeText(this.plugin.settings.apiKey);
					}))
				.addButton(button => button
					.setButtonText('Regenerate')
					.setTooltip('Generate a new API Key. The old one will become invalid immediately.')
					.onClick(async () => {
						this.plugin.settings.apiKey = this.generateApiKey();
						await this.plugin.saveSettings();
						this.display(); // 重新渲染以显示新的Key
					}));

			// 3. 端口号配置
			new Setting(containerEl)
				.setName('Server Port')
				.setDesc('The port number for the API server to listen on. Requires a plugin restart to take effect.')
				.addText(text => text
					.setPlaceholder('e.g., 8888')
					.setValue(this.plugin.settings.port.toString())
					.onChange(async (value) => {
						// 将输入转换为数字
						const port = parseInt(value, 10);
						// 验证端口是否为有效数字和在有效范围内
						if (!isNaN(port) && port > 0 && port < 65536) {
							this.plugin.settings.port = port;
							await this.plugin.saveSettings();
						}
					}));
		} else {
			containerEl.createEl('p', { text: 'Server is disabled. Please enable it to see more options.' });
		}
	}
}
