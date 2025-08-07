// index.js
Page({
  data: {
    announcement: "郑重声明： 本小程序不设计提供线上售彩、代售彩、引导购彩、推荐、模拟、竞猜等服务，所提供的开奖相关数据均来自于中国福彩网(http://www.cwl.gov.cn)、中国体彩网(https://www.lottery.gov.cn)",
    showAnnouncementDetail: false,
    currentAnnouncement: null
  },
  
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
