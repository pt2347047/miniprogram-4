// tools.js
Page({
  data: {
    activeTab: 'random',
    generating: false,
    
    // 听天命
    countOptions: ['5', '6', '7', '8', '9', '10'],
    selectedCount: 0,
    randomResults: [],
    
    // 尽人事 - 新的数据结构
    mainRedBalls: [
      { value: null, selected: false },
      { value: null, selected: false },
      { value: null, selected: false },
      { value: null, selected: false },
      { value: null, selected: false },
      { value: null, selected: false }
    ],
    mainBlueBall: { value: null, selected: false },
    showRedSelector: false,
    showBlueSelector: false,
    redBallOptions: [],
    blueBallOptions: [],
    selectedRedNumbers: [],
    selectedBlueNumber: null,
    specifyResults: [],
    
    // 蓦回首
    redBallCountOptions: ['4', '5', '6'],
    blueBallCountOptions: ['0', '1'],
    selectedRedBallCount: 0,
    selectedBlueBallCount: 0,
    historyResults: [],
    hasSearched: false,
    
    // 导入功能相关
    showImportSuccess: false
  },

  onLoad() {
    // 初始化红球选项 (1-33)
    const redBallOptions = [];
    for (let i = 1; i <= 33; i++) {
      redBallOptions.push({ value: i, selected: false });
    }
    
    // 初始化蓝球选项 (1-16)
    const blueBallOptions = [];
    for (let i = 1; i <= 16; i++) {
      blueBallOptions.push({ value: i, selected: false });
    }
    
    this.setData({
      redBallOptions,
      blueBallOptions
    });
  },

  // Tab切换
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    console.log('切换到tab:', tab);
    
    // 重置所有球的状态
    const mainRedBalls = [
      { value: null, selected: false },
      { value: null, selected: false },
      { value: null, selected: false },
      { value: null, selected: false },
      { value: null, selected: false },
      { value: null, selected: false }
    ];
    const mainBlueBall = { value: null, selected: false };
    const redBallOptions = this.data.redBallOptions.map(item => ({ ...item, selected: false }));
    const blueBallOptions = this.data.blueBallOptions.map(item => ({ ...item, selected: false }));
    
    console.log('重置后的mainRedBalls:', mainRedBalls);
    console.log('重置后的mainBlueBall:', mainBlueBall);
    
    this.setData({
      activeTab: tab,
      showRedSelector: false,
      showBlueSelector: false,
      mainRedBalls,
      mainBlueBall,
      redBallOptions,
      blueBallOptions,
      selectedRedNumbers: [],
      selectedBlueNumber: null,
      // 清空结果
      randomResults: [],
      specifyResults: [],
      historyResults: [],
      hasSearched: false,
      showImportSuccess: false
      // 注意：不重置selectedCount，保持用户选择的组数
    });
  },

  // 组数选择
  onCountChange(e) {
    this.setData({
      selectedCount: parseInt(e.detail.value)
    });
  },

  // 听天命 - 生成随机号码
  generateRandom() {
    const count = parseInt(this.data.countOptions[this.data.selectedCount]);
    this.setData({ generating: true });
    
    wx.cloud.callFunction({
      name: 'test1',
      data: {
        type: 'random',
        count: count
      },
      success: (res) => {
        if (res.result && res.result.success && res.result.data) {
          this.setData({
            randomResults: res.result.data,
            showImportSuccess: false
          });
        } else {
          wx.showToast({ title: '生成失败', icon: 'none' });
        }
      },
      fail: (err) => {
        console.error('随机生成失败:', err);
        wx.showToast({ title: '生成失败', icon: 'none' });
      },
      complete: () => {
        this.setData({ generating: false });
      }
    });
  },

  // 尽人事 - 点击红球
  onRedBallTap(e) {
    this.setData({
      showRedSelector: true,
      showBlueSelector: false
    });
  },

  // 尽人事 - 点击蓝球
  onBlueBallTap() {
    this.setData({
      showRedSelector: false,
      showBlueSelector: true
    });
  },

  // 尽人事 - 点击红球选项
  onRedOptionTap(e) {
    const value = e.currentTarget.dataset.value;
    const redBallOptions = [...this.data.redBallOptions];
    const option = redBallOptions.find(item => item.value === value);
    
    if (option) {
      // 如果已经选中，则取消选中
      if (option.selected) {
        option.selected = false;
        const selectedRedNumbers = this.data.selectedRedNumbers.filter(num => num !== value);
        this.setData({
          redBallOptions,
          selectedRedNumbers
        });
      } else {
        // 如果未选中，检查是否超过6个
        if (this.data.selectedRedNumbers.length >= 6) {
          wx.showToast({ title: '最多只能选择6个红球', icon: 'none' });
          return;
        }
        option.selected = true;
        const selectedRedNumbers = [...this.data.selectedRedNumbers, value];
        this.setData({
          redBallOptions,
          selectedRedNumbers
        });
      }
    }
  },

  // 尽人事 - 点击蓝球选项
  onBlueOptionTap(e) {
    const value = e.currentTarget.dataset.value;
    const blueBallOptions = [...this.data.blueBallOptions];
    const option = blueBallOptions.find(item => item.value === value);
    
    if (option) {
      // 如果已经选中，则取消选中
      if (option.selected) {
        option.selected = false;
        this.setData({
          blueBallOptions,
          selectedBlueNumber: null
        });
      } else {
        // 如果未选中，先取消其他选中状态
        blueBallOptions.forEach(item => item.selected = false);
        option.selected = true;
        this.setData({
          blueBallOptions,
          selectedBlueNumber: value
        });
      }
    }
  },

  // 尽人事 - 清空红球选择
  clearRedSelection() {
    const redBallOptions = this.data.redBallOptions.map(item => ({ ...item, selected: false }));
    const mainRedBalls = [
      { value: null, selected: false },
      { value: null, selected: false },
      { value: null, selected: false },
      { value: null, selected: false },
      { value: null, selected: false },
      { value: null, selected: false }
    ];
    this.setData({
      redBallOptions,
      selectedRedNumbers: [],
      mainRedBalls
    });
  },

  // 尽人事 - 清空蓝球选择
  clearBlueSelection() {
    const blueBallOptions = this.data.blueBallOptions.map(item => ({ ...item, selected: false }));
    const mainBlueBall = { value: null, selected: false };
    this.setData({
      blueBallOptions,
      selectedBlueNumber: null,
      mainBlueBall
    });
  },

  // 尽人事 - 确认红球选择
  confirmRedSelection() {
    const selectedRedNumbers = this.data.selectedRedNumbers;
    console.log('确认红球选择，选中的号码:', selectedRedNumbers);
    
    const mainRedBalls = [
      { value: null, selected: false },
      { value: null, selected: false },
      { value: null, selected: false },
      { value: null, selected: false },
      { value: null, selected: false },
      { value: null, selected: false }
    ];
    
    // 设置选中的红球
    selectedRedNumbers.forEach((value, index) => {
      if (index < 6) {
        mainRedBalls[index].value = value;
        mainRedBalls[index].selected = true;
      }
    });
    
    console.log('更新后的mainRedBalls:', mainRedBalls);
    
    this.setData({
      mainRedBalls,
      showRedSelector: false
    });
  },

  // 尽人事 - 确认蓝球选择
  confirmBlueSelection() {
    const selectedBlueNumber = this.data.selectedBlueNumber;
    console.log('确认蓝球选择，选中的号码:', selectedBlueNumber);
    
    const mainBlueBall = { 
      value: selectedBlueNumber,
      selected: selectedBlueNumber ? true : false
    };
    
    console.log('更新后的mainBlueBall:', mainBlueBall);
    
    this.setData({
      mainBlueBall,
      showBlueSelector: false
    });
  },

  // 尽人事 - 生成指定号码
  generateSpecify() {
    const count = parseInt(this.data.countOptions[this.data.selectedCount]);
    const selectedRedNumbers = this.data.selectedRedNumbers;
    const selectedBlueNumber = this.data.selectedBlueNumber;
    
    this.setData({ generating: true });
    
    wx.cloud.callFunction({
      name: 'test1',
      data: {
        type: 'specify',
        count: count,
        redBalls: selectedRedNumbers,
        blueBall: selectedBlueNumber
      },
      success: (res) => {
        if (res.result && res.result.success && res.result.data) {
          // 处理结果，标记包含指定红球和蓝球的号码
          const results = res.result.data.map(item => ({
            ...item,
            matchesBlueBall: selectedBlueNumber ? item.blueBall === selectedBlueNumber : false,
            matchesRedBalls: selectedRedNumbers && selectedRedNumbers.length > 0 ? 
              selectedRedNumbers.every(redBall => item.redBalls.includes(redBall)) : false
          }));
          
          this.setData({
            specifyResults: results,
            showImportSuccess: false
          });
        } else {
          wx.showToast({ title: '生成失败', icon: 'none' });
        }
      },
      fail: (err) => {
        console.error('指定生成失败:', err);
        wx.showToast({ title: '生成失败', icon: 'none' });
      },
      complete: () => {
        this.setData({ generating: false });
      }
    });
  },

  // 蓦回首 - 红球重复数选择
  onRedBallCountChange(e) {
    this.setData({
      selectedRedBallCount: parseInt(e.detail.value)
    });
  },

  // 蓦回首 - 蓝球重复数选择
  onBlueBallCountChange(e) {
    this.setData({
      selectedBlueBallCount: parseInt(e.detail.value)
    });
  },

  // 蓦回首 - 生成历史号码
  generateHistory() {
    const count = parseInt(this.data.countOptions[this.data.selectedCount]);
    const selectedRedNumbers = this.data.selectedRedNumbers;
    const selectedBlueNumber = this.data.selectedBlueNumber;
    const redBallCount = parseInt(this.data.redBallCountOptions[this.data.selectedRedBallCount]);
    const blueBallCount = parseInt(this.data.blueBallCountOptions[this.data.selectedBlueBallCount]);
    
    // 获取选中的红球号码
    const redBalls = selectedRedNumbers || [];
    
    // 获取选中的蓝球号码
    const blueBall = selectedBlueNumber || null;
    
    this.setData({ generating: true, hasSearched: true });
    
    wx.cloud.callFunction({
      name: 'test1',
      data: {
        type: 'history',
        count: count,
        redBalls: redBalls,
        blueBall: blueBall,
        redBallCount: redBallCount,
        blueBallCount: blueBallCount
      },
      success: (res) => {
        if (res.result && res.result.success && res.result.data) {
          // 处理结果，标记包含指定红球和蓝球的号码
          const results = res.result.data.map(item => ({
            ...item,
            matchesBlueBall: selectedBlueNumber ? item.blueBall === selectedBlueNumber : false,
            matchesRedBalls: selectedRedNumbers && selectedRedNumbers.length > 0 ? 
              selectedRedNumbers.every(redBall => item.redBalls.includes(redBall)) : false
          }));
          
          this.setData({
            historyResults: results,
            showImportSuccess: false
          });
        } else {
          this.setData({
            historyResults: [],
            showImportSuccess: false
          });
        }
      },
      fail: (err) => {
        console.error('历史生成失败:', err);
        wx.showToast({ title: '生成失败', icon: 'none' });
        this.setData({
          historyResults: []
        });
      },
      complete: () => {
        this.setData({ generating: false });
      }
    });
  },

  // 导入到幸运列表
  importToLuckyList() {
    let results = [];
    
    // 根据当前tab获取结果
    if (this.data.activeTab === 'random') {
      results = this.data.randomResults;
    } else if (this.data.activeTab === 'specify') {
      results = this.data.specifyResults;
    } else if (this.data.activeTab === 'history') {
      results = this.data.historyResults;
    }
    
    if (results.length === 0) {
      wx.showToast({ title: '没有可导入的号码', icon: 'none' });
      return;
    }
    
    // 获取现有的幸运列表
    const existingLuckyList = wx.getStorageSync('luckyList') || [];
    
    // 检查是否超过100组限制
    if (existingLuckyList.length + results.length > 100) {
      wx.showToast({ title: '幸运列表已满，最多100组', icon: 'none' });
      return;
    }
    
    // 添加新的号码到幸运列表
    const newLuckyList = [...existingLuckyList, ...results];
    wx.setStorageSync('luckyList', newLuckyList);
    
    // 显示成功提示
    this.setData({
      showImportSuccess: true
    });
    
    wx.showToast({ title: '导入成功', icon: 'success' });
    
    // 清空结果并重置选项
    this.clearResultsAndReset();
  },

  // 清空结果并重置选项
  clearResultsAndReset() {
    // 重置所有球的状态
    const mainRedBalls = [
      { value: null, selected: false },
      { value: null, selected: false },
      { value: null, selected: false },
      { value: null, selected: false },
      { value: null, selected: false },
      { value: null, selected: false }
    ];
    const mainBlueBall = { value: null, selected: false };
    const redBallOptions = this.data.redBallOptions.map(item => ({ ...item, selected: false }));
    const blueBallOptions = this.data.blueBallOptions.map(item => ({ ...item, selected: false }));
    
    this.setData({
      showRedSelector: false,
      showBlueSelector: false,
      mainRedBalls,
      mainBlueBall,
      redBallOptions,
      blueBallOptions,
      selectedRedNumbers: [],
      selectedBlueNumber: null,
      // 清空结果
      randomResults: [],
      specifyResults: [],
      historyResults: [],
      hasSearched: false
    });
  },

  // 跳转到个人信息页
  navigateToProfile() {
    wx.switchTab({
      url: '/pages/profile/profile'
    });
  }
}); 