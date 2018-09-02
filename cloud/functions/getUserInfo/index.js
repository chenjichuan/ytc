// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 插入数据
const insertData = (openId, nickName, avatarUrl) => {
  // 插入数据
  return cloud.callFunction({
    name: 'insertDataBase',
    data: {
      scope: 'user',
      packages: {openId, nickName, avatarUrl}
    }
  })
}

// 查询用户
const searchUser = (userInfo) => {
  return db.collection('user').where({
    openId: userInfo.openId
  }).get()
}


// 云函数入口函数
exports.main = async (event, context) => {
  const {userInfo, nickName, avatarUrl} = event
  let request = {code: '', message: ''}
  let record = false
  await searchUser(userInfo).then(res => {
    // 老用户
    if (res.data.length) {
      request.code = 0
      request.message = 'have a record'
      request.data = {
        userId: res.data[0]._id
      }
      record = true
    } else {
      // 新用户
      record = false
    }
  })
  if (!record) {
    // 插入新用户数据
    await insertData(userInfo.openId, nickName, avatarUrl).then(res => {
      request.code = 1
      request.message = res.errMsg
    })
  }
  return request
}
