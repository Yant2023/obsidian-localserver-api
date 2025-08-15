# LocalServer API for Obsidian

![GitHub release (latest by date)](https://img.shields.io/github/v/release/Yant2023/obsidian-localserver-api)
![GitHub all releases](https://img.shields.io/github/downloads/Yant2023/obsidian-localserver-api/total)
![GitHub license](https://img.shields.io/github/license/Yant2023/obsidian-localserver-api)

Transform your Obsidian vault into a powerful, programmable local data center. This plugin runs a local HTTP server, providing a complete RESTful API to allow your automation tools, custom scripts, or any external application to securely and easily interact with your notes.

---

## ✨ Features

* **Secure Local Server**: Runs a local HTTP server that only operates with your authorization.
* **Complete Note CRUD API**: Provides a full suite of endpoints for **C**reating, **R**eading, **U**pdating, and **D**eleting notes.
* **Secure API Key Authentication**: All sensitive operations are protected by a Bearer Token, ensuring the security of your vault.
* **Flexible Port Configuration**: Users can customize the server's running port in the settings.
* **Simple GUI Settings**: No need to edit code. All configurations, including one-click API Key generation and copying, can be done from the Obsidian settings page.

## 📸 Screenshots

**Intuitive and Easy-to-Use Settings Panel:**
![Settings Panel Screenshot](https://github.com/Yant2023/obsidian-localserver-api/blob/main/images/settings-panel-screenshot.png)

## 🚀 Installation

### From Community Plugins (Recommended)

1.  In Obsidian, go to `Settings` > `Community plugins`.
2.  Make sure "Safe mode" is turned **off**.
3.  Click `Browse` to open the community plugins market.
4.  Search for "LocalServer API".
5.  Click the `Install` button.
6.  Once installed, enable the plugin in the "Installed plugins" list.

### Manual Installation

1.  Download the `main.js`, `manifest.json`, and `styles.css` files from the [latest release](https://github.com/Yant2023/obsidian-localserver-api/releases).
2.  Navigate to your Obsidian vault's plugin folder: `<YourVault>/.obsidian/plugins/`.
3.  Create a new folder named `localserver-api`.
4.  Copy the three downloaded files into the `localserver-api` folder.
5.  Reload Obsidian, then enable the plugin in the "Installed plugins" list.

## 🛠️ How to Use

After installing and enabling the plugin, follow these steps to configure it:

1.  In Obsidian, go to `Settings` > `Community plugins`.
2.  Find "LocalServer API" and click the gear icon to the right to open the settings page.
3.  **Enable the Server**: Toggle the "Enable API Server" switch. The plugin will automatically generate a secure API Key for you on the first run.
4.  **Configure Port (Optional)**: If the default port `8888` conflicts with another application, you can change it to a new one here.
5.  **Get Your API Key**: You can see your API Key directly in the settings. Click the "Copy" button to use it in your external applications. If you suspect the key has been compromised, you can click "Regenerate" to create a new one.

**Important**: After changing any settings (like the toggle or port number), it is recommended to **disable and re-enable** the plugin from the community plugins list to ensure all changes take effect.

## 👨‍💻 For Developers: API Documentation

The core value of this plugin lies in its RESTful API. We have prepared detailed documentation for all external application developers, which includes authentication details, endpoint descriptions, request/response formats, and `curl` examples.

**[➡️ Click here for the detailed API Documentation](API.md)**

**Quickly test the server status (no authentication required):**
```bash
curl http://localhost:8888/status

If the server is running correctly, it will return:
{
  "status": "ok",
  "message": "LocalServer-API is running"
}

Looking for the documentation in Chinese? Click here.

📄 License
This plugin is released under the MIT License.