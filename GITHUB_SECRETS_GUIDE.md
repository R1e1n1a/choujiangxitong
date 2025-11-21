# GitHub Secrets配置详细指南

本文档提供在GitHub仓库中配置Secrets和环境变量的详细步骤，确保您的抽奖系统能够正确连接到MongoDB Atlas。

## 配置步骤

### 1. 访问GitHub仓库设置

- 登录GitHub账号并进入您的抽奖系统仓库
- 点击仓库页面顶部的「Settings」标签

### 2. 导航到Secrets配置页面

- 在左侧菜单中找到并点击「Secrets and variables」
- 从下拉菜单中选择「Actions」
- 您将看到当前已配置的secrets列表（如果有）

### 3. 添加必要的环境变量

对于抽奖系统，您需要添加以下四个关键环境变量：

#### 3.1 MONGO_URI

这是连接到MongoDB Atlas数据库的关键配置：

- 点击「New repository secret」
- **Name** 字段输入：`MONGO_URI`
- **Secret** 字段粘贴以下连接字符串：
  ```
  mongodb+srv://SHCS:QqWwEeRrTtYy@lottery-app.1ff0jrr.mongodb.net/?appName=Lottery-App
  ```
- 点击「Add secret」按钮保存

#### 3.2 PORT

设置服务器监听端口：

- 再次点击「New repository secret」
- **Name** 字段输入：`PORT`
- **Secret** 字段输入：`3000`（或您希望使用的其他端口）
- 点击「Add secret」按钮保存

#### 3.3 JWT_SECRET

设置用于JWT令牌签名的密钥：

- 再次点击「New repository secret」
- **Name** 字段输入：`JWT_SECRET`
- **Secret** 字段输入一个强随机字符串，例如：
  ```
  your_jwt_secret_key_here_secure_2024_random_string_12345
  ```
- 点击「Add secret」按钮保存

#### 3.4 NODE_ENV

设置Node.js环境模式：

- 最后一次点击「New repository secret」
- **Name** 字段输入：`NODE_ENV`
- **Secret** 字段输入：`production`
- 点击「Add secret」按钮保存

## 配置验证

配置完成后，您应该在Secrets列表中看到以下四个条目：

- `MONGO_URI`
- `PORT`
- `JWT_SECRET`
- `NODE_ENV`

## 安全注意事项

- **永远不要**在代码中直接硬编码这些敏感信息
- **不要**将包含这些secrets的.env文件提交到版本控制
- 定期更新您的JWT_SECRET以增强安全性
- 确保只有授权人员能够访问GitHub仓库的Settings

## 故障排除

如果部署后遇到连接问题：

1. 确认所有secrets名称完全正确（区分大小写）
2. 验证MongoDB Atlas连接字符串是否正确无误
3. 检查MongoDB Atlas中的网络访问设置，确保GitHub Actions能够连接
4. 查看GitHub Actions运行日志获取详细错误信息

## 后续更新

当您需要更新任何配置时：

1. 在Secrets页面找到需要更新的条目
2. 点击右侧的「Update」按钮
3. 修改值后点击「Update secret」保存

这些更新将在下次GitHub Actions工作流运行时自动应用到部署环境中。