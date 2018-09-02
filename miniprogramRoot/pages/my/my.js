const app = getApp()
wx.cloud.init()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {role} = app.globalData
    console.log(role)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
      wx.reLaunch({
        url: '../owner/owner'
      })
    } else {
      const params = {
        scope: 'role',
        packages: {
          userId,
          active: 'true',
          roleName: 'owner',
          roleId: 'ytc_01' // 车库主id
        }
      }
      wx.showLoading({
        title: '切换中',
      })
      this.cloudCall(params, () => {
        wx.hideLoading()
        wx.reLaunch({
          url: '../owner/owner'
        })

      })

    }
  }
})
