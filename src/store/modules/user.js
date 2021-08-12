import storage from 'store'
import { login, getInfo, logout, checktoken, getAccessTokenByJumpToken } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { rolePermissions } from '@/config/role.permissinos'
import { integrate } from '@/config/integrate.permissinos'
import { Private } from '@/config/private.permissinos'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          if (response.code === '200' || response.code === 200) {
            var result = response
            storage.set(ACCESS_TOKEN, result.access_token, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', result.access_token)
          } else {
            reject(response.msg)
          }
          // storage.set(ACCESS_TOKEN, result.access_token, 7 * 24 * 60 * 60 * 1000)
          // commit('SET_TOKEN', result.access_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取urltoken
    nByJumpToke ({ commit }, usertoken) {
      return new Promise((resolve) => {
        getAccessTokenByJumpToken(usertoken).then(res => {
          if (res.code === 200) {
            storage.set(ACCESS_TOKEN, res.data, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', res.data)
            resolve(res)
          } else {
            resolve(res)
          }
        })
      })
    },
    // 判断token是否失效
    getchecktoken ({ commit }) {
      return new Promise((resolve) => {
        checktoken({ token: storage.get(ACCESS_TOKEN) }).then(res => {
          resolve(res)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
            const result = response.data
            result.role = {}
            if (result.enterpriseType === 'integrate') {
              result.role.permissions = integrate
            } else if (result.enterpriseType === 'public') {
              result.role.permissions = rolePermissions
            } else if (result.enterpriseType === 'private') {
              result.role.permissions = Private
            } else {
              result.role.permissions = rolePermissions
            }
            if (result.role && result.role.permissions.length > 0) {
              const role = result.role
              role.permissions = result.role.permissions
              role.permissions.map(per => {
                if (result.enterprise.enableExtraAccount) {
                } else {
                  if (per.permissionId === 'order') {
                    per.permissionId = 'order1'
                  }
                }
                if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                  const action = per.actionEntitySet.map(action => { return action.action })
                  per.actionList = action
                }
              })
              role.permissionList = role.permissions.map(permission => { return permission.permissionId })
              // if (result.enterpriseRoleCode === 'e_owner' || result.enterpriseRoleCode === 'e_admin') {
                commit('SET_ROLES', result.role)
                commit('SET_INFO', result)
              // } else {
              // }
            } else {
              reject(new Error('getInfo: roles must be a non-null array !'))
            }

            commit('SET_NAME', { name: result.name, welcome: welcome() })
            commit('SET_AVATAR', result.avatar)
            resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
          window.location.reload()
          // console.log(state)
          // console.log(getters)
        })
      })
    }

  }
}

export default user
