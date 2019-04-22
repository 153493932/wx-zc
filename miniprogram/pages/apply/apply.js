// miniprogram/pages/apply/apply.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scanResult: '',
    name: '',
    customer: '',
    phone: '',
    description: ''
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

  resultInput: function (e) {
    this.setData({
      scanResult: e.detail.value
    })
  },

  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  customerInput: function (e) {
    this.setData({
      customer: e.detail.value
    })
  },

  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  descriptionInput: function (e) {
    this.setData({
      description: e.detail.value
    })
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

  doSave: function () {
    var that = this;
    if (this.data.scanResult && this.data.name && this.data.phone &&this.data.customer && this.data.description) {
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
          console.log(res.data)
          if (res.data.length == 0) {
            db.collection('db-zc').add({
              // data 字段表示需新增的 JSON 数据
              data: {
                code: that.data.scanResult,
                applyDesc: that.data.description,
                applyTime: (new Date()).getTime(),
                customer: that.data.customer,
                phone: that.data.phone,
                producer: that.data.name,
                status: 'applyed',
                price: 0,
                repairTime: 0,
                log: '',
              }
            })
              .then(res => {
                console.log(res)
                wx.hideLoading()
                wx.navigateBack()
              })
              .catch(() => {
                wx.showToast({
                  title: '保存失败', icon: 'none'
                })
              })
          } else {
            wx.hideLoading()
            wx.showToast({ title: '不能重复申请', icon: 'none'})
          }
        },
        fail(res) {
          wx.hideLoading()
          wx.showToast({ title: '保存失败', icon: 'none' })
        }
      })
    } else {
      wx.showToast({
        title: '数据不能为空', icon: 'none'
      })
    }
  },
})