# 抽奖系统GitHub部署详细指南

本文档提供使用MongoDB Atlas和GitHub Actions进行部署的详细步骤。

## 第一步：创建GitHub仓库

1. 登录您的GitHub账户
2. 点击右上角的「+」号，选择「New repository」
3. 填写仓库信息：
   - Repository name: 例如 `choujiangxitong`
   - Description: 抽奖系统后端服务
   - 选择 Public 或 Private
   - 不要勾选「Add a README file」（我们将上传现有的README）
   - 点击「Create repository」

## 第二步：准备本地代码并初始化Git

在您的项目目录中执行以下命令（已配置好git环境的情况下）：

```bash
# 初始化Git仓库（如果尚未初始化）
git init

# 添加.gitignore文件（如果没有）
echo "node_modules/
.env
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local" > .gitignore

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit with GitHub deployment configuration"

# 添加远程仓库（替换为您的GitHub仓库URL）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# 推送代码到GitHub
git push -u origin main
```

## 第三步：配置GitHub Secrets

在GitHub仓库页面中：

1. 点击「Settings」标签
2. 在左侧菜单中选择「Secrets and variables」→「Actions」
3. 点击「New repository secret」
4. 添加以下必要的环境变量：

   - **Name**: MONGO_URI
     **Value**: `mongodb+srv://SHCS:QqWwEeRrTtYy@lottery-app.1ff0jrr.mongodb.net/?appName=Lottery-App`

   - **Name**: PORT
     **Value**: `3000`

   - **Name**: JWT_SECRET
     **Value**: 一个安全的随机字符串，例如 `your_jwt_secret_key_here_secure_2024`

   - **Name**: NODE_ENV
     **Value**: `production`

5. 为每个secret点击「Add secret」

## 第四步：配置MongoDB Atlas网络访问

为确保GitHub Actions能够连接到MongoDB Atlas：

1. 登录MongoDB Atlas账户
2. 导航到您的项目和集群
3. 点击「Network Access」
4. 点击「Add IP Address」
5. 选择「Allow access from anywhere」或添加GitHub Actions的IP范围
6. 点击「Confirm」

## 第五步：验证GitHub Actions工作流

GitHub Actions工作流配置已在`.github/workflows/deploy.yml`中设置。当您推送代码到`main`或`master`分支时，工作流将自动触发。

要手动触发工作流：
1. 点击「Actions」标签
2. 选择「Deploy to Production」工作流
3. 点击「Run workflow」下拉菜单
4. 选择分支并点击「Run workflow」按钮

## 第六步：测试部署

部署完成后，您可以通过以下方式验证服务是否正常运行：

1. 在GitHub Actions运行日志中查看部署状态
2. 使用curl或Postman测试API端点（如果有部署URL）

## 常见问题排查

1. **MongoDB连接错误**：
   - 确认MONGO_URI正确配置在GitHub Secrets中
   - 检查MongoDB Atlas的网络访问设置
   - 验证数据库用户权限

2. **GitHub Actions失败**：
   - 查看工作流运行日志获取详细错误信息
   - 确保所有环境变量正确配置
   - 检查package.json中的脚本是否正确

3. **服务启动问题**：
   - 确认端口未被占用
   - 检查依赖是否正确安装
   - 查看服务器日志获取错误详情

## 后续维护

- 定期更新依赖包版本
- 监控GitHub Actions工作流状态
- 备份MongoDB数据库
- 定期审查代码和安全设置