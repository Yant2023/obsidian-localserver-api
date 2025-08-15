# LocalServer API for Obsidian

![GitHub release (latest by date)](https://img.shields.io/github/v/release/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>)
![GitHub all releases](https://img.shields.io/github/downloads/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>/total)
![GitHub license](https://img.shields.io/github/license/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>)

将您的 Obsidian 知识库变为一个强大的、可编程的本地数据中心。通过本地服务器提供的一套完整的 RESTful API，让您的自动化工具、自定义脚本或任何外部应用都能安全、轻松地与您的笔记进行交互。

---

## ✨ 功能特性

* **安全的本地服务器**: 在本地虚拟一个HTTP服务器，仅在您授权下运行。
* **完整的笔记 CRUD API**: 提供对笔记的 **创建 (Create)**、**读取 (Read)**、**更新 (Update)** 和 **删除 (Delete)** 全套操作接口。
* **安全的 API Key 认证**: 所有危险操作均通过 Bearer Token 进行保护，确保您的知识库安全。
* **灵活的端口配置**: 用户可在设置中自定义服务器运行的端口号。
* **简单的图形化设置界面**: 无需修改代码，在Obsidian的设置页面即可完成所有配置，包括一键生成和复制API Key。

## 📸 插件截图

**直观、易用的设置面板:**
![插件设置面板截图](https://github.com/Yant2023/obsidian-localserver-api/blob/main/images/settings-panel-screenshot.png)

## 🚀 安装方法

### 方法一：从 Obsidian 社区插件市场安装 (推荐)

1.  在 Obsidian 中打开 `设置` > `第三方插件`。
2.  确保“安全模式”处于关闭状态。
3.  点击 `社区插件市场` > `浏览`。
4.  搜索 "LocalServer API"。
5.  点击 `安装` 按钮。
6.  安装完成后，在“已安装插件”列表中启用本插件。

### 方法二：手动安装

1.  从本仓库的 [Releases 页面](https://github.com/Yant2023/obsidian-localserver-api/releases) 下载最新的 `main.js`, `manifest.json`, `styles.css` 文件。
2.  进入您的 Obsidian 知识库的插件目录: `<你的库路径>/.obsidian/plugins/`。
3.  在此目录下创建一个新的文件夹，命名为 `localserver-api`。
4.  将下载的三个文件复制到 `localserver-api` 文件夹中。
5.  重启 Obsidian，然后在“已安装插件”列表中启用本插件。

## 🛠️ 如何使用

安装并启用插件后，请按照以下步骤进行配置：

1.  在 Obsidian 中打开 `设置` > `第三方插件`。
2.  找到 "LocalServer API" 并点击其右侧的齿轮图标进入设置页面。
3.  **启用服务器**: 点击“启用 API 服务器”的总开关。首次启用时，插件会自动为您生成一个安全的 API Key。
4.  **配置端口 (可选)**: 如果默认端口 `8888` 与您本地其他应用冲突，您可以在此修改为一个新的端口号。
5.  **获取 API Key**: 在设置页面，您可以直接看到您的 API Key。点击“复制”按钮即可将其用于您的外部应用中。如果怀疑Key已泄露，可以点击“重新生成”来创建一个新的Key。

**重要提示**: 修改任何设置（如开关、端口号）后，建议您在“已安装插件”列表中**禁用并重新启用**本插件，以确保所有设置都已生效。

## 👨‍💻 致开发者：API 文档

本插件的核心价值在于其提供的 RESTful API。我们为所有外部应用开发者准备了一份详尽的接口文档，其中包含了认证细节、所有端点的说明、请求/响应格式以及 `curl` 测试示例。

**[➡️ 点击此处查看详细的API接口文档](API.md)**

**快速测试服务器状态 (无需认证):**
```bash
curl http://localhost:8888/status

如果服务器正常运行，它将返回:
{
  "status": "ok",
  "message": "LocalServer-API is running"
}
📄 许可证
本插件使用 MIT 许可证。

🙏 致谢
感谢 Obsidian 团队创造了如此优秀、可扩展的平台。