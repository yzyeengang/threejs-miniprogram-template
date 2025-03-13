Page({
  data:{
    title:'hello three.js + @react-three/fiber'
  },
  navigateTo(e:WechatMiniprogram.Touch){
    // 因为 sub-pack-2 依赖超出了包大小， 实际被拆分成了 sub-pack-2 和 sub-pack-2-dep-1,
    // 所以需要先跳转到 sub-pack-2-dep-1 在跳转到实际路径
    wx.navigateTo({
      url: `/sub-pack-2-dep-1/entry?target=${encodeURIComponent(e.currentTarget.dataset.target as string)}`,
    })
  }
})
