const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Consumption = require('../models/Consumption');
const Lottery = require('../models/Lottery');

// 获取用户数据
router.get('/data', async (req, res) => {
  try {
    const { phone } = req.query;
    
    if (!phone) {
      return res.status(400).json({ message: '缺少手机号参数' });
    }
    
    // 查找用户
    const user = await User.findOne({ phone });
    if (!user) {
      // 如果用户不存在，返回默认数据
      return res.json({
        totalAmount: 0,
        usedLotteries: 0,
        lotteryHistory: [],
        consumptionHistory: []
      });
    }
    
    // 获取消费记录
    const consumptionHistory = await Consumption
      .find({ phone })
      .sort({ createdAt: -1 })
      .select('time amount qrSignature');
    
    // 获取抽奖记录
    const lotteryHistory = await Lottery
      .find({ phone })
      .sort({ createdAt: -1 })
      .select('time prize probability');
    
    res.json({
      totalAmount: user.totalAmount,
      usedLotteries: user.usedLotteries,
      lotteryHistory,
      consumptionHistory
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;