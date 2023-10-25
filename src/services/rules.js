// 密码
export function validatePassword(rule, value, callback) {
  const reg = new RegExp(/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,20}$/);

  setTimeout(() => {
    if (value == "") {
      callback(new Error("请输入密码"));
    } else if (!reg.test(value)) {
      callback(new Error("8--20位字符，必须由字母、数字、特殊符号组成"));
    } else {
      callback();
    }
  }, 100);
}

// 手机号
export function validatePhone(rule, value, callback) {
  const reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;

  setTimeout(() => {
    if (value == "") {
      callback(new Error("请输入手机号码"));
    } else if (!reg.test(value)) {
      callback(new Error("请输入正确的手机号码"));
    } else {
      callback();
    }
  });
}

// 邮箱
export function validateEmail(rule, value, callback) {
  const reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-|_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;

  setTimeout(() => {
    if (value == "") {
      callback(new Error("请输入邮箱"));
    } else if (!reg.test(value)) {
      callback(new Error("请输入正确的邮箱"));
    } else {
      callback();
    }
  });
}

// 邮箱
export function validateIdNumber(rule, value, callback) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error("请输入正确身份证号码"));
    }
  }, 100);
} // 验证身份证号码
