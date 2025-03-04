Page({
  data:{
    title:'hello three.js + tres.js'
  },
  navigateTo(e:WechatMiniprogram.Touch){
    wx.navigateTo({
      url:e.currentTarget.dataset.target as string,
    })
  }
})
