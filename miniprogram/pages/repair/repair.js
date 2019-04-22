// miniprogram/pages/repair/repair.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scanResult: '',
    price: 0,
    log: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  doScan: function () {
    var self = this
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        self.setData({
          scanResult: res.result
        })
      }
    });
  },

  resultInput: function (e) {
    this.setData({
      scanResult: e.detail.value
    })
  },

  priceInput: function (e) {
    this.setData({
      price: parseInt(e.detail.value)
    })
  },

  logInput: function (e) {
    this.setData({
      log: e.detail.value
    })
  },

  doSave: function () {
    var that = this;
      if (this.data.scanResult && this.data.price && this.data.log) {
        wx.showLoading({
          title: '保存中...',
        })
        const db = wx.cloud.database()
        db.collection('db-zc').where({
          code: this.data.scanResult,
          status: 'applyed'
        })
        .get({
          success(res) {
            // res.data 是包含以上定义的两条记录的数组
            console.log(res.data)
            if (res.data.length == 0) {
              wx.showToast({ title: '无申请记录', icon: 'none'})
            } else {
              var item = res.data[0];
              wx.cloud.callFunction({
                // 云函数名称
                name: 'updateRepair',
                // 传给云函数的参数
                data: {
                  id: item._id,
                  code: item.code,
                  applyDesc: item.applyDesc,
                  applyTime: item.applyTime,
                  customer: item.customer,
                  phone: item.phone,
                  producer: item.name,
                  price: that.data.price,
                  repairTime: (new Date()).getTime(),
                  log: that.data.log,
                  status: 'repaired'
                },
                success(res) {
                  console.log(res)
                  wx.hideLoading()
                  wx.navigateBack()
                },
                fail(res) {
                  wx.hideLoading()
                  wx.showToast({ title: '保存失败', icon: 'none'})
                }
              // db.collection('db-zc').doc(id).update({
              //   // data 字段表示需新增的 JSON 数据
              //   data: {
              //     code: item.code,
              //     applyDesc: item.applyDesc,
              //     applyTime: item.applyTime,
              //     customer: item.customer,
              //     phone: item.phone,
              //     producer: item.name,
              //     price: that.data.price,
              //     repairTime: (new Date()).getTime(),
              //     log: that.data.log,
              //     status: 'repaired'
              //   },
              //   success(res) {
              //     console.log(res)
              //     wx.hideLoading()
              //     wx.navigateBack()
              //   },
              //   fail(res) {
              //     wx.hideLoading()
              //     wx.showToast({ title: '保存失败', icon: 'none'})
              //   }
              })
            }
          }
        })
      } else {
        wx.showToast({
          title: '数据不能为空', icon: 'none'
        })
      }
    },

})