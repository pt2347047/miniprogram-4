// app.js
App({
  onLaunch() {
    wx.cloud.init({
      env: 'cloud1-5gs8pvjtdbeade44', // 在云开发控制台查看
      traceUser: true,     // 记录用户访问
    });
  }
});