// lucky.js
Page({
  data: {
    activeTab: 'lucky', // 默认显示每日幸运tab
    desc: '',
    lotteryNumbers: [],
    recommendation: '',
    loading: false,
    hasGenerated: false,
    shareList: [
      {
        id: 1,
        userName: "幸运星",
        avatar: "/images/avatar1.png",
        content: "今天运气不错，买彩票中了小奖！希望明天继续好运！",
        time: "2小时前",
        likeCount: 12,
        isLiked: false
      },
      {
        id: 2,
        userName: "梦想家",
        avatar: "/images/avatar2.png",
        content: "分享一个幸运小技巧：每天保持好心情，运气自然来敲门！",
        time: "4小时前",
        likeCount: 8,
        isLiked: true
      },
      {
        id: 3,
        userName: "快乐每一天",
        avatar: "/images/avatar3.png",
        content: "今天遇到很多好人好事，感觉整个世界都在对我微笑！",
        time: "6小时前",
        likeCount: 15,
        isLiked: false
      },
      {
        id: 4,
        userName: "幸运儿",
        avatar: "/images/avatar4.png",
        content: "坚持每天做一件好事，好运自然会降临！",
        time: "8小时前",
        likeCount: 20,
        isLiked: false
      }
    ]
  },
  // Tab切换
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  onInput(e) {
    this.setData({ desc: e.detail.value });
  },

  toggleLike(e) {
    const id = e.currentTarget.dataset.id;
    const shareList = this.data.shareList.map(item => {
      if (item.id === id) {
        return {
          ...item,
          isLiked: !item.isLiked,
          likeCount: item.isLiked ? item.likeCount - 1 : item.likeCount + 1
        };
      }
      return item;
    });
    this.setData({ shareList });
  },
  onSubmit() {
    const desc = this.data.desc.trim();
    if (!desc) {
      wx.showToast({ title: '请输入描述', icon: 'none' });
      return;
    }
    this.setData({ loading: true, lotteryNumbers: [], recommendation: '' });
    wx.request({
      url: 'https://api.coze.cn/v1/workflow/run',
      method: 'POST',
      header: {
        'Authorization': 'Bearer pat_7mftD5otJeN0XKpuv85UOXJKeStekGnQUrJIUdhNSf6pJDCjU5JzTtrcUEAHmywr',
        'Content-Type': 'application/json'
      },
      data: {
        workflow_id: '7530299255577690153',
        parameters: {
          input: this.data.desc
        }
      },
      success: (res) => {
        console.log('API返回：', res);
        let output = '';
        try {
          const dataObj = typeof res.data?.data === 'string' ? JSON.parse(res.data.data) : res.data?.data;
          output = dataObj?.output;
        } catch (e) {
          console.error('解析output失败', e);
        }
        console.log('output内容：', output);
        
        if (output && Array.isArray(output) && output.length >= 2) {
          const numbersStr = output[0];
          const parts = numbersStr.split('+');
          if (parts.length === 2) {
            const redNumbers = parts[0].trim().split(/\s+/).filter(num => num);
            const blueNumber = parts[1].trim();
            const numbers = [...redNumbers, blueNumber];
            this.setData({ 
              lotteryNumbers: numbers,
              recommendation: output[1],
              hasGenerated: true
            });
          } else {
            const numbers = numbersStr.split(/[\s+]+/).filter(num => num);
            this.setData({ 
              lotteryNumbers: numbers,
              recommendation: output[1],
              hasGenerated: true
            });
          }
        } else if (output) {
          wx.showModal({ title: '结果', content: output, showCancel: false });
        } else {
          wx.showToast({ title: '未获取到数据', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '请求失败', icon: 'none' });
      },
      complete: () => {
        this.setData({ loading: false });
      }
    });
  }
}); 