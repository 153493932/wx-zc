// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('db-zc').doc(event._id).update({
      // data 传入需要局部更新的数据
      data: {
        code: event.code,
        applyDesc: event.applyDesc,
        applyTime: event.applyTime,
        customer: event.customer,
        phone: event.phone,
        producer: event.producer,
        price: event.price,
        repairTime: event.repairTime,
        log: event.log,
        status: event.status
      }
    })
  } catch (e) {
    console.error(e)
  }
}