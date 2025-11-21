const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Consumption = require('../models/Consumption');

// 添加消费记录
router.post('/add', async (req, res) => {
  try {
    const { phone, amount, qrSignature } = req.body;
    
    // 验证参数
    if (!phone || !amount) {
      return res.status(400).json({ message: '缺少必要参数' });
    }
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      return res.status(400).json({ message: '无效的消费金额' });
    }
    
    // 查找用户
    let user = await User.findOne({ phone });
    if (!user) {
      // 如果用户不存在，创建新用户
      user = new User({ phone });
    }
    
    // 更新用户总消费金额
    user.totalAmount += amountValue;
    user.updatedAt = Date.now();
    await user.save();
    
    // 创建消费记录
    const consumption = new Consumption({
      phone,
      amount: amountValue,
      qrSignature
    });
    await consumption.save();
    
    res.json({
      success: true,
      totalAmount: user.totalAmount,
      message: '消费记录添加成功'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取用户消费记录
router.get('/history/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    
    if (!phone) {
      return res.status(400).json({ message: '缺少手机号参数' });
    }
    
    // 查询用户的消费记录，按时间倒序排列
    const records = await Consumption.find({ phone })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    
    // 获取总记录数
    const totalRecords = await Consumption.countDocuments({ phone });
    
    res.json({
      success: true,
      records,
      total: totalRecords,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '获取消费记录失败' });
  }
});

module.exports = router;