// 部署后测试脚本
// 用途：验证API服务是否正常运行并连接到MongoDB Atlas

const axios = require('axios');
require('dotenv').config();

// 配置测试参数
const API_BASE_URL = process.env.API_URL || 'http://localhost:3000'; // 部署后的API地址
const TEST_PHONE = '13800138000'; // 用于测试的手机号

// 测试结果计数器
let successCount = 0;
let failureCount = 0;

console.log('开始测试部署...');
console.log(`测试目标: ${API_BASE_URL}`);
console.log('===============================');

// 测试函数
async function runTests() {
  try {
    // 测试1: 健康检查（如果有）
    await testEndpoint('/api/health', 'GET', null, '健康检查');
    
    // 测试2: 用户登录
    await testLogin();
    
    // 测试3: 尝试获取用户数据（需要先登录）
    // await testUserData(userId);
    
    // 测试4: MongoDB连接测试（通过API间接测试）
    await testMongoDBConnection();
    
    console.log('===============================');
    console.log('测试完成!');
    console.log(`成功: ${successCount}, 失败: ${failureCount}`);
    
    if (failureCount === 0) {
      console.log('✅ 所有测试通过! 服务部署成功!');
    } else {
      console.log('❌ 部分测试失败，请检查日志并修复问题。');
    }
    
  } catch (error) {
    console.error('测试过程中发生错误:', error.message);
  }
}

// 通用端点测试函数
async function testEndpoint(endpoint, method, data, description) {
  console.log(`\n测试: ${description} (${method} ${endpoint})`);
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data ? JSON.stringify(data) : undefined,
      timeout: 10000, // 10秒超时
    };
    
    const response = await axios(config);
    console.log(`✅ ${description} 成功!`);
    console.log(`状态码: ${response.status}`);
    console.log('响应数据:', response.data);
    successCount++;
    return response.data;
  } catch (error) {
    console.log(`❌ ${description} 失败!`);
    if (error.response) {
      console.log(`状态码: ${error.response.status}`);
      console.log('错误数据:', error.response.data);
    } else if (error.request) {
      console.log('请求已发送但没有收到响应');
    } else {
      console.log('请求配置错误:', error.message);
    }
    failureCount++;
    return null;
  }
}

// 测试登录功能
async function testLogin() {
  console.log('\n测试: 用户登录功能');
  try {
    const loginData = {
      phone: TEST_PHONE
    };
    
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, loginData, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
    
    console.log('✅ 登录成功!');
    console.log('响应数据:', response.data);
    
    if (response.data.userId) {
      console.log(`获取到用户ID: ${response.data.userId}`);
    }
    
    successCount++;
    return response.data.userId;
  } catch (error) {
    console.log('❌ 登录测试失败!');
    if (error.response) {
      console.log(`状态码: ${error.response.status}`);
      console.log('错误信息:', error.response.data);
    } else {
      console.log('错误详情:', error.message);
    }
    failureCount++;
    return null;
  }
}

// 测试MongoDB连接（通过尝试查询数据）
async function testMongoDBConnection() {
  console.log('\n测试: MongoDB连接 (通过查询用户数据)');
  try {
    const response = await axios.get(`${API_BASE_URL}/api/user/data?phone=${TEST_PHONE}`, {
      timeout: 15000 // 给数据库操作更多时间
    });
    
    console.log('✅ MongoDB连接测试成功!');
    console.log('查询结果:', response.data);
    successCount++;
  } catch (error) {
    console.log('❌ MongoDB连接测试失败!');
    if (error.response) {
      console.log(`状态码: ${error.response.status}`);
      console.log('错误信息:', error.response.data);
    } else if (error.message.includes('timeout')) {
      console.log('数据库连接超时，可能是网络问题或MongoDB Atlas配置问题');
      console.log('请检查:');
      console.log('1. MongoDB Atlas的网络访问设置（是否允许部署环境IP）');
      console.log('2. 连接字符串是否正确');
      console.log('3. MongoDB Atlas服务是否正常');
    } else {
      console.log('错误详情:', error.message);
    }
    failureCount++;
  }
}

// 运行测试
runTests();

// 使用说明：
// 1. 确保已安装axios: npm install axios
// 2. 配置API_URL环境变量指向部署后的服务地址
// 3. 运行命令: node test_deployment.js