import request from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: '/oauth/token',
    method: 'post',
    auth: {
      username: 'console',
      password: 'sUWiy6sNiXd0e5Lh'
    },
    params: parameter
  })
}

export function getInfo () {
  return request({
    url: '/api/v1/user/info/rich',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout () {
  return request({
    url: '/api/v1/user/logout',
    method: 'post'
  })
}
// token是否失效
export function checktoken (parameter) {
  return request({
    url: '/oauth/check_token',
    method: 'get',
    params: parameter
  })
}
// 埋点
export function recordLog (parameter) {
  return request({
    url: '/api/noauth/v1/sys/spm/record/log',
    method: 'get',
    params: parameter
  })
}
// url自带token获取Access-Token
export function getAccessTokenByJumpToken (parameter) {
  return request({
    url: '/api/v1/user/login/getAccessTokenByJumpToken',
    method: 'get',
    params: parameter
  })
}
