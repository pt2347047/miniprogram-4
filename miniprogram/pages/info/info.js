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
        
        // 检查云函数返回的原始数据结构
        if (res.result) {
          console.log('云函数返回的完整数据结构:', JSON.stringify(res.result, null, 2));
          
          // 尝试不同的数据结构
          let recommendationData = null;
          
          // 方式1: 检查是否有包装的success/data结构
          if (res.result.success && res.result.data && res.result.data.length > 0) {
            recommendationData = res.result.data[0];
          }
          // 方式2: 检查是否直接返回了数组
          else if (Array.isArray(res.result) && res.result.length > 0) {
            recommendationData = res.result[0];
          }
          // 方式3: 检查是否直接返回了对象
          else if (res.result.data && Array.isArray(res.result.data) && res.result.data.length > 0) {
            recommendationData = res.result.data[0];
          }
          // 方式4: 检查是否直接返回了单个对象
          else if (res.result.redBalls) {
            recommendationData = res.result;
          }
          
          console.log('提取的推荐数据:', recommendationData);
          
          if (recommendationData && recommendationData.redBalls && Array.isArray(recommendationData.redBalls)) {
            // 将红球数组转换为字符串数组，并添加一个蓝球（随机生成）
            const redNumbers = recommendationData.redBalls.map(num => String(num).padStart(2, '0'));
            const blueNumber = String(Math.floor(Math.random() * 16) + 1).padStart(2, '0');
            const numbers = [...redNumbers, blueNumber];
            console.log('生成的号码:', numbers);
            
            this.setData({
              recommendationNumbers: numbers
            });
          } else {
            console.log('推荐数据格式错误 - 无法找到有效的redBalls数据');
            console.log('recommendationData:', recommendationData);
            wx.showToast({ title: '推荐数据格式错误', icon: 'none' });
          }
        } else {
          console.log('推荐生成失败 - res.result为空');
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