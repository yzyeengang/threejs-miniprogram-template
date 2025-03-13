import { scenes, standardScenes } from "@/sub-pack-2/r3f-examples";

Page({
  data: {
    title: '',
    scenes: [] as { name: string, target: string }[],
  },
  onLoad(query) {
    this.setData({
      title: `r3f ${query.type === 'base' ? '基础' : '复杂'} 示例`,
      scenes: Object.keys(query.type === 'base' ? scenes : standardScenes).map(key => ({
        name: key,
        target: `/sub-pack-2/r3f-demo/index?scene=${key}`,
      }))
    })
  },
  navigateTo(e: WechatMiniprogram.Touch) {
    wx.navigateTo({
      url: e.currentTarget.dataset.target as string,
    })
  }
})
