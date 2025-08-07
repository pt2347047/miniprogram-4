// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log('云函数开始执行，参数:', event);
    
    const { type, count, redBalls, blueBall, redBallCount, blueBallCount } = event;
    
    let url = '';
    let requestData = { count };
    
    // 根据类型选择不同的API端点
    switch (type) {
      case 'random':
        url = 'http://8.153.206.247:8080/api/select/pure-random';
        break;
      case 'specify':
        url = 'http://8.153.206.247:8080/api/select/pure-random';
        if (redBalls && redBalls.length > 0) {
          requestData.redBalls = redBalls;
        }
        if (blueBall !== null && blueBall !== undefined) {
          requestData.blueBall = blueBall;
        }
        break;
      case 'history':
        url = 'http://8.153.206.247:8080/api/select/random';
        if (redBalls && redBalls.length > 0) {
          requestData.redBalls = redBalls;
        }
        if (blueBall !== null && blueBall !== undefined) {
          requestData.blueBall = blueBall;
        }
        if (redBallCount !== undefined) {
          requestData.redBallCount = redBallCount;
        }
        if (blueBallCount !== undefined) {
          requestData.blueBallCount = blueBallCount;
        }
        break;
      default:
        return {
          success: false,
          message: '未知的请求类型'
        };
    }
    
    console.log('请求URL:', url);
    console.log('请求数据:', JSON.stringify(requestData, null, 2));
    
    // 调用后端接口
    const response = await axios.post(url, requestData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 2500 // 减少超时时间，避免云函数超时
    });

    console.log('后端接口响应:', response.data);
    
    if (response.data && response.data.code === 200) {
      const result = {
        success: true,
        data: response.data.data
      };
      console.log('云函数返回结果:', result);
      return result;
    } else {
      return {
        success: false,
        message: '后端接口返回错误',
        data: response.data
      };
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