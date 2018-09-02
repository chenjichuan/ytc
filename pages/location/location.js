var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showWillGo: false,
    latitude: 39.909604,
    longitude: 116.397228,
    markers: [{
      // id: 1,
      // latitude: 39.909604,
      // longitude: 116.397228,
      // callout:  {
      //   content: '天安门',
      // },
      // label: {
      //   content: '天安门',
      // }
    }],
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLocation()
  },

  onShow() {
    var location = app.globalData.selectCondition
    try {
      location.latitude = Number(location.latitude),
      location.longitude = Number(location.longitude)
    }catch (e) {}

    if(location.latitude && location.longitude) {
      this.mapCtx.includePoints({
        padding: [10],
        points: [{
          latitude: location.latitude,
          longitude: location.longitude
        }]
      })
      this.setData( {
        showWillGo: true
      })

      // wx.showModal({
      //   title: '导航',
      //   content: location.name,
      //   success: function(res) {
      //     if (res.confirm) {
      //       wx.openLocation({
      //         latitude: location.latitude,
      //         longitude: location.longitude,
      //         name: location.name,
      //         scale: 28
      //       })
      //     } else if (res.cancel) {
      //     }
      //   }
      // })

    } else {
      this.setData( {
        showWillGo: false
      })
    }
  },

  onHide() {
    app.globalData.selectCondition = {}
  },

  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function(res){
        // alert(res.longitude, res.latitude)
        wx.showModal({
          title: '提示',
          content: '' + res.longitude + ', ' + res.latitude,
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  },
  // 定位到当前位置
  moveToLocation: function () {
    this.mapCtx = wx.createMapContext('myMap')
    this.mapCtx.moveToLocation()
  },
  translateMarker: function() {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: 39.909604,
        longitude: 116.408328,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  includePoints: function() {
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude:39.909604,
        longitude:116.408328,
      }]
    })
  },

  // 当前定位
  //获取经纬度
  getLocation: function(e) {
    var that = this
    wx.getLocation({
      success: function( res ) {
        console.log( res )
        that.setData( {
          hasLocation: true,
          location: {
            longitude: res.longitude,
            latitude: res.latitude,
          }
        })

        // 显示当前位置
        that.moveToLocation()

        const { latitude, longitude } = res
        const data = {markers: [{
            id: 'markerDefault',
            iconPath: '/images/location.png',
            latitude: 39.95933,
            longitude: 116.29845,
            label: {
              content: 'XX小区'
            }
          }]}
        const radomX = new Array(10).fill(0).map(item => {
          const opNum = [1, -1][Math.floor(Math.random()*2)] * 0.01
          return Number((Math.random() * opNum).toFixed(3))
        })
        const radomY = new Array(10).fill(0).map(item => {
          const opNum = [1, -1][Math.floor(Math.random()*2)] * 0.01
          return Number((Math.random() * opNum).toFixed(3))
        })
        for (var i =0; i < 10; i ++) {
          let latitudeTemp = Number((latitude + radomY[i]).toFixed(6));
          let longitudeTemp =  Number((longitude + radomX[i]).toFixed(6));
          data.markers.push({
            id: 'marker' + i,
            iconPath: '/images/location.png',
            latitude: latitudeTemp,
            longitude: longitudeTemp,
            // callout:  {
            //   content: '位置' + i
            // },
            label: {
              content: '位置' + i
            }
          })
        }
        that.setData(data)
      }
    })
  },
  chooseYourAddr() {
    const me = this;
    wx.chooseLocation({
      success(res) {
        // console.log(res)
        let markers = [{
          id: 1,
          latitude: res.latitude,
          longitude: res.longitude,
          callout:  {
            borderRadius: 4,
            padding: 4,
            content: res.address,
          },
          label: {
            content: res.name,
          }
        }];

        me.setData({ markers })
        me.mapCtx.includePoints({
          padding: [1],
          points: [{
            latitude:res.latitude,
            longitude:res.longitude,
          }]
        })
      }
    })
  },
//根据经纬度在地图上显示
  openLocation: function( e ) {
    var value = e.detail.value

    // wx.openLocation({
    //   latitude: latitude,
    //   longitude: longitude,
    //   name:"花园桥肯德基",
    //   scale: 28
    // })

    wx.openLocation( {
      longitude: Number( value.longitude ),
      latitude: Number( value.latitude )
    })
  },

  // 气泡点击事件
  callouttap: function(e) {
    // const [ targetObj ] = this.data.markers.filter(item => item.id === e.markerId)
    // wx.openLocation({
    //   latitude: targetObj.latitude,
    //   longitude: targetObj.longitude,
    //   name:"花园桥肯德基",
    //   scale: 28
    // })
  },
  markertap: function(e) {
    console.log(e.markerId)
    const me = this
    wx.showModal({
      title: '提示',
      content: '是否使用导航',
      success: function(res) {
        if (res.confirm) {
          const [ targetObj ] = me.data.markers.filter(item => item.id === e.markerId)
          wx.openLocation({
            latitude: targetObj.latitude,
            longitude: targetObj.longitude,
            name:"花园桥肯德基",
            scale: 28
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
    }catch (e) {}
    wx.showModal({
      title: '导航',
      content: location.name,
      success: function(res) {
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
