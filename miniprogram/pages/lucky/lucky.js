// lucky.js
Page({
  data: {
    desc: '',
    lotteryNumbers: [],
    recommendation: '',
    loading: false,
    hasGenerated: false
  },
  onInput(e) {
    this.setData({ desc: e.detail.value });
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