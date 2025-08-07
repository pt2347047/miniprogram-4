// profile.js
Page({
  data: {
    userInfo: {
      name: "幸运用户",
      avatar: "/images/default-avatar.png",
      joinTime: "2024年1月15日"
    },
    // 幸运列表相关
    luckyList: [],
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    
    // 修改功能相关
    showRedSelector: false,
    showBlueSelector: false,
    editingIndex: -1,
    editingBallIndex: -1,
    editingIsRed: false,
    redBallOptions: [],
    blueBallOptions: []
  },

  onLoad() {
    this.loadLuckyList();
    this.initBallOptions();
  },

  // 初始化球选项
  initBallOptions() {
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

  // 加载幸运列表
  loadLuckyList() {
    // 这里可以从本地存储或云端加载幸运列表
    const luckyList = wx.getStorageSync('luckyList') || [];
    const totalPages = Math.ceil(luckyList.length / this.data.pageSize);
    
    this.setData({
      luckyList,
      totalPages: totalPages > 0 ? totalPages : 1,
      currentPage: 1
    });
  },



  // 生成图片
  generateImage() {
    if (this.data.luckyList.length === 0) {
      wx.showToast({ title: '暂无幸运号码', icon: 'none' });
      return;
    }
    
    // 检查相册权限
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          // 没有权限，请求权限
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              this.startGenerateImage();
            },
            fail: () => {
              wx.showModal({
                title: '需要相册权限',
                content: '保存图片需要相册权限，请在设置中开启',
                showCancel: false,
                confirmText: '知道了'
              });
            }
          });
        } else {
          // 已有权限，直接生成
          this.startGenerateImage();
        }
      }
    });
  },

  // 开始生成图片
  startGenerateImage() {
    wx.showLoading({ title: '生成图片中...' });
    
    // 获取幸运列表数据
    const luckyList = this.data.luckyList;
    const maxPerImage = 10; // 每张图片最多10个号码
    
    // 计算需要生成的图片数量
    const imageCount = Math.ceil(luckyList.length / maxPerImage);
    
    // 生成图片
    this.generateImages(luckyList, maxPerImage, imageCount, 0);
  },

  // 递归生成多张图片
  generateImages(luckyList, maxPerImage, imageCount, currentIndex) {
    if (currentIndex >= imageCount) {
      wx.hideLoading();
      wx.showToast({ title: '图片生成完成', icon: 'success' });
      return;
    }
    
    const startIndex = currentIndex * maxPerImage;
    const endIndex = Math.min(startIndex + maxPerImage, luckyList.length);
    const currentList = luckyList.slice(startIndex, endIndex);
    
    this.generateSingleImage(currentList, currentIndex + 1, imageCount, () => {
      // 生成下一张图片
      this.generateImages(luckyList, maxPerImage, imageCount, currentIndex + 1);
    });
  },

  // 生成单张图片
  generateSingleImage(luckyList, pageNum, totalPages, callback) {
    const query = wx.createSelectorQuery();
    query.select('#imageCanvas').fields({ node: true, size: true }).exec((res) => {
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      
      // 设置画布尺寸
      const canvasWidth = 750;
      const canvasHeight = 1000;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      
      // 设置背景
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // 绘制标题
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('我的幸运号码', canvasWidth / 2, 80);
      
      // 绘制页码
      ctx.font = '24px Arial';
      ctx.fillText(`第 ${pageNum} 页 / 共 ${totalPages} 页`, canvasWidth / 2, 120);
      
      // 绘制日期
      const now = new Date();
      const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
      ctx.fillText(dateStr, canvasWidth / 2, 150);
      
      // 绘制分割线
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, 180);
      ctx.lineTo(canvasWidth - 50, 180);
      ctx.stroke();
      
      // 绘制号码
      const startY = 220;
      const itemHeight = 70;
      const ballSize = 50;
      const ballSpacing = 8;
      
      luckyList.forEach((item, index) => {
        const y = startY + index * itemHeight;
        
        // 绘制序号
        ctx.fillStyle = '#666666';
        ctx.font = '24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`${index + 1}.`, 50, y + 35);
        
        // 绘制红球
        const redBalls = item.redBalls;
        const blueBall = item.blueBall;
        const totalBalls = redBalls.length + 1;
        const totalWidth = totalBalls * ballSize + (totalBalls - 1) * ballSpacing;
        const startX = (canvasWidth - totalWidth) / 2;
        
        // 绘制红球
        redBalls.forEach((ball, ballIndex) => {
          const x = startX + ballIndex * (ballSize + ballSpacing);
          
          // 绘制红球背景
          const gradient = ctx.createRadialGradient(x + ballSize/2, y + ballSize/2, 0, x + ballSize/2, y + ballSize/2, ballSize/2);
          gradient.addColorStop(0, '#ff6b6b');
          gradient.addColorStop(1, '#ff4757');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x + ballSize/2, y + ballSize/2, ballSize/2, 0, 2 * Math.PI);
          ctx.fill();
          
          // 绘制红球数字
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(ball < 10 ? '0' + ball : ball, x + ballSize/2, y + ballSize/2 + 7);
        });
        
        // 绘制蓝球
        const blueX = startX + redBalls.length * (ballSize + ballSpacing);
        
        // 绘制蓝球背景
        const blueGradient = ctx.createRadialGradient(blueX + ballSize/2, y + ballSize/2, 0, blueX + ballSize/2, y + ballSize/2, ballSize/2);
        blueGradient.addColorStop(0, '#4ecdc4');
        blueGradient.addColorStop(1, '#3742fa');
        ctx.fillStyle = blueGradient;
        ctx.beginPath();
        ctx.arc(blueX + ballSize/2, y + ballSize/2, ballSize/2, 0, 2 * Math.PI);
        ctx.fill();
        
        // 绘制蓝球数字
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(blueBall < 10 ? '0' + blueBall : blueBall, blueX + ballSize/2, y + ballSize/2 + 7);
      });
      
      // 绘制底部信息
      ctx.fillStyle = '#999999';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('生成时间：' + new Date().toLocaleString(), canvasWidth / 2, canvasHeight - 60);
      ctx.fillText('共 ' + luckyList.length + ' 组幸运号码', canvasWidth / 2, canvasHeight - 30);
      
      // 导出图片
      wx.canvasToTempFilePath({
        canvas: canvas,
        success: (res) => {
          // 保存图片到相册
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              wx.showToast({ title: `第${pageNum}页已保存`, icon: 'success' });
              if (callback) callback();
            },
            fail: (err) => {
              console.error('保存图片失败:', err);
              wx.showToast({ title: '保存失败', icon: 'none' });
              if (callback) callback();
            }
          });
        },
        fail: (err) => {
          console.error('生成图片失败:', err);
          wx.showToast({ title: '生成失败', icon: 'none' });
          if (callback) callback();
        }
      });
    });
  },

  // 删除幸运号码
  deleteLuckyNumber(e) {
    const index = e.currentTarget.dataset.index;
    const luckyList = [...this.data.luckyList];
    luckyList.splice(index, 1);
    
    wx.setStorageSync('luckyList', luckyList);
    this.loadLuckyList();
    
    wx.showToast({ title: '删除成功', icon: 'success' });
  },

  // 置顶幸运号码
  moveToTop(e) {
    const index = e.currentTarget.dataset.index;
    const luckyList = [...this.data.luckyList];
    const item = luckyList.splice(index, 1)[0];
    luckyList.unshift(item);
    
    wx.setStorageSync('luckyList', luckyList);
    this.loadLuckyList();
    
    wx.showToast({ title: '置顶成功', icon: 'success' });
  },

  // 修改幸运号码
  editLuckyNumber(e) {
    const index = e.currentTarget.dataset.index;
    const ballIndex = e.currentTarget.dataset.ballIndex;
    const isRed = e.currentTarget.dataset.isRed;
    
    this.setData({
      editingIndex: index,
      editingBallIndex: ballIndex,
      editingIsRed: isRed,
      showRedSelector: isRed,
      showBlueSelector: !isRed
    });
  },

  // 点击红球选项
  onRedOptionTap(e) {
    const value = e.currentTarget.dataset.value;
    const luckyList = [...this.data.luckyList];
    const item = luckyList[this.data.editingIndex];
    
    if (item && this.data.editingIsRed) {
      // 检查是否与同组其他红球重复
      const otherRedBalls = item.redBalls.filter((_, i) => i !== this.data.editingBallIndex);
      if (otherRedBalls.includes(value)) {
        wx.showToast({ title: '该号码已存在', icon: 'none' });
        return;
      }
      
      // 更新红球号码
      item.redBalls[this.data.editingBallIndex] = value;
      
      wx.setStorageSync('luckyList', luckyList);
      this.loadLuckyList();
      
      this.setData({
        showRedSelector: false,
        editingIndex: -1,
        editingBallIndex: -1
      });
      
      wx.showToast({ title: '修改成功', icon: 'success' });
    }
  },

  // 点击蓝球选项
  onBlueOptionTap(e) {
    const value = e.currentTarget.dataset.value;
    const luckyList = [...this.data.luckyList];
    const item = luckyList[this.data.editingIndex];
    
    if (item && !this.data.editingIsRed) {
      // 更新蓝球号码
      item.blueBall = value;
      
      wx.setStorageSync('luckyList', luckyList);
      this.loadLuckyList();
      
      this.setData({
        showBlueSelector: false,
        editingIndex: -1,
        editingBallIndex: -1
      });
      
      wx.showToast({ title: '修改成功', icon: 'success' });
    }
  },

  // 页面跳转
  changePage(e) {
    const page = parseInt(e.currentTarget.dataset.page);
    if (page >= 1 && page <= this.data.totalPages) {
      this.setData({ currentPage: page });
    }
  }
}); 