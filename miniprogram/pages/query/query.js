// miniprogram/pages/query/query.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scanResult: '',
    producer: '',
    startDate: '',
    endDate: ''
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

  bindStartDateChange(e) {
    console.log('开始日期为', e.detail.value)
    this.setData({
      startDate: e.detail.value
    })
  },

  bindEndDateChange(e) {
    console.log('结束时间为', e.detail.value)
    this.setData({
      endDate: e.detail.value
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

  resultInput: function (e) {
    this.setData({
      scanResult: e.detail.value
    })
  },

  producerInput: function (e) {
    this.setData({
      producer: e.detail.value
    })
  },

  formatTime: function (src) {
    var date = new Date(src)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    return year + "." + month + "." + day;
  },

  onQuery: function () {
    var that = this;
    if (that.data.scanResult || that.data.producer || (this.data.startDate && this.data.endDate)) {
      wx.showLoading({
        title: '查询中...',
      })
      const db = wx.cloud.database()
      var selecters = {};
      var selecter = {};
      if (this.data.scanResult && this.data.producer) {
        selecter = { code: this.data.scanResult, producer: this.data.producer}
      } else if (this.data.scanResult) {
        selecter = { code: this.data.scanResult }
      } else {
        selecter = { producer: this.data.producer }
      }
      if (this.data.startDate && this.data.endDate) {
        var sDate = new Date(this.data.startDate.replace(/-/g, "/")).getTime()
        var eDate = new Date((this.data.endDate + ' 23:59:59').replace(/-/g, "/")).getTime()
        console.log('开始时间为' + sDate + ' 结束时间为' + eDate)
        const _ = db.command
        selecters = _.or([
          {
            applyTime: _.gt(sDate).and(_.lt(eDate))
          },
          {
            repairTime: _.gt(sDate).and(_.lt(eDate))
          },
          selecter
        ])
      } else {
        selecters = selecter;
      }
      db.collection('db-zc').where(selecters)
        .get({
          success(res) {
            // res.data 是包含以上定义的两条记录的数组
            wx.hideLoading()
            console.log(res.data)
            if (res.data.length == 0) {
              wx.showToast({ title: '无申请记录', icon: 'none' })
              that.setData({ items: {} });
            } else {
              res.data.forEach(function (value, i) {
                value.applyTime = that.formatTime(value.applyTime)
                value.repairTime = that.formatTime(value.repairTime)
              })
              that.setData({items: res.data})
            }
          }
        })
    } else {
      wx.showToast({
        title: '查询条件不能都为空', icon: 'none'
      })
      that.setData({ items: {} });
    }
  }
})