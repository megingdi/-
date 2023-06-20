const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
// 创建愿望
exports.createWishes = async (event, context) => {
  const {
    data
  } = event
  let {
    OPENID,
  } = cloud.getWXContext() 
  try {
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      await db.collection('wishes').add({
        data: {
          creatorOpenId: OPENID, 
          creatorName: item.creatorName, 
          createTime: new Date(), 
          updateTime: new Date(), 
          title: item.title, 
          content: item.content, 
          finish: false, 
          share: item.share, 
        }
      })
    }
    return {
      success: true,
      data: event.data
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};


exports.getMyNotFinishWishes = async (event, context) => {
  let {
    OPENID,
  } = cloud.getWXContext() 
  try {
    const wishes = await db.collection('wishes').where({
      creatorOpenId: OPENID,
      finish: false,
    }).get() || [];
    return {
      success: true,
      data: wishes,
    }
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};


exports.getParnerNotFinishWishes = async (event, context) => {
  try {
    const wishes = await db.collection('wishes').where({
      creatorOpenId: event.openid,
      finish: false,
      share:true
    }).get() || [];
    return {
      success: true,
      data: wishes,
    }
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};


exports.getMeAndParnerNotFinishWishes = async (event, context) => {
  let {
    OPENID,
  } = cloud.getWXContext() 
  // 返回数据库查询结果
  try {
    const myFinishWishes = await db.collection('wishes').where({
      creatorOpenId: OPENID,
      finish: true,
    }).get();
    const myParnerFinishWishes = await db.collection('wishes').where({
      creatorOpenId: event.openid,
      finish: true,
    }).get();
    console.log(myFinishWishes,myParnerFinishWishes);
    return {
      success: true,
      data: [...myFinishWishes.data, ...myParnerFinishWishes.data],
    }
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};

// 更新
exports.updateWish = async (event, context) => {
  const { title, content, share } = event
  try {
    await db.collection('wishes').doc(event._id).update({
      data: {
        updateTime: new Date(), // 修改时间
        title:title, 
        content:content, 
        share:share, 
      },
    })
    return {
      success: true,
      data: event.data
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};

// 完成
exports.finishWish = async (event, context) => {
  try {
    await db.collection('wishes').doc(event._id).update({
      data: {
        updateTime: new Date(), // 修改时间
        finish: true,
      },
    })
    return {
      success: true,
      data: event.data
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};

// 删除
exports.deleteWish = async (event, context) => {
  try {
    await db.collection('wishes').doc(event._id).remove()
    return {
      success: true,
      data: event.data
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};
// 获取当前OPENID
exports.userOpenid = async (event,context) => {
  try {
    let { OPENID } = cloud.getWXContext()
    return {
      success:true,
      data:OPENID
    }
  }catch{
    return {
      success: false,
      errMsg: e
    };
  }
}