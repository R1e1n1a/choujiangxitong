const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 生成验证码
router.post('/send-code', async (req, res) => {
  try {
    const { phone } = req.body;
    
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: '请输入有效的手机号' });
    }
    
    // 生成6位数字验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5分钟过期
    
    // 更新或创建用户，保存验证码信息
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ 
        phone, 
        verificationCode: code, 
        codeExpiresAt: expiresAt 
      });
    } else {
      user.verificationCode = code;
      user.codeExpiresAt = expiresAt;
    }
    await user.save();
    
    // 在实际应用中，这里应该调用短信服务发送验证码
    console.log(`向手机号 ${phone} 发送验证码: ${code}`);
    
    res.json({ 
      success: true, 
      message: '验证码已发送（实际开发中会发送到手机）',
      // 仅在开发环境返回验证码用于测试
      developmentCode: code 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '发送验证码失败' });
  }
});

// 简化的手机号登录/注册
router.post('/login', async (req, res) => {
  try {
    console.log('收到登录请求:', req.body);
    const { phone } = req.body;
    
    // 验证参数
    if (!phone) {
      return res.status(400).json({ message: '请提供手机号' });
    }
    
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: '请输入有效的手机号' });
    }
    
    // 查找或创建用户
    let user = await User.findOne({ phone });
    if (!user) {
      console.log('创建新用户:', phone);
      user = new User({ phone });
      await user.save();
      console.log('新用户创建成功');
    }
    
    console.log('登录成功:', phone);
    res.json({ success: true, message: '登录成功', userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;