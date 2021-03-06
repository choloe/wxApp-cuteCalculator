Page({
  data: {
    idd: "delete",
    idc: "clear",
    idp: "%",
    idadd: "＋",
    id9: "9",
    id8: "8",
    id7: "7",
    idj: "-",
    id6: "6",
    id5: "5",
    id4: "4",
    idx: "×",
    id3: "3",
    id2: "2",
    id1: "1",
    iddiv: "÷",
    id0: "0",
    iddot: ".",
    ide: "＝",
    content: "",
    screenData: "0",
    operaSymbo: { "＋": "+", "-": "-", "×": "*", "÷": "/", ".": "." },
    done:[],
    flag:false,
    lastIsOperaSymbo: false,
    complete:false,
    arr: [],
    curIndex: 0,
  },
  onLoad: function (options) {
  },
  onReady: function () {
    
    // 页面渲染完成
  },
  onShow: function () {
    var logs = wx.getStorageSync('logs') || [];
    this.setData({ "logs": logs });
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  clickBtn: function (event) {
    var id = event.target.id;
    if (id == this.data.idd) {  //del
      var data = this.data.screenData;
      if (data == "0") {
        return;
      }
      data = data.substring(0, data.length - 1);
      if (data == "" || data == "-") {
        data = 0;
      }
      this.setData({ "screenData": data });
      this.data.arr.pop();
    } 
    else if (id == this.data.idc) {  //清屏C
      this.setData({ "screenData": "0" });
      this.setData({ "done": [] });
      this.data.arr.length = 0;
      this.data.done.length=0;
    } 
    else if (id == this.data.ide) {  //等于＝
      var data = this.data.screenData; 
      if (data == "0" ||this.data.lastIsOperaSymbo) {
        return;
      }
      var lastWord = data.charAt(data.length);
      if (isNaN(lastWord)) {
        return;
      }
      var num = "";
      var arr = this.data.arr;
      var optarr = [];
      for (var i in arr) {
        if (isNaN(arr[i]) == false || arr[i]==this.data.iddot||arr[i] == this.data.idd || arr[i] == this.data.idt) {
          num += arr[i];
        }
        else if(arr[i]=="%"){
          num=num/100;
        } else {
          optarr.push(num);
          optarr.push(arr[i]);
          num = "";
        }
      }
      optarr.push(Number(num));
      var result = Number(optarr[0]) * 1.0;
      for (var i = 1; i < optarr.length; i++) {
        if (isNaN(optarr[i])) {
          if (optarr[i] == this.data.idadd) {
            result += Number(optarr[i + 1]);
          } 
          else if (optarr[i] == this.data.idj) {
            result -= Number(optarr[i + 1]);
          } 
          else if (optarr[i] == this.data.idx) {
            result *= Number(optarr[i + 1]);
          } 
          else if (optarr[1] == this.data.iddiv) {
            result /= Number(optarr[i + 1]);
          }
        }
      }
      if ((result + "").split('.')[1]!=undefined){
        result = result.toFixed(2);
      }
      //存储历史记录
      this.data.logs.push(data + '=' + result);
      wx.setStorageSync("logs", this.data.logs);
      console.log(this.data.logs);
      this.data.arr.length = 0;
      this.data.arr.push(result);
      this.data.done.push(data + "=" + result);
      if(this.data.done.length>4){
        this.data.done.shift();
      }
      this.setData({ "screenData": result + "" }); 
      this.setData({"done":this.data.done});
      this.setData({ "complete": true });
    } 
    else {
      if (this.data.operaSymbo[id]||id=="%") { //如果是符号+-*/
        if (this.data.lastIsOperaSymbo ) {
          return;
        }
      }
      var sd = this.data.screenData;
      var data;
      if (id == "×" || id =="÷"||id=="."||id=="%"||sd!="0") {
        data = sd + id;
      } 
      else {
        data = id;
      }
      this.setData({ "screenData": data });
      this.data.arr.push(id);
      if (this.data.operaSymbo[id]&&id!="%") {
        this.setData({ "lastIsOperaSymbo": true });
      } 
      else {
        this.setData({ "lastIsOperaSymbo": false });
      }
    }
  }
})