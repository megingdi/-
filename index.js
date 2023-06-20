// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    // 获取用户的openid
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID

    return {
        openid: openid
    }
}