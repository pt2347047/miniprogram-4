// info.js
Page({
  data: {
    currentDate: '',
    winningNumbers: [],
    luckyCount: 0
  },

  onLoad() {
    this.setCurrentDate();
    this.fetchInfo();
  },

  setCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];
    
    this.setData({
      currentDate: `${year}年${month}月${day}日 ${weekday}`
    });
  },

  fetchInfo() {
    wx.request({
      url: 'https://jisucpkj.market.alicloudapi.com/caipiao/query',
      method: 'GET',
      header: {
        'Authorization': 'APPCODE 0b6c35c2eb9f41889ea47c285dd20f87'
      },
      data: {
        caipiaoid: 11
      },
      success: (res) => {
        if (res.data && res.data.status === 0 && res.data.result) {
          const result = res.data.result;
          // 红球号码
          const redNumbers = result.number.split(/\s+/).filter(num => num);
          // 蓝球号码
          const blueNumber = result.refernumber;
          const numbers = [...redNumbers, blueNumber];
          // 幸运人数取一等奖人数
          let luckyCount = 0;
          if (Array.isArray(result.prize)) {
            const firstPrize = result.prize.find(item => item.prizename === '一等奖');
            if (firstPrize) {
              luckyCount = firstPrize.num;
            }
          }
          this.setData({
            winningNumbers: numbers,
            luckyCount
          });
        } else {
          wx.showToast({ title: '信息获取失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '信息获取失败', icon: 'none' });
      }
    });
  }
}); 