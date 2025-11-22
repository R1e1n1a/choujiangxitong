const express = require('express');
const router = express.Router();
const qrcode = require('qrcode');

// 验证二维码
router.post('/validate', (req, res) => {
  try {
    const { qrData, phone } = req.body; // 接收phone参数
    
    // 解码base64编码的二维码数据
    let decodedData;
    try {
      decodedData = JSON.parse(Buffer.from(qrData, 'base64').toString('utf-8'));
    } catch (error) {
      return res.status(400).json({ valid: false, error: '无效的二维码数据' });
    }
    
    // 验证二维码数据的有效性
    if (!decodedData.amount || !decodedData.timestamp || !decodedData.order_id) {
      return res.status(400).json({ valid: false, error: '二维码数据不完整' });
    }
    
    // 验证金额是否有效
    const amount = parseFloat(decodedData.amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ valid: false, error: '无效的消费金额' });
    }
    
    // 模拟验证签名（实际应用中应使用更安全的验证方式）
    const isValidSignature = decodedData.signature && decodedData.signature.length > 0;
    
    if (!isValidSignature) {
      return res.status(400).json({ valid: false, error: '无效的签名' });
    }
    
    res.json({
      valid: true,
      amount: amount,
      signature: decodedData.signature
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ valid: false, error: '服务器错误' });
  }
});

// 生成二维码
router.post('/generate', async (req, res) => {
  try {
    const { amount, store_id } = req.body;
    
    // 验证参数
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: '请提供有效的消费金额' });
    }
    
    if (!store_id) {
      return res.status(400).json({ message: '请提供商店ID' });
    }
    
    // 创建二维码数据
    const qrData = {
      amount: parseFloat(amount),
      timestamp: Date.now(),
      store_id: store_id,
      order_id: `order_${Date.now()}`,
      signature: `sig_${Math.random().toString(36).substring(2, 15)}` // 生成随机签名
    };
    
    // 将数据转换为base64
    const jsonData = JSON.stringify(qrData);
    const base64Data = Buffer.from(jsonData).toString('base64');
    
    // 生成二维码图像（返回data URL）
    const qrImageUrl = await qrcode.toDataURL(base64Data);
    
    res.json({
      success: true,
      qrData: base64Data,
      qrImageUrl: qrImageUrl,
      order_id: qrData.order_id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '生成二维码失败' });
  }
});

module.exports = router;