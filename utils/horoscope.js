var util = require('../utils/converter.js');
// 算出一年内，所有节气的公历日期，有误差
function ySolarTermArr(y) {
  var ySolarTerm = [];
  var sTermInfo = new Array(0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758); // 节气数组

  for (var i = 0; i <= 23; i++) {
    ySolarTerm.push(new Date((31556925974.7 * (y - 1900) + sTermInfo[i] * 60000) + Date.UTC(1900, 0, 6, 2, 5)));
  }

  return ySolarTerm;
}

// 计算节令月
function festiveMonth(date, lunarCalendar) {
  var ySolarTerm = ySolarTermArr(date.getFullYear());

  var m = date.getMonth();
  var d = date.getDate();

  var nowMonthst = [] //当月节日
  var converter = new util.LunarSolarConverter();
  var solar = new util.Solar();
  for (var i = 0; i < ySolarTerm.length; i++) {
    if (ySolarTerm[i].getMonth() == m) {
      nowMonthst.push(ySolarTerm[i]);
    }
  }

  var nowMonthDivideDay,
    tempslDay = 0;

  for (var i = 0; i < nowMonthst.length; i++) {
    solar.solarYear = nowMonthst[i].getFullYear();
    solar.solarMonth = parseInt(nowMonthst[i].getMonth(), 10);
    solar.solarDay = parseInt(nowMonthst[i].getDate(), 10);
    var lunar = converter.SolarToLunar(solar).day;


    if (lunar > tempslDay) {
      tempslDay = lunar;

      nowMonthDivideDay = nowMonthst[i].getDate();
    }
  }

  var festiveMonth = lunarCalendar.lunarMonth;

  if (nowMonthDivideDay <= d && !lunarCalendar.leap) { // 判断 当前的月的 以节气为分界的分界天（公历 是否小于 当前天（公历，如果刚好在农历是润月，则不变，否则加一
    festiveMonth += 1;
  }

  return festiveMonth;
}

function horoscope(date) { // 根据传入的日期计算生辰八字
  var converter = new util.LunarSolarConverter();
  var solar = new util.Solar();
  solar.solarYear = date.getFullYear();
  solar.solarMonth = parseInt(date.getMonth(), 10)+1;
  solar.solarDay = parseInt(date.getDate(), 10);
  var lunar = converter.SolarToLunar(solar);
  var gan = new Array("甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸");
  var zhi = new Array("子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥");

  

  return y_gz(date) + "年，" + m_gz(date) + "月，" + d_gz(date) + "日，" + h_gz(date) + "时";

  function y_gz(date) { // date 公历日期 ,计算年天干
    var y = lunar.lunarYear;
    var g = gan[(y - 4) % 10]; // 以庚年为序数0
    var z = zhi[(y - 4) % 12]; // 以申年为序数0
    return g + z;
  }

  function m_gz(date) { // 公历日期
    // 月天干地支，以节气来分划分月份，1月 立春始 ， 2月 惊蛰始 ，3月 清明始 以此类推 这里的月份是农历，即节令月。

    // 月天干算法（地支不变
    // 若遇甲或己的年份，正月大致是丙寅；
    // 遇上乙或庚之年，正月大致为戊寅；
    // 丙或辛之年正月大致为庚寅，
    // 丁或壬之年正月大致为壬寅，
    // 戊或癸之年正月大致为甲寅
     

    var month = festiveMonth(date, lunar); // 拿到节令月

    var y_g = y_gz(date).substring(0, 1); // 拿到农历年天干

    var n; // 起始序数
    if ("戊癸".indexOf(y_g) >= 0) {
      n = 0;
    } else if ("甲己".indexOf(y_g) >= 0) {
      n = 2;
    } else if ("乙庚".indexOf(y_g) >= 0) {
      n = 4;
    } else if ("丙辛".indexOf(y_g) >= 0) {
      n = 6;
    } else if ("丁壬".indexOf(y_g) >= 0) {
      n = 8;
    }

    var g = gan[(n + month - 1) % 10];
    var z = zhi[(1 + month) % 12];

    return g + z;
  }

  function d_gz(date) { // 公历日期
    // 日的天干算法
    // 乘五除四九加日，
    // 双月间隔三十天。
    // 一二自加整少一，
    // 三五七八十尾前。
    // 具体参看 ：http://blog.sina.com.cn/s/blog_7e69a9bf0102vv1m.html


    var ms = [0, 0, 0, 1, 1, 2, 2, 3, 4, 4, 5, 5]; // 12个月 每个月前的大月数（就是月份天数大于30天
    var base = 1900;
    var y = date.getFullYear();
    var d = date.getDate();
    var m = date.getMonth();
    var k = 9;
    var f = (m + 1) % 2 === 0 ? 30 : 0;
    var Y = y - base;

    var gz = [];
    var i;
    for (i = 0; i < 60; i++) {
      gz.push(gan[i % 10] + zhi[i % 12]);
    };

    var r = (Y * 5 + Math.floor(Y / 4) + k + d + ms[m] + f) % 60;

    return gz[r - 1];
  }

  function h_gz(date) { // 公历日期
    // 甲己起甲子：甲日、己日夜半的子时起于甲子时，顺推乙丑等。
    // 乙庚起丙子：乙日、庚日夜半的子时起于丙子时，顺推乙丑等。
    // 丙辛起戊子：丙日、辛日夜半的子时起于戊子时，顺推乙丑等。
    // 丁壬起庚子：丁日、壬日夜半的子时起于庚子时，顺推乙丑等。
    // 戊癸起壬子：戊日、癸日夜半的子时起于壬子时，顺推乙丑等。
    if (!date) {
      return new Error("请输入必要的参数！");
    }

    var d_g = d_gz(date).substring(0, 1);
    var h = date.getHours();

    var n; // 起始序数
    if ("甲己".indexOf(d_g) >= 0) {
      n = 0;
    } else if ("乙庚".indexOf(d_g) >= 0) {
      n = 2;
    } else if ("丙辛".indexOf(d_g) >= 0) {
      n = 4;
    } else if ("丁壬".indexOf(d_g) >= 0) {
      n = 6;
    } else if ("戊癸".indexOf(d_g) >= 0) {
      n = 8;
    }

    var g = gan[(Math.ceil(h / 2) + n) % 10];
    var z = zhi[Math.ceil(h / 2) % 12];

    return g + z;
  }
}

module.exports = {
  horoscope: horoscope
}