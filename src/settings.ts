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

		containerEl.createEl('h2', { text: 'LocalServer API 设置' });

		// 1. 启用/禁用插件的总开关
		new Setting(containerEl)
			.setName('启用 API 服务器')
			.setDesc('打开或关闭本地HTTP服务器。关闭后，所有API将无法访问。')
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
				.setDesc('用于访问API的安全令牌。请妥善保管，不要泄露。')
				.addText(text => text
					.setValue(this.plugin.settings.apiKey)
					.setDisabled(true) // API Key输入框设为只读
					.inputEl.style.width = '350px')
				.addButton(button => button
					.setButtonText('复制')
					.setTooltip('复制API Key到剪贴板')
					.onClick(() => {
						navigator.clipboard.writeText(this.plugin.settings.apiKey);
					}))
				.addButton(button => button
					.setButtonText('重新生成')
					.setTooltip('生成一个新的API Key，旧的将立即失效')
					.onClick(async () => {
						this.plugin.settings.apiKey = this.generateApiKey();
						await this.plugin.saveSettings();
						this.display(); // 重新渲染以显示新的Key
					}));

			// 3. 端口号配置
			new Setting(containerEl)
				.setName('服务器端口')
				.setDesc('API服务器监听的端口号。修改后需要重启插件才能生效。')
				.addText(text => text
					.setPlaceholder('例如: 8888')
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
			containerEl.createEl('p', { text: '服务器已禁用。请先启用服务器以进行其他配置。' });
		}
	}
}