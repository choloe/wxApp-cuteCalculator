var util = require('../../utils/converter.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateIsSelected: false,
    show: false,
    dateType:'',
    date:'',
    year:'',
    month:'',
    day:'',
    cvt_date: NaN,
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
  submit: function (e) {
    if (e.detail.dateType=='公历'){
      this.setData({
        date: `${e.detail.dateYear}年${e.detail.dateMonth}月${e.detail.dateDay}日`,
      })
    }
    else{
      this.setData({
        date: `${e.detail.dateYear}${e.detail.dateMonth}${e.detail.dateDay}`,
      })
    }
    this.setData({
      dateType: e.detail.dateType,
      year: e.detail.dateYear,
      month: e.detail.dateMonth,
      day: e.detail.dateDay
    }) 
  },
  showDatePickerPlus: function () {
    this.setData({
      show: true
    })
  },
 convert:function(){
   var content = "";
   var converter = new util.LunarSolarConverter();
   if(this.data.dateType=="公历"){
     var solar = new util.Solar();
     solar.solarYear = this.data.year;
     solar.solarMonth = parseInt(this.data.month, 10);
     solar.solarDay = parseInt(this.data.day, 10);
     var lunar = converter.SolarToLunar(solar);
      if(lunar.isleap){
        switch(lunar.lunarMonth){
          case 2: lunar.lunarMonth="闰二月";break;
          case 3: lunar.lunarMonth="闰三月"; break;
          case 4: lunar.lunarMonth="闰四月"; break;
          case 5: lunar.lunarMonth="闰五月"; break;
          case 6: lunar.lunarMonth="闰六月"; break;
          case 7: lunar.lunarMonth="闰七月"; break;
          case 8: lunar.lunarMonth="闰八月"; break;
          case 9: lunar.lunarMonth="闰九月"; break;
          case 10:lunar.lunarMonth="闰十月"; break;
        }
      }
      else{
        switch (lunar.lunarMonth) {
          case 1: lunar.lunarMonth="正月";break;
          case 2: lunar.lunarMonth= "二月"; break;
          case 3: lunar.lunarMonth= "三月"; break;
          case 4: lunar.lunarMonth= "四月"; break;
          case 5: lunar.lunarMonth= "五月"; break;
          case 6: lunar.lunarMonth= "六月"; break;
          case 7: lunar.lunarMonth= "七月"; break;
          case 8: lunar.lunarMonth= "八月"; break;
          case 9: lunar.lunarMonth= "九月"; break;
          case 10:lunar.lunarMonth= "十月"; break;
          case 11: lunar.lunarMonth="冬月"; break;
          case 12: lunar.lunarMonth ="腊月"; break;
      }
      switch(lunar.lunarDay){
        case 1:lunar.lunarDay="初一";break;
        case 2: lunar.lunarDay = "初二"; break;
        case 3: lunar.lunarDay = "初三"; break;
        case 4: lunar.lunarDay = "初四"; break;
        case 5: lunar.lunarDay = "初五"; break;
        case 6: lunar.lunarDay = "初六"; break;
        case 7: lunar.lunarDay = "初七"; break;
        case 8: lunar.lunarDay = "初八"; break;
        case 9: lunar.lunarDay = "初九"; break;
        case 10: lunar.lunarDay = "初十"; break;
        case 11: lunar.lunarDay = "十一"; break;
        case 12: lunar.lunarDay = "十二"; break;
        case 13: lunar.lunarDay = "十三"; break;
        case 14: lunar.lunarDay = "十四"; break;
        case 15: lunar.lunarDay = "十五"; break;
        case 16: lunar.lunarDay = "十六"; break;
        case 17: lunar.lunarDay = "十七"; break;
        case 18: lunar.lunarDay = "十八"; break;
        case 19: lunar.lunarDay = "十九"; break;
        case 20: lunar.lunarDay = "二十"; break;
        case 21: lunar.lunarDay = "廿一"; break;
        case 22: lunar.lunarDay = "廿二"; break;
        case 23: lunar.lunarDay = "廿三"; break;
        case 24: lunar.lunarDay = "廿四"; break;
        case 25: lunar.lunarDay = "廿五"; break;
        case 26: lunar.lunarDay = "廿六"; break;
        case 27: lunar.lunarDay = "廿七"; break;
        case 28: lunar.lunarDay = "廿八"; break;
        case 29: lunar.lunarDay = "廿九"; break; 
        case 30: lunar.lunarDay = "三十"; break;
      }
     }
      this.setData({cvt_date: `${lunar.lunarYear}年${lunar.lunarMonth}${lunar.lunarDay}`})
   }
   else {
     var lunar = new util.Lunar();
     lunar.lunarYear = this.data.year.substring(0,4);
     lunar.lunarMonth =this.data.month;
     lunar.lunarDay = this.data.day;
     var solar = converter.LunarToSolar(lunar);
     this.setData({ cvt_date:`${solar.solarYear}年${solar.solarMonth}月${solar.solarDay}日`})
   }
   this.data.logs.push(this.data.date+">>"+this.data.cvt_date);
   wx.setStorageSync("logs",this.data.logs);
 }
})