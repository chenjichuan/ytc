const app = getApp()
wx.cloud.init()
const db = wx.cloud.database()

const carnumRegex = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
const phoneRegex = /^1[34578]\d{9}$/;
import {$Message, $Toast} from '../../component/base/index';

Page({
  data: {
    loading: true,
    recordId: false,
    phone: '',
    carNumber: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userId = app.globalData.userId;
    const me = this;
    // 获取用户基本资料
    db.collection('user_info').where({
      userId
    }).get().then(res => {
      const [data] = res.data;
      me.setData({
        loading: false
      })
      if (data) {
        me.setData({
          recordId: data._id,
          phone: data.phone,
          carNumber: data.carNumber
        })
      }
    })
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

  phoneInputHandle(e) {
    const {detail: {detail}} = e
    this.setData({
      phone: detail.value,
    })
  },

  carNumberInputHandle(e) {
    const {detail: {detail}} = e
    this.setData({
      carNumber: detail.value,
    })
  },

  handleClick() {
    const {recordId, phone, carNumber} = this.data
    if (!phoneRegex.test(phone)) {
      $Message({
        content: '请输入正确的手机号',
        type: 'warning'
      });
      return
    }

    if (!carnumRegex.test(carNumber)) {
      $Message({
        content: '请输入正确的车牌号',
        type: 'warning'
      });
      return
    }

    const params = {
      scope: 'user_info',
      packages: {
        userId: app.globalData.userId,
        phone,
        carNumber
      }
    }
    const cb = (res) => {
      console.log(res)
      $Toast({
        content: '修改成功',
        type: 'success'
      });
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 1000)
    }
    // 更新
    if(recordId) {
      db.collection('user_info').doc(recordId).update({
        data: {
          phone,
          carNumber
        }
      }).then(cb)
    }else {
      // 新建
      this.cloudCall(params, cb)
    }
  }
})