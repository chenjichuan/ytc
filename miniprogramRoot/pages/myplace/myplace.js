var app = getApp();
wx.cloud.init()
const db = wx.cloud.database()
Page({
  data: {
    placeName:'1'
  },
  onLoad() {
    var con = app.globalData.selectCondition
    const me = this
    me.setData({
      placeName: con.name
    })
  },
  handleClick() {
    const {role, userId} = app.globalData
    if (role.length > 1) {
      wx.switchTab({
        url: '/pages/location/location'
      })
    } else {
      const params = {
        scope: 'role',
        packages: {
          userId,
          active: 'true',
          roleName: 'user',
          roleId: 'ytc_02' // 租户ID
        }
      }
      wx.showLoading({
        title: '切换中',
      })
      this.cloudCall(params, () => {
        wx.hideLoading()
        wx.switchTab({
          url: '/pages/location/location'
        })
      })

    }
  }
});
