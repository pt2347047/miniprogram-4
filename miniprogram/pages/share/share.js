// share.js
Page({
  data: {
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
  }
}); 