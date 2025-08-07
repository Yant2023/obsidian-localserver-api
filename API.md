# LocalServer-API 接口文档 (v1.0)

欢迎使用 LocalServer-API for Obsidian！本 API 允许您通过编程方式，安全地与您的 Obsidian知识库进行交互，实现对笔记的创建、读取、更新和删除（CRUD）操作。

## 1. 概述 (Overview)

### 基础 URL (Base URL)

所有 API 请求都应发送到以下基础 URL：

`http://localhost:<PORT>`

* `<PORT>`: 这是 Obsidian 用户在 LocalServer-API 插件设置中配置的端口号。默认值为 `8888`。请提醒您的应用用户，需要从他们的插件设置中获取实际的端口号。

### 数据格式 (Data Format)

所有请求体（Request Body）和响应体（Response Body）都使用 **`application/json`** 格式。发送数据的请求（`POST`, `PUT`）必须包含 `Content-Type: application/json` 的请求头。

## 2. 认证 (Authentication)

本 API 使用 **Bearer Token** 方案进行安全认证。

1.  **获取 API Key**: API Key 由 Obsidian 用户在 `LocalServer API` 插件的设置页面中生成和获取。它是一个长而随机的字符串。
2.  **发送认证信息**: 开发者在调用所有受保护的 API 端点时，必须在 HTTP 请求头中加入 `Authorization` 字段。

**格式**:
`Authorization: Bearer <用户的API_KEY>`

如果认证失败（未提供、格式错误或Key不正确），服务器将返回 `401 Unauthorized` 错误。

## 3. 通用约定 (General Conventions)

### URL 编码

当文件路径包含非英文字符（如中文、日文）、空格或特殊符号时，必须在作为URL查询参数（Query Parameter）传递前进行 **URL 编码**。

### 错误响应格式

所有错误响应都遵循统一的JSON格式，并包含一个 `message` 字段以说明错误原因。

**示例**:
```json
{
  "message": "Not Found: File with path '...' does not exist."
}

4. API 端点详解 (API Endpoints)
4.1 状态检查
此端点用于检查 API 服务器是否正在运行，无需认证。

Endpoint: GET /status

方法: GET

认证: 否

成功响应:

Code: 200 OK

Body:

{
  "status": "ok",
  "message": "LocalServer-API is running"
}

示例 curl 命令:

curl http://localhost:8888/status

4.2 创建笔记
Endpoint: POST /note

方法: POST

描述: 在Obsidian知识库中创建一个新的笔记。

认证: 是

请求头:

Content-Type: application/json

Authorization: Bearer <用户的API_KEY>

请求体 (JSON):

字段名

类型

是否必须

描述

path

string

是

笔记的完整路径，包含文件夹和.md后缀。例如: Work/Meetings/2025-08-06 会议纪要.md

content

string

是

笔记的初始内容，支持Markdown语法。

成功响应:

Code: 201 Created

Body:

{
  "message": "Note 'Work/Meetings/2025-08-06 会议纪要.md' created successfully."
}

错误响应:

400 Bad Request: 请求体缺少 path 或 content。

401 Unauthorized: API Key 认证失败。

409 Conflict: 相同路径的文件已存在。

500 Internal Server Error: 其他服务器内部错误。

示例 curl 命令:

curl -X POST http://localhost:8888/note \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <用户的API_KEY>" \
     -d '{
       "path": "API测试/我的第一个笔记.md",
       "content": "# 欢迎\n\n这是通过API创建的内容。"
     }'

4.3 读取笔记
Endpoint: GET /note

方法: GET

描述: 读取指定路径笔记的完整内容。

认证: 是

请求头:

Authorization: Bearer <用户的API_KEY>

查询参数:

参数名

类型

是否必须

描述

path

string

是

要读取笔记的完整路径。必须进行URL编码。

成功响应:

Code: 200 OK

Body:

{
  "path": "API测试/我的第一个笔记.md",
  "content": "# 欢迎\n\n这是通过API创建的内容。"
}

错误响应:

400 Bad Request: 缺少 path 查询参数。

401 Unauthorized: API Key 认证失败。

404 Not Found: 指定路径的文件不存在。

示例 curl 命令:

# 假设文件名为 "API测试/我的第一个笔记.md", URL编码后为 "API%E6%B5%8B%E8%AF%95%2F%E6%88%91%E7%9A%84%E7%AC%AC%E4%B8%80%E4%B8%AA%E7%AC%94%E8%AE%B0.md"
curl -X GET "http://localhost:8888/note?path=API%E6%B5%8B%E8%AF%95%2F%E6%88%91%E7%9A%84%E7%AC%AC%E4%B8%80%E4%B8%AA%E7%AC%94%E8%AE%B0.md" \
     -H "Authorization: Bearer <用户的API_KEY>"

4.4 更新笔记
Endpoint: PUT /note

方法: PUT

描述: 用新内容完全覆盖一个已存在的笔记。

认证: 是

请求头:

Content-Type: application/json

Authorization: Bearer <用户的API_KEY>

请求体 (JSON):

字段名

类型

是否必须

描述

path

string

是

要更新笔记的完整路径。

content

string

是

将完全覆盖旧内容的新内容。

成功响应:

Code: 200 OK

Body:

{
  "message": "Note 'API测试/我的第一个笔记.md' updated successfully."
}

错误响应:

400 Bad Request: 请求体缺少 path 或 content。

401 Unauthorized: API Key 认证失败。

404 Not Found: 指定路径的文件不存在。

示例 curl 命令:

curl -X PUT http://localhost:8888/note \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <用户的API_KEY>" \
     -d '{
       "path": "API测试/我的第一个笔记.md",
       "content": "# 更新后的标题\n\n内容已被覆盖。"
     }'

4.5 删除笔记
Endpoint: DELETE /note

方法: DELETE

描述: 永久删除一个指定的笔记。

认证: 是

请求头:

Authorization: Bearer <用户的API_KEY>

查询参数:

参数名

类型

是否必须

描述

path

string

是

要删除笔记的完整路径。必须进行URL编码。

成功响应:

Code: 200 OK

Body:

{
  "message": "Note 'API测试/我的第一个笔记.md' deleted successfully."
}

错误响应:

400 Bad Request: 缺少 path 查询参数。

401 Unauthorized: API Key 认证失败。

404 Not Found: 指定路径的文件不存在。

示例 curl 命令:

curl -X DELETE "http://localhost:8888/note?path=API%E6%B5%8B%E8%AF%95%2F%E6%88%91%E7%9A%84%E7%AC%AC%E4%B8%80%E4%B8%AA%E7%AC%94%E8%AE%B0.md" \
     -H "Authorization: Bearer <用户的API_KEY>"
