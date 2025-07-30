// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 调用后端接口生成推荐号码
    const response = await axios.post('http://8.153.206.247:8080/select/strategy', {
      count: event.count || 1
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10秒超时
    });

    if (response.data && response.data.code === 200) {
      return {
        success: true,
        data: response.data.data
      };
    } else {
      return {
        success: false,
        message: '后端接口返回错误',
        data: response.data
      };
    }
  } catch (error) {
    console.error('云函数调用失败:', error);
    return {
      success: false,
      message: '网络请求失败',
      error: error.message
    };
  }
};