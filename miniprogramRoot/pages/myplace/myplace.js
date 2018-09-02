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
  cloudCall(params, cb) {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'insertDataBase',
      // 传给云函数的参数
      data: params,
    }).then(res => {
      cb && cb(res)
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
