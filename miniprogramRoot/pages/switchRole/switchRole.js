// pages/switchRole/switchRole.js
const app = getApp()
wx.cloud.init()
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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
  handleClick(e) {
    console.log(e)
    const userId = app.globalData.userId
    console.log(userId)
    let params = {}
    if (e.target.id === 'owner') {
      params = {
        scope: 'role',
        packages: {
          userId: userId,
          active: 'true',
          roleName: 'owner',
          roleId: 'ytc_01' // 车库主id
        }
      }
    } else {
      params = {
        scope: 'role',
        packages: {
          userId: userId,
          active: 'true',
          roleName: 'user',
          roleId: 'ytc_02' // 车主id
        }
      }
    }
    wx.showLoading({
      title: '',
    })
    this.cloudCall(params, (res) => {
      wx.hideLoading()
      if (e.target.id === 'owner') {
        wx.reLaunch({
          url: '../owner/owner'
        })
      } else {
        wx.switchTab({
          url: '/pages/location/location'
        })
      }
    })
  }
})
