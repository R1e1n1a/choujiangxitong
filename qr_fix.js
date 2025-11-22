// 二维码功能修复说明

// 问题分析：
// 1. API配置问题 - 前端API_CONFIG.BASE_URL指向了可能无法访问的远程地址
// 2. 参数不匹配 - 前端apiValidateQR函数传递了phone参数，但后端未处理
// 3. 错误处理不完善 - 可能存在静默失败的情况
// 4. 缺少本地测试选项

// 修复方案：

// 1. 更新API配置 - 修改index.html中的API_CONFIG
// 将:
// const API_CONFIG = {
//     BASE_URL: "https://lottery-app-ochre.vercel.app/api", // 请替换为实际部署的API服务器地址
//     ENDPOINTS: {
//         LOGIN: "/auth/login",
//         VALIDATE_QR: "/qr/validate",
//         ADD_CONSUMPTION: "/consumption/add",
//         GET_USER_DATA: "/user/data",
//         LOTTERY: "/lottery/draw"
//     }
// };

// 改为本地开发地址（如果在本地运行服务器）:
// const API_CONFIG = {
//     BASE_URL: "http://localhost:3000/api", // 本地开发环境地址
//     ENDPOINTS: {
//         LOGIN: "/auth/login",
//         VALIDATE_QR: "/qr/validate",
//         ADD_CONSUMPTION: "/consumption/add",
//         GET_USER_DATA: "/user/data",
//         LOTTERY: "/lottery/draw"
//     }
// };

// 2. 修改后端qr.js中的验证路由，处理phone参数
// 修改routes/qr.js中的/validate路由：
// router.post('/validate', (req, res) => {
//   try {
//     const { qrData, phone } = req.body; // 接收phone参数
//     
//     // 其余代码不变...
//     
//     res.json({
//       valid: true,
//       amount: amount,
//       signature: decodedData.signature
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ valid: false, error: '服务器错误' });
//   }
// });

// 3. 增强前端错误处理
// 修改scanQRCode函数，添加更多调试信息：
// async function scanQRCode() {
//   if (!scanning) return;
//   
//   // 其余代码不变...
//   
//   if (code) {
//     // 找到二维码
//     const qrContent = code.data;
//     console.log('扫描到的二维码内容:', qrContent); // 添加调试信息
//     
//     // 停止扫描
//     stopQRScan();
//     
//     try {
//       // 验证二维码
//       console.log('开始验证二维码...');
//       const validation = await apiValidateQR(qrContent);
//       console.log('验证结果:', validation);
//       
//       if (validation.valid) {
//         // 显示扫描结果
//         lotteryInfo.textContent = `扫描成功: ${validation.amount}元`;
//         lotteryInfo.style.color = "#28a745";
//         
//         // 添加消费记录
//         await addConsumptionRecord(validation.amount, validation.signature);
//       } else {
//         // 显示错误
//         lotteryInfo.textContent = validation.error || '二维码验证失败';
//         lotteryInfo.style.color = "#dc3545";
//       }
//     } catch (error) {
//       console.error("二维码验证失败:", error);
//       // 显示更详细的错误信息
//       lotteryInfo.textContent = `验证失败: ${error.message || '未知错误'}`;
//       lotteryInfo.style.color = "#dc3545";
//     }
//     
//     // 2秒后自动恢复扫描状态
//     setTimeout(() => {
//       lotteryInfo.textContent = "累计消费每满100元可获得一次抽奖机会，最多50次";
//       lotteryInfo.style.color = "#6c757d";
//     }, 2000);
//   }
// }

// 4. 本地测试方法
// 创建一个简单的HTML页面用于测试二维码扫描，使用我们刚才生成的有效二维码数据：
// 有效二维码数据格式：base64编码的JSON字符串，包含amount、timestamp、store_id、order_id和signature字段