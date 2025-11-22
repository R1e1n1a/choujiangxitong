// 设置时区为UTC+8（中国标准时间）
process.env.TZ = 'Asia/Shanghai';

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors({
  origin: '*', // 允许所有域名访问，解决跨域问题
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// 请求限流配置
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个IP限制15分钟内最多100个请求
  message: '请求过于频繁，请稍后再试',
  standardHeaders: true,
  legacyHeaders: false,
});

// 对API路由应用限流
app.use('/api/', apiLimiter);

// 为敏感接口添加更严格的限流
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1小时
  max: 5, // 每个IP限制1小时内最多5次登录尝试
  message: '验证码发送过于频繁，请1小时后再试',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth/send-code', authLimiter);

// 连接数据库 - 支持MongoDB Atlas配置
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority',
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4 // 使用IPv4以避免潜在的DNS解析问题
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, '数据库连接错误:'));
db.once('open', () => {
  console.log('成功连接到数据库');
});

// 引入路由
const authRoutes = require('./routes/auth');
const qrRoutes = require('./routes/qr');
const consumptionRoutes = require('./routes/consumption');
const userRoutes = require('./routes/user');
const lotteryRoutes = require('./routes/lottery');

// 使用路由
app.use('/api/auth', authRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/consumption', consumptionRoutes);
app.use('/api/user', userRoutes);
app.use('/api/lottery', lotteryRoutes);

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器正在运行，端口号: ${PORT}`);
});