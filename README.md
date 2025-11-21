# 抽奖系统后端服务

这是一个基于Node.js和Express的抽奖系统后端服务，使用MongoDB作为数据库。

## 项目结构

```
├── .github/workflows/     # GitHub Actions工作流配置
│   └── deploy.yml         # 自动化部署配置
├── models/                # 数据模型
│   ├── User.js            # 用户模型
│   ├── Consumption.js     # 消费记录模型
│   └── Lottery.js         # 抽奖记录模型
├── routes/                # 路由
│   ├── auth.js            # 认证相关路由
│   ├── qr.js              # 二维码相关路由
│   ├── consumption.js     # 消费相关路由
│   ├── lottery.js         # 抽奖相关路由
│   └── user.js            # 用户相关路由
├── .env                   # 环境变量配置
├── package.json           # 项目配置和依赖
└── server.js              # 服务器入口
```

## 技术栈

- Node.js
- Express
- MongoDB + Mongoose
- GitHub Actions (CI/CD)

## 本地开发

### 环境要求

- Node.js 16.x 或更高版本
- MongoDB 本地实例

### 安装步骤

1. 克隆项目

```bash
git clone <repository-url>
cd ChouJiangXiTong
```

2. 安装依赖

```bash
npm install
```

3. 配置环境变量

复制 `.env` 文件并根据需要修改配置：

```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/choujiangxitong
JWT_SECRET=your_jwt_secret_key_here_secure_2024
```

4. 启动开发服务器

```bash
npm run dev
```

## 部署到GitHub

### 准备工作

1. 在MongoDB Atlas创建账户并设置数据库

   - 注册 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - 创建一个新项目和集群
   - 配置数据库用户和网络访问权限
   - 获取连接字符串

2. 在GitHub创建仓库并推送代码

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <github-repository-url>
git push -u origin main
```

### 配置GitHub Secrets

在GitHub仓库的 `Settings > Secrets and variables > Actions` 中配置以下环境变量：

- `MONGO_URI`: MongoDB Atlas连接字符串
- `PORT`: 服务器端口（可选，默认3000）
- `JWT_SECRET`: JWT签名密钥

### 自动化部署

项目已配置GitHub Actions工作流，当代码推送到 `main` 或 `master` 分支时，将自动执行以下操作：

1. 检出代码
2. 设置Node.js环境
3. 安装依赖
4. 运行测试
5. 执行部署步骤

### 自定义部署

如需自定义部署步骤，请修改 `.github/workflows/deploy.yml` 文件中的 `Deploy to production` 步骤。

## API接口

### 认证相关

- `POST /api/auth/login`: 用户登录

### 二维码相关

- `POST /api/qr/validate`: 验证二维码
- `POST /api/qr/generate`: 生成二维码

### 消费相关

- `POST /api/consumption/add`: 添加消费记录
- `GET /api/consumption/history/:phone`: 获取消费记录

### 抽奖相关

- `POST /api/lottery/draw`: 执行抽奖

### 用户相关

- `GET /api/user/data`: 获取用户数据

## 注意事项

1. 确保在生产环境中使用强密码和密钥
2. 定期备份数据库
3. 监控服务器性能和日志
4. 考虑为生产环境添加HTTPS支持

## 许可证

MIT