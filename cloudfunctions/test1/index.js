// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log('云函数开始执行，参数:', event);
    
    // 调用后端接口生成推荐号码
    const response = await axios.post('http://8.153.206.247:8080/select/strategy', {
      count: event.count || 1
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10秒超时
    });

    console.log('后端接口响应:', response.data);
    console.log('响应状态码:', response.status);
    console.log('响应数据结构:', JSON.stringify(response.data, null, 2));

    if (response.data && response.data.code === 200) {
      const result = {
        success: true,
        data: response.data.data
      };
      console.log('云函数返回结果:', result);
      return result;
    } else {
      const result = {
        success: false,
        message: '后端接口返回错误',
        data: response.data
      };
      console.log('云函数返回错误:', result);
      return result;
    }
  } catch (error) {
    console.error('云函数调用失败:', error);
    const result = {
      success: false,
      message: '网络请求失败',
      error: error.message
    };
    console.log('云函数返回异常:', result);
    return result;
  }
};