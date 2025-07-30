// index.js
Page({
  data: {},
  
  navigateToLucky() {
    wx.switchTab({
      url: '/pages/lucky/lucky'
    });
  },
  
  navigateToShare() {
    wx.switchTab({
      url: '/pages/share/share'
    });
  },
  
  navigateToInfo() {
    wx.switchTab({
      url: '/pages/info/info'
    });
  },
  
  navigateToProfile() {
    wx.switchTab({
      url: '/pages/profile/profile'
    });
  },

  callCloudFunction() {
    wx.cloud.callFunction({
      name: 'test',      // 云函数名称
      data: { foo: 'bar' }, // 传递参数
      success(res) {
        console.log('云函数返回:', res.result);
      },
      fail(err) {
        console.error('调用失败:', err);
      }
    });
  }
});
