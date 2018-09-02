var app = getApp();
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    allmaps: []
  },
  onLoad() {
    this.setData({
      allmaps: app.globalData.allmaps
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
    wx.switchTab({
      url: '/pages/location/location'
    })
  }
});
