// 测试登录API
const http = require('http');

function testLogin() {
    const phone = '13800138000'; // 测试手机号
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    console.log(`测试登录API: http://${options.hostname}:${options.port}${options.path}`);
    console.log(`请求参数: phone=${phone}`);
    
    const req = http.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log(`响应状态码: ${res.statusCode}`);
            try {
                const jsonData = JSON.parse(data);
                console.log('响应数据:', JSON.stringify(jsonData, null, 2));
                
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log('✅ 登录测试成功!');
                } else {
                    console.log('❌ 登录测试失败:', jsonData.message || '未知错误');
                }
            } catch (error) {
                console.log('响应内容:', data);
                console.error('❌ 解析响应数据失败:', error.message);
            }
        });
    });
    
    req.on('error', (error) => {
        console.error('❌ 登录测试异常:', error.message);
    });
    
    req.write(JSON.stringify({ phone }));
    req.end();
}

// 运行测试
testLogin();