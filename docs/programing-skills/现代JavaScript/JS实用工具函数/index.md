# 一、数字操作

## 生成指定范围随机数

通过`Math.floor`处理，得到范围是`[min, max]`的随机数

```js
const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
```

## 数字千分位分割

将货币金额以每3位一个逗号进行分割

```js
const formatThousand = (n) => {
  const num = n.toString();
  const len = num.length;
  if (len <= 3) {
    return num;
  } else {
    const remainder = len % 3;
    // 不是3的倍数
    if (remainder > 0) {
      return num.slice(0, remainder) + ',' + num.slice(remainder, len).match(/\d{3}/g).join(',');
    } else {
      return num.slice(0, len).match(/\d{3}/g).join(',');
    }
  }
}
```

# 二、数组操作

## 数组乱序

数组乱序的作用是把数组随机打乱

```js
const arrScrambling = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    const randomIndex = Math.round(Math.random() * (arr.length - 1 - i)) + i;
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
  }
  return arr;
}
```

## 数组中随机获取一个

```js
const sample = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
}
```

## 数组去重

### ES6 Set去重

```JavaScript
function unique(arr) {
  return Array.from(new Set(arr));
}
```

### reduce+includes

这种方式有缺点，就是对象形式无法去重，但是NaN可以

```JavaScript
function unique(arr) {
  return arr.reduce((prev, cur) => {
    prev.includes(cur) ? prev : [...prev, cur], []
  });
}
```

### hasOwnProperty()推荐

`hasOwnProperty()`方法会返回一个布尔值，指示对象自身属性中是否具有指定的属性

```JavaScript
function unique(arr) {
  let obj = {};
  let res = arr.filter((item, index, array) => {
    if (obj.hasOwnProperty(typeof item + item)) {
      return false;
    } else {
      obj[typeof item + item] = true;
      return true;
    }
  })
  return res;
}
```

## 数组扁平化

### 纯递归

```JavaScript
let flatten = function (arr) {
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (Array.isArray(item)) {
      flatten(item);
    } else {
      res.push(item);
    }
  }
  return res;
}
```

### reduce+递归

```JavaScript
function flatten(arr) {
  return arr.reduce((res, item) => {
    return res.concat(Array.isArray(item) ? flatten(item) : item)
  }, []);
}
```

# 三、字符串操作

## 生成随机字符串

```js
const randomString = (len) => {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789';
  const strLen = chars.length;
  let randomStr = '';
  for (let i = 0; i < len; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * strLen));
  }
  return randomStr;
};
```

## 字符串首字母大写

```js
const fistLetterUpper = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
```

## 短横线和驼峰互转

```js
// 驼峰转短横线
const getKebabCase = (str) => {
  return str.replace(/[A-Z]/g, (item) => '-' + item.toLowerCase())
}
// 短横线转驼峰
const getCamelCase = (str) => {
  return str.replace(/-([a-z])/g, (i, item) => item.toUpperCase())
}
```

# 四、格式转换

## 数字转大写金额

```js
const digitUppercase = (n) => {
  const fraction = ['角', '分'];
  const digit = [
    '零', '壹', '贰', '叁', '肆',
    '伍', '陆', '柒', '捌', '玖'
  ];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ];
  n = Math.abs(n);
  let s = '';
  for (let i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
  }
  s = s || '整';
  n = Math.floor(n);
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = '';
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  return s.replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
};
```

## 数字转中文数字

```js
const intToChinese = (value) => {
  const str = String(value);
  const len = str.length - 1;
  const idxs = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万', '十', '百', '千', '亿'];
  const num = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  return str.replace(/([1-9]|0+)/g, ($, $1, idx, full) => {
    let pos = 0;
    if ($1[0] !== '0') {
      pos = len - idx;
      if (idx == 0 && $1[0] == 1 && idxs[len - idx] == '十') {
        return idxs[len - idx];
      }
      return num[$1[0]] + idxs[len - idx];
    } else {
      let left = len - idx;
      let right = len - idx + $1.length;
      if (Math.floor(right / 4) - Math.floor(left / 4) > 0) {
        pos = left - left % 4;
      }
      if (pos) {
        return idxs[pos] + num[$1[0]];
      } else if (idx + $1.length >= len) {
        return '';
      } else {
        return num[$1[0]]
      }
    }
  });
}
```

# 五、操作存储

## localStorage

- 设置：`window.localStorage.setItem(key, value);`

- 获取：`window.localStorage.getItem(key);`

- 删除：`window.localStorage.removeItem(key);`

## cookie

### 设置cookie

```js
const setCookie = (key, value, expire) => {
    const d = new Date();
    d.setDate(d.getDate() + expire);
    document.cookie = `${key}=${value};expires=${d.toUTCString()}`
};
```

### 获取cookie

```js
const getCookie = (key) => {
  const cookieStr = unescape(document.cookie);
  const arr = cookieStr.split('; ');
  let cookieValue = '';
  for (let i = 0; i < arr.length; i++) {
    const temp = arr[i].split('=');
    if (temp[0] === key) {
      cookieValue = temp[1];
      break
    }
  }
  return cookieValue
};
```

### 删除cookie

```js
const delCookie = (key) => {
  document.cookie = `${encodeURIComponent(key)}=;expires=${new Date()}`
};
```

# 六、格式校验

## 校验身份证号

```js
const checkCardNo = (value) => {
  let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return reg.test(value);
};
```

## 校验是否含中文

```js
const haveCNChars = (value) => {
  return /[\u4e00-\u9fa5]/.test(value);
}
```

## 校验是否为中国大陆的邮政编码

```js
const isPostCode = (value) => {
  return /^[1-9][0-9]{5}$/.test(value.toString());
}
```

## 校验是否为IPv6地址

```js
const isIPv6 = (str) => {
  return Boolean(str.match(/:/g) ? str.match(/:/g).length <= 7 : false && /::/.test(str) ? /^([\da-f]{1,4}(:|::)){1,6}[\da-f]{1,4}$/i.test(str) : /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(str));
}
```

## 校验是否为邮箱地址

```js
const isEmail = (value) {
  return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value);
}
```

## 校验是否为中国大陆手机号

```js
const isTel = (value) => {
  return /^1[3,4,5,6,7,8,9][0-9]{9}$/.test(value.toString());
}
```

## 校验是否包含emoji表情

```js
const isEmojiCharacter = (value) => {
  value = String(value);
  for (let i = 0; i < value.length; i++) {
    const hs = value.charCodeAt(i);
    if (0xd800 <= hs && hs <= 0xdbff) {
      if (value.length > 1) {
        const ls = value.charCodeAt(i + 1);
        const uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
        if (0x1d000 <= uc && uc <= 0x1f77f) {
          return true;
        }
      }
    } else if (value.length > 1) {
      const ls = value.charCodeAt(i + 1);
      if (ls == 0x20e3) {
        return true;
      }
    } else {
      if (0x2100 <= hs && hs <= 0x27ff) {
        return true;
      } else if (0x2B05 <= hs && hs <= 0x2b07) {
        return true;
      } else if (0x2934 <= hs && hs <= 0x2935) {
        return true;
      } else if (0x3297 <= hs && hs <= 0x3299) {
        return true;
      } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
        || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
        || hs == 0x2b50) {
        return true;
      }
    }
  }
  return false;
}
```

## 七、URL

## 获取URL列表

```js
const GetRequest = (url) => {
  // 将 ? 后面的字符串取出来
  const paramsStr = /.+\?(.+)$/.exec(url)[1];
  // 将字符串以 & 分割后存到数组中
  const paramsArr = paramsStr.split('&');
  let paramsObj = {};
  // 将 params 存到对象中
  paramsArr.forEach(param => {
    // 处理有 value 的参数
    if (/=/.test(param)) {
      // 分割 key 和 value
      let [key, val] = param.split('=');
      // 解码
      val = decodeURIComponent(val);
      // 判断是否转为数字
      val = /^\d+$/.test(val) ? parseFloat(val) : val;
      // 如果对象有 key，则添加一个值
      if (paramsObj.hasOwnProperty(key)) {
        paramsObj[key] = [].concat(paramsObj[key], val);
      } else {
        // 如果对象没有这个 key，创建 key 并设置值
        paramsObj[key] = val;
      }
    } else {
      // 处理没有 value 的参数
      paramsObj[param] = true;
    }
  })
  return paramsObj;
};
```

测试：

```js
const res = GetRequest('https://localhost:8080/api/test?name=long&age=22&sex=1');
console.log(res);
/*
{ name: 'long', age: 22, sex: 1 }
*/
```

## 拼接成URL参数

传入一个对象，根据键值对拼接成URL参数形式，不支持嵌套对象

```js
const params2Url = (obj) => {
  const params = [];
  for (let key in obj) {
    params.push(`${key}=${obj[key]}`);
  }
  return encodeURIComponent(params.join('&'));
}
```

## 修改URL中的参数

```js
const replaceParamVal = (oUrl, paramName, replaceWith) => {
  const rgx = new RegExp(paramName + '=([^&]*)', 'gi');
  return oUrl.replace(rgx, paramName + '=' + replaceWith);
}
```
