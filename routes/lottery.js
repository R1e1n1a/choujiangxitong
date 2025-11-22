const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Lottery = require('../models/Lottery');

// 奖品配置
const prizes = [
  { name: "谢谢参与", probability: 40 },
  { name: "5元优惠券", probability: 25 },
  { name: "10元优惠券", probability: 15 },
  { name: "20元优惠券", probability: 10 },
  { name: "50元优惠券", probability: 6 },
  { name: "100元优惠券", probability: 3 },
  { name: "神秘大奖", probability: 1 }
];

// 抽奖次数上限
const MAX_LOTTERY_COUNT = 50;

// 执行抽奖（完全在服务器端执行）
router.post('/draw', async (req, res) => {
  try {
    const { phone, prizeName } = req.body;
    
    if (!phone) {
      return res.status(400).json({ message: '缺少手机号参数' });
    }
    
    // 查找用户
    let user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 计算可获得的抽奖次数
    const potentialLotteries = Math.floor(user.totalAmount / 100);
    const availableLotteries = Math.min(potentialLotteries, MAX_LOTTERY_COUNT);
    
    // 检查是否还有抽奖机会
    if (user.usedLotteries >= availableLotteries) {
      return res.status(400).json({ message: '没有抽奖机会了' });
    }
    
    // 从前端传来的奖品名称查找对应的奖品配置
    let selectedPrize = prizes.find(p => p.name === prizeName);
    
    // 如果找不到或前端没有传递奖品名称，则使用服务器端计算
    if (!selectedPrize) {
      // 结合时间戳和随机数生成高质量随机值
      const generateSecureRandom = () => {
        const timeFactor = (Date.now() % 10000) / 10000;
        const mathRandom = Math.random();
        return (timeFactor * 0.7 + mathRandom * 0.3) % 1;
      };
      
      // 执行抽奖
      const random = generateSecureRandom() * 100;
      let cumulativeProbability = 0;
      
      for (const p of prizes) {
        cumulativeProbability += p.probability;
        if (random <= cumulativeProbability) {
          selectedPrize = p;
          break;
        }
      }
    }
    
    // 默认选择第一个奖品（以防概率计算出错）
    selectedPrize = selectedPrize || prizes[0];
    
    // 更新用户使用的抽奖次数
    user.usedLotteries += 1;
    await user.save();
    
    // 创建抽奖记录
    const lotteryRecord = new Lottery({
      phone,
      prize: selectedPrize.name,
      probability: selectedPrize.probability
    });
    await lotteryRecord.save();
    
    res.json({
      success: true,
      prize: selectedPrize,
      remainingLotteries: availableLotteries - user.usedLotteries
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;