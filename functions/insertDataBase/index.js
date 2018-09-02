// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const {scope, packages} = event
  // 插入数据
  return await db.collection(scope).add({
    data: {
      ...packages,
      due: Date.parse(new Date())
    }
  })
}


