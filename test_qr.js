// 测试二维码生成脚本
const qrcode = require('qrcode');

// 创建符合验证要求的二维码数据
const createValidQRData = (amount = 100) => {
  const qrData = {
    amount: parseFloat(amount),
    timestamp: Date.now(),
    store_id: 'store_001',
    order_id: `order_${Date.now()}`,
    signature: `sig_${Math.random().toString(36).substring(2, 15)}`
  };
  
  // 转换为base64
  const jsonData = JSON.stringify(qrData);
  const base64Data = Buffer.from(jsonData).toString('base64');
  
  return {
    originalData: qrData,
    base64Data: base64Data
  };
};

// 生成有效的二维码示例
const validQR = createValidQRData(100);
console.log('有效的二维码原始数据:');
console.log(validQR.originalData);
console.log('\nBase64编码的数据 (扫描到的内容):');
console.log(validQR.base64Data);
console.log('\n解码后的数据 (用于验证):');
console.log(JSON.parse(Buffer.from(validQR.base64Data, 'base64').toString('utf-8')));

// 生成无效的二维码示例（缺少字段）
const invalidQRData = {
  amount: 100,
  // 缺少timestamp和order_id
  signature: 'invalid_sig'
};
const invalidBase64 = Buffer.from(JSON.stringify(invalidQRData)).toString('base64');
console.log('\n无效的二维码base64数据 (缺少必要字段):');
console.log(invalidBase64);

// 生成二维码图像并保存到控制台 (仅用于测试)
qrcode.toDataURL(validQR.base64Data, (err, url) => {
  if (err) {
    console.error('生成二维码失败:', err);
  } else {
    console.log('\n二维码图像已生成 (Data URL)');
  }
});

// 保存二维码到文件
const fs = require('fs');
const path = require('path');

// 创建output目录（如果不存在）
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// 生成唯一的文件名
const fileName = `qr_code_${Date.now()}.png`;
const filePath = path.join(outputDir, fileName);

// 保存二维码到文件
qrcode.toFile(filePath, validQR.base64Data, { width: 300, margin: 1 }, (err) => {
  if (err) {
    console.error('保存二维码到文件失败:', err);
  } else {
    console.log(`\n二维码已成功保存到文件: ${filePath}`);
  }
});