// info.js
Page({
  data: {
    currentDate: '',
    winningNumbers: [],
    luckyCount: 0,
    recommendationNumbers: [],
    generating: false
  },

  onLoad() {
    this.setCurrentDate();
    this.fetchInfo();
    this.generateRecommendation();
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
  },

  generateRecommendation() {
    this.setData({ generating: true });
    
    wx.cloud.callFunction({
      name: 'test1',
      data: {
        count: 1
      },
      success: (res) => {
        console.log('云函数调用成功:', res);
        console.log('res.result:', res.result);
        console.log('res.result.success:', res.result?.success);
        console.log('res.result.data:', res.result?.data);
        
        if (res.result && res.result.success && res.result.data && res.result.data.length > 0) {
          const recommendation = res.result.data[0];
          console.log('recommendation:', recommendation);
          console.log('recommendation.redBalls:', recommendation?.redBalls);
          
          if (recommendation.redBalls && Array.isArray(recommendation.redBalls)) {
            // 将红球数组转换为字符串数组，并添加一个蓝球（随机生成）
            const redNumbers = recommendation.redBalls.map(num => String(num).padStart(2, '0'));
            const blueNumber = String(Math.floor(Math.random() * 16) + 1).padStart(2, '0');
            const numbers = [...redNumbers, blueNumber];
            console.log('生成的号码:', numbers);
            
            this.setData({
              recommendationNumbers: numbers
            });
          } else {
            console.log('推荐数据格式错误 - redBalls不存在或不是数组');
            wx.showToast({ title: '推荐数据格式错误', icon: 'none' });
          }
        } else {
          console.log('推荐生成失败 - 数据结构不符合预期');
          console.log('success:', res.result?.success);
          console.log('data存在:', !!res.result?.data);
          console.log('data长度:', res.result?.data?.length);
          wx.showToast({ title: '推荐生成失败', icon: 'none' });
        }
      },
      fail: (err) => {
        console.error('云函数调用失败:', err);
        wx.showToast({ title: '推荐生成失败', icon: 'none' });
      },
      complete: () => {
        this.setData({ generating: false });
      }
    });
  }
}); 