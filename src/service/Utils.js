// @flow
export default {
  /**
   * timeout 函数的 Promise 版
   */
  sleep: async (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout)),

  retrieveProp: (target: any, key: string) => (typeof target === 'undefined' || target === null) ? undefined : target[key],

  /**
   * 是否是开发环境
   */
  dev: process.env.NODE_ENV === 'development',

}
// 按照字段值排序
export function sortByField(propertyName) {
  return function (object1, object2) {
    var value1 = parseFloat(object1[propertyName]);
    var value2 = parseFloat(object2[propertyName]);
    if (value1 > value2) {
      return -1;
    } else if (value1 < value2) {
      return 1;
    } else {
      return 0;
    }
  }
}

export function sortById(propertyName) {
  return function (object1, object2) {
    var value1 = object1[propertyName];
    var value2 = object2[propertyName];
    if (value1 < value2) {
      return -1;
    } else if (value1 > value2) {
      return 1;
    } else {
      return 0;
    }
  }
}
export function randomWord(randomFlag, min, max){
  var str = "",
      range = min,
      pos = 0,
      arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  // 随机产生
  if(randomFlag){
      range = Math.round(Math.random() * (max-min)) + min;
  }
  for(var i=0; i<range; i++){
      pos = Math.round(Math.random() * (arr.length-1));
      str += arr[pos];
  }
  return str;
}
