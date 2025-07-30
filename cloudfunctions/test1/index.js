// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// cloudfunctions/test/index.js
exports.main = async (event, context) => {
  return {
    message: '云函数调用成功',
    data: event // 返回接收的参数
  };
};