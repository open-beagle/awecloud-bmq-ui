module.exports.GetProperty = function (obj, prop) {
  if (!obj) return null;
  let res = obj;
  if (prop) {
    let props = prop.split('.');
    for (let i = 0; i < props.length; i++) {
      res = res[props[i]];
      if (typeof res == "undefined" || res == null) {
        return null;
      }
    }
  }
  return res;
}

module.exports.dateFormat = function (fmt, timestamp) {
  let date = new Date(timestamp);
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return fmt;
}

module.exports.dateStringTransform = function (date) {
  /* 
    input: 2020-06-12T16:38:11+08:00
    output: 2020-06-12 16:38:11
  */
  if (String(date).indexOf("T") != -1) {
    let arr = date.split("T");
    let t = arr[1];
    let tarr = t.split('.000');
    let marr = tarr[0].split(':');
    let h = parseInt(marr[0]) >= 10 ? parseInt(marr[0]) : "0" + parseInt(marr[0]);
    let m = parseInt(marr[1]) >= 10 ? parseInt(marr[1]) : "0" + parseInt(marr[1]);
    let s = parseInt(marr[2]) >= 10 ? parseInt(marr[2]) : "0" + parseInt(marr[2]);
    let dd = arr[0] + " " + h + ":" + m + ":" + s;
    return dd;
  } else {
    return date;
  }
}

module.exports.dateStringTransformChat = function (date) {
  /* 
    input: 2020-06-12T16:38:11+08:00
    output: 2020-06-12 16:38:11
  */
  if (String(date).indexOf("T") != -1) {
    let arr = date.split("T");
    let t = arr[1];
    let arr1 = arr[0].split("-")
    let tarr = t.split('.000');
    let marr = tarr[0].split(':');
    let h = parseInt(marr[0]) >= 10 ? parseInt(marr[0]) : "0" + parseInt(marr[0]);
    let m = parseInt(marr[1]) >= 10 ? parseInt(marr[1]) : "0" + parseInt(marr[1]);
    let s = parseInt(marr[2]) >= 10 ? parseInt(marr[2]) : "0" + parseInt(marr[2]);
    let dd = arr1[1]+"-"+arr1[2] + " " + h + ":" + m;
    return dd;
  } else if(date){
    let arr = date.split(" ");
    let t = arr[1];
    let arr1 = arr[0].split("-")
    let tarr = t.split('.000');
    let marr = tarr[0].split(':');
    let h = parseInt(marr[0]) >= 10 ? parseInt(marr[0]) : "0" + parseInt(marr[0]);
    let m = parseInt(marr[1]) >= 10 ? parseInt(marr[1]) : "0" + parseInt(marr[1]);
    let s = parseInt(marr[2]) >= 10 ? parseInt(marr[2]) : "0" + parseInt(marr[2]);
    let dd = arr1[1]+"-"+arr1[2] + " " + h + ":" + m;
    return dd;
  }
}

module.exports.downloadFileFormat = function (fileUrl) {
  /* 
    input: /apaas/static/docs/image/images/1234.png
    output: 1234.png
  */
  if (fileUrl != "") {
    return fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
  } else {
    return "";
  }
}

module.exports.downloadFileFormatNew = function (fileUrl) {
  /* 
    input: /apaas/static/docs/image/images/1234_qq234ewr123.png
    output: 1234.png
  */
  if (fileUrl != "") {
    var temp = fileUrl.split('/')[fileUrl.split('/').length-1]
    var name = temp.split('_')[0]
    var type = temp.split('_')[temp.split('_').length-1].split('.')[1]
    if(temp.indexOf('_')==-1){
      return name
    }else{
      return name+'.'+type
    }
  } else {
    return "";
  }
}

module.exports.numberFormat = function (num, decimals) {
  /* 
    input:  10000 1000
    output: 10    1000
  */
  if (num > 10000) {
    let mathNum = num / 10000;
    let arr = mathNum.toString().split(".");
    let str = "";
    if (arr.length == 2) {
      str += arr[0] + ".";
      if (arr[1].length == 1) {
        arr[1] = arr[1].toString() + "0";
        str += arr[1];
      } else {
        str += arr[1].substr(0, 2)
      }
    } else {
      return mathNum;
    }
    return str;
  } else {
    return num;
  }
}

module.exports.CreationDateDesc = function (timestamp) {
  let date = new Date(timestamp);
  return date.toLocaleDateString("zh-CN", {
    timeZone: "Asia/Shanghai"
  });
}

module.exports.join_str = function (arr,str,sp) {
  let temp = ''
  if(arr){
    if(arr.length){
      arr.forEach((e,idx) => {
        if(idx==arr.length-1){
          temp = temp + e[str]
        }else{
          temp = temp + e[str] + sp
        }
      });
      return temp
    }else{
      return ''
    }
  }else{
    return arr
  }
}

module.exports.getQueryString = function (name, url) {
  let search = url.substr(url.indexOf("?"));
  let theRequest = new Object();
  if (search.indexOf("?") != -1) {
    let str = search.substr(1);
    strs = str.split("&");
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return theRequest[name];
}

module.exports.timeForMatReduce = function(count) {
  // 拼接时间
  let time1 = new Date()
  time1.setTime(time1.getTime() - (24 * 60 * 60 * 1000))
  let Y1 = time1.getFullYear()
  let M1 = ((time1.getMonth() + 1) >= 10 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1))
  let D1 = (time1.getDate() >= 10 ? time1.getDate() : '0' + time1.getDate())
  let timer1 = Y1 + '-' + M1 + '-' + D1 // 当前时间
  let time2 = new Date()
  time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * count))
  let Y2 = time2.getFullYear()
  let M2 = ((time2.getMonth() + 1) >= 10 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
  let D2 = (time2.getDate() >= 10 ? time2.getDate() : '0' + time2.getDate())
  let timer2 = Y2 + '-' + M2 + '-' + D2 // 之前的7天或者30天
  return {
    t1: timer1,
    t2: timer2
  }
}

module.exports.timeForMatAdd = function(count) {
  // 拼接时间
  let time1 = new Date()
  time1.setTime(time1.getTime() - (24 * 60 * 60 * 1000))
  let Y1 = time1.getFullYear()
  let M1 = ((time1.getMonth() + 1) >= 10 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1))
  let D1 = (time1.getDate() >= 10 ? time1.getDate() : '0' + time1.getDate())
  let timer1 = Y1 + '-' + M1 + '-' + D1 // 当前时间
  let time2 = new Date()
  time2.setTime(time2.getTime() + (24 * 60 * 60 * 1000 * count))
  let Y2 = time2.getFullYear()
  let M2 = ((time2.getMonth() + 1) >= 10 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
  let D2 = (time2.getDate() >= 10 ? time2.getDate() : '0' + time2.getDate())
  let timer2 = Y2 + '-' + M2 + '-' + D2 // 之前的7天或者30天
  return {
    t1: timer1,
    t2: timer2
  }
}