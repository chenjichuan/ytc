var app = getApp();
wx.cloud.init()
const db = wx.cloud.database()
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    allmaps: []
  },
  onLoad() {
    const me = this
    // 查询所有可用小区，然后地图标点
    db.collection('maps')
      .get()
      .then(res => {
        const data = res.data
        app.globalData.allmaps = data
        me.setData({
          allmaps: data
        })
      })
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  taphandler(e) {
    var con = e.currentTarget.dataset;
    app.globalData.selectCondition = con;
    wx.navigateTo({
      url: '../myplace/myplace'
    })
  }
});
