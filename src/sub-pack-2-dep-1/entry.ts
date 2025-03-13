
Page({
  data: {
    title: '',
    scenes: [] as { name: string, target: string }[],
  },
  onLoad(query) {
    console.log(query);
    if(query.target) {
      wx.redirectTo({
        url: decodeURIComponent(query.target),
      })
    }
  },
})
