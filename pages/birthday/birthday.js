var util = require('../../utils/horoscope.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    dateIsSelected: false,
    datePickerValue: ['', '', '',''],
    datePickerIsShow: false,
    bazi:NaN,
    logs: [],
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
    var logs = wx.getStorageSync('logs') || [];
    this.setData({ "logs": logs });
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
  showDatePicker: function (e) {
    // this.data.datePicker.show(this);
    this.setData({
      datePickerIsShow: true,
    });
  },
  
  datePickerOnSureClick: function (e) {
    this.setData({
      date: `${e.detail.value[0]}年${e.detail.value[1]}月${e.detail.value[2]}日${e.detail.value[3]}时`,
      datePickerValue: e.detail.value,
      datePickerIsShow: false,
      dateIsSelected: true,
    });
  },
  
  datePickerOnCancelClick: function (event) {
    this.setData({
      datePickerIsShow: false,
    });
  },

  process: function () {
    if (!this.data.dateIsSelected) {
      return;
    }
    var date = new Date(this.data.datePickerValue[0], this.data.datePickerValue[1]-1, this.data.datePickerValue[2], this.data.datePickerValue[3]);
    this.setData({bazi:util.horoscope(date)});
    this.data.logs.push(this.data.date +'\n\r' + this.data.bazi);
    wx.setStorageSync("logs", this.data.logs);
  }
})