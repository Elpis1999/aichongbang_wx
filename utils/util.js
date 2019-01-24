const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const conversionFormatTime = data => {
  //获取年月日分
  let date = new Date();
  let year = date.getFullYear(); //年
  let month = date.getMonth() + 1; //月
  let day = date.getDate(); //日
  let hours = date.getHours(); //小时
  let minutes = date.getMinutes(); //分钟
  if (typeof data === "object") {
    let timeArr = [];
    let timeAry = [];
    for (let i = 0; i < data.length; i++) {
      let time = data[i].split("-");
      let serviceYear = time[0];
      let serviceMonth = time[1];
      let serviceDay = time[2];
      let serviceHours = time[3].split(":")[0];
      let serviceMinutes = time[3].split(":")[1];
      if (serviceYear == year && serviceMonth == month && serviceDay == day && serviceHours >= hours && serviceMinutes > minutes) {
        timeArr.push("今天" + time[3] + "-" + time[4]);
        timeAry.push(data[i]);
      } else if (serviceYear == year && serviceMonth == month && serviceDay == day + 1) {
        timeArr.push("明天" + time[3] + "-" + time[4]);
        timeAry.push(data[i]);
      } else if (serviceYear == year && serviceMonth == month && serviceDay == day + 2) {
        timeArr.push("后天" + time[3] + "-" + time[4]);
        timeAry.push(data[i]);
      } else if ((serviceYear > year) || (serviceYear >= year && serviceMonth > month) || (serviceYear >= year && serviceMonth >= month && serviceDay > day) || (serviceYear >= year && serviceMonth >= month && serviceDay >= day && serviceHours > hours) || (serviceYear >= year && serviceMonth >= month && serviceDay >= day && serviceHours >= hours && serviceMinutes > minutes)) {
        timeArr.push(data[i]);
        timeAry.push(data[i]);
      }
    }
    return {
      timeArr,
      timeAry
    }
  } else if (typeof data === 'string') {
    let str = "";
    let time = data.split("-");
    let serviceYear = time[0];
    let serviceMonth = time[1];
    let serviceDay = time[2];
    let serviceHours = time[3].split(":")[0];
    let serviceMinutes = time[3].split(":")[1];
    if (serviceYear == year && serviceMonth == month && serviceDay == day && serviceHours >= hours && serviceMinutes > minutes) {
      str = "今天" + time[3] + "-" + time[4];
    } else if (serviceYear == year && serviceMonth == month && serviceDay == day + 1) {
      str = "明天" + time[3] + "-" + time[4];
    } else if (serviceYear == year && serviceMonth == month && serviceDay == day + 2) {
      str = "后天" + time[3] + "-" + time[4];
    } else if (serviceYear > year || (serviceYear >= year && serviceMonth > month) || (serviceYear >= year && serviceMonth >= month && serviceDay > day) || (serviceYear >= year && serviceMonth >= month && serviceDay >= day && serviceHours > hours) || (serviceYear >= year && serviceMonth >= month && serviceDay >= day && serviceHours >= hours && serviceMinutes > minutes)) {
      str = date[i];
    } else {
      str = "已失效"
    }
    return str;
  } else {
    return {};
  }
}


function deepcopy(arr) {
  // 在函数内使用var声明一个拷贝数组用于拷贝
  var copyArr = new Array;
  for (i = 0; i < arr.length; i++) {
    // 判断第i位是否为数组(二维)
    if (typeof arr[i] == "object") {
      // 若第i位是数组我们就将copyArr的第i位也置为数组（这里使用
      copyArr[i] = new Array();
      for (j = 0; j < arr[i].length; j++) {
        copyArr[i][j] = arr[i][j];
      }
      // 如果不是数组则直接赋值
    } else {
      copyArr[i] = arr[i];
    }
  }
  // 返回我们的拷贝数组
  return copyArr;
}



module.exports = {
  formatTime: formatTime,
  conversionFormatTime,
  deepcopy
}