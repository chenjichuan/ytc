var app = getApp();
wx.cloud.init()
const db = wx.cloud.database()
Page({
  data: {
    showWillGo: false,
    latitude: 39.909604,
    longitude: 116.397228,
    markers: [],
    // covers: [{
    //   latitude: 39.909604,
    //   longitude: 116.408328,
    //   iconPath: '/images/location.png'
    // }, {
    //   latitude: 39.909604,
    //   longitude: 116.390028,
    //   iconPath: '/images/location.png'
    // }]
  },

  onLoad: function (options) {
    const me = this
    // 查询所有可用小区，然后地图标点
    db.collection('maps')
      .get()
      .then(res => {
        const data = res.data
        console.log(data)
        app.globalData.allmaps = data
        const markers = data.map(item => {
          return ({
            id: item._id,
            iconPath: '/images/location.png',
            latitude: item.latitude,
            longitude: item.longitude,
            address: item.address,
            // callout:  {
            //   content: '位置' + i
            // },
            label: {
              content: item.name
            }
          })
        })
        // markers.push({
        //   id: 'test',
        //   iconPath: '/images/location.png',
        //   longitude: Number(me.data.longitude),
        //   latitude: Number(me.data.latitude),
        //   // callout:  {
        //   //   content: '位置' + i
        //   // },
        //   label: {
        //     content: '测试'
        //   }
        // })
        me.setData({markers})
      })
  },
  onReady() {
    this.getLocation()
  },
  onShow() {
    var location = app.globalData.selectCondition
    try {
      location.latitude = Number(location.latitude),
        location.longitude = Number(location.longitude)
    } catch (e) {
    }

    if (location.latitude && location.longitude) {
      this.mapCtx.includePoints({
        padding: [10],
        points: [{
          latitude: location.latitude,
          longitude: location.longitude
        }]
      })
      this.setData({
        showWillGo: true
      })


    } else {
      this.setData({
        showWillGo: false
      })
    }
  },

  onHide() {
    app.globalData.selectCondition = {}
  },

  // 定位到当前位置
  moveToLocation: function () {
    this.mapCtx = wx.createMapContext('myMap')
    this.mapCtx.moveToLocation()
  },
  includePoints: function () {
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude: 39.909604,
        longitude: 116.408328,
      }]
    })
  },
  // 当前定位
  //获取经纬度
  getLocation: function (e) {
    var that = this
    wx.getLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          hasLocation: true,
          longitude: res.longitude,
          latitude: res.latitude,
          // location: {
          //   longitude: res.longitude,
          //   latitude: res.latitude,
          // }
        })
        // 显示当前位置
        that.moveToLocation()
      }
    })
  },
  // 气泡点击事件
  callouttap: function (e) {
    // const [ targetObj ] = this.data.markers.filter(item => item.id === e.markerId)
    // wx.openLocation({
    //   latitude: targetObj.latitude,
    //   longitude: targetObj.longitude,
    //   name:"花园桥肯德基",
    //   scale: 28
    // })
  },
  markertap: function (e) {
    console.log(e)
    const me = this
    wx.showModal({
      title: '提示',
      content: '是否使用导航',
      success: function (res) {
        if (res.confirm) {
          const [targetObj] = me.data.markers.filter(item => item.id === e.markerId)
          wx.openLocation({
            latitude: targetObj.latitude,
            longitude: targetObj.longitude,
            name: targetObj.name,
            scale: 20
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  searchHandleClick() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  goHandleClick() {
    var location = app.globalData.selectCondition
    try {
      location.latitude = Number(location.latitude),
        location.longitude = Number(location.longitude)
    } catch (e) {
    }
    wx.showModal({
      title: '导航',
      content: location.name,
      success: function (res) {
        if (res.confirm) {
          wx.openLocation({
            latitude: location.latitude,
            longitude: location.longitude,
            name: location.name,
            scale: 28
          })
        } else if (res.cancel) {
        }
      }
    })
  }
})
