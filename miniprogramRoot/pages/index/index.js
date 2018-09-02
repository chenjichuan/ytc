//index.js
//获取应用实例
const app = getApp()
wx.cloud.init()
const db = wx.cloud.database()
Page({
  data: {
    motto: '欢迎使用',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewMap: function () {
    wx.navigateTo({
      url: '../location/location'
    })
  },
  clickHandle() {
  },
  onLoad: function () {
    const me = this
    wx.getUserInfo({
      success: function (res) {
        // 拿到用户信息需要的话更新数据库
        me.setUserInfo(res.userInfo)
      }
    })
  },
  setUserInfo(userInfo) {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getUserInfo',
      // 传给云函数的参数
      data: userInfo,
    }).then(res => {
      console.group('用户信息处理')
      console.log(res.result)
      console.log('userId:', res.result.data.userId)
      console.groupEnd()
      const userId = res.result.data.userId
      app.globalData.userId = userId

      // 查询角色
      db.collection('role').where({
        userId
      }).get().then(res => {
        const data = res.data
        app.globalData.role = data
        switch (res.data.length) {
          case 0: // 没有角色，新用户
            wx.redirectTo({
              url: '../switchRole/switchRole'
            })
            break;
          case 1:
            if (data[0].roleId === 'ytc_01') {
              wx.navigateTo({
                url: '../owner/owner'
              })
            } else if (data[0].roleId === 'ytc_02') {
              wx.switchTab({
                url: '/pages/location/location'
              })
            }
            break;
          case 2:
            // 多个角色。
            // wx.redirectTo({
            //   url: '../owner/owner'
            // })
            wx.switchTab({
              url: '/pages/location/location'
            })
            break;
          default:
            break;
        }
      })
    })
  }
})
