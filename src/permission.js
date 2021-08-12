import router from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { i18nRender } from '@/locales'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login'] // no redirect whitelist
const loginRoutePath = '/user/login'
const defaultRoutePath = '/home/index'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`))
  /* has token */
  if (to.query.bearer_token) {
    if (to.query.bearer_token !== storage.get(ACCESS_TOKEN)) {
      storage.remove(ACCESS_TOKEN)
      storage.set(ACCESS_TOKEN, to.query.bearer_token, 7 * 24 * 60 * 60 * 1000)
    } else {}
  }
  if (storage.get(ACCESS_TOKEN)) {
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      // check login user.roles is null
      if (store.getters.roles.length === 0) {
        store
        .dispatch('getchecktoken')
        .then(res => {
          if (res.success === true) {
          // request login userInfo
          store
            .dispatch('GetInfo')
            .then(res => {
              // if (res.data.enterpriseRoleCode === 'e_owner' || res.data.enterpriseRoleCode === 'e_admin') {
                const roles = res.data && res.data.role
                // generate dynamic router
                store.dispatch('GenerateRoutes', { roles }).then(() => {
                  // 根据roles权限生成可访问的路由表
                  // 动态添加可访问路由表
                  store.getters.addRouters.map(item => {
                    if (res.data.enterpriseType === 'integrate') {
                      item.redirect = '/author/list'
                    } else if (res.data.enterpriseType === 'public') {
                      item.redirect = '/home/index'
                    } else if (res.data.enterpriseType === 'private') {
                      item.redirect = '/account/list'
                    }
                    return item
                  })
                  router.addRoutes(store.getters.addRouters)
                  // 请求带有 redirect 重定向时，登录自动重定向到该地址
                  const redirect = decodeURIComponent(from.query.redirect || to.path)
                  if (to.path === redirect) {
                    // set the replace: true so the navigation will not leave a history record
                    next({ ...to, replace: true })
                  } else {
                    // 跳转到目的路由
                    next({ path: redirect })
                  }
                })
              // } else {
              //   storage.remove(ACCESS_TOKEN)
              //   notification.error({
              //     message: '错误',
              //     description: '当前用户不具备登录控制台的权限'
              //   })
              // }
            })
            .catch(() => {
              // notification.error({
              //   message: '错误',
              //   description: '请求用户信息失败，请重试'
              // })
              // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
              next({ path: loginRoutePath, query: { redirect: to.fullPath } })
            })
            return true
        } else {
          if (to.query.inviteKey) {
            next()
          } else {
            storage.remove(ACCESS_TOKEN)
            notification.error({
              message: '错误',
              description: '请求用户信息失败，请重试'
            })
            next({ path: loginRoutePath, query: { redirect: to.fullPath } })
          }
        }
      })
      } else {
        next()
      }
    }
  } else {
    if (to.query.token) {
      const data = {
        jumpToken: to.query.token
      }
      store.dispatch('nByJumpToke', data).then(res => {
        if (res.code === 200) {
          next({ path: loginRoutePath, query: { redirect: to.fullPath } })
          NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
        } else {
          if (whiteList.includes(to.name)) {
            // 在免登录白名单，直接进入
            next()
          } else {
            next({ path: loginRoutePath, query: { redirect: to.fullPath } })
            NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
          }
        }
      })
    } else if (to.query.bearer_token) {
      storage.set(ACCESS_TOKEN, to.query.bearer_token, 7 * 24 * 60 * 60 * 1000)
      next({ path: to.path })
    } else if (to.query.inviteKey) {
      next()
    } else {
      if (whiteList.includes(to.name)) {
        // 在免登录白名单，直接进入
        next()
      } else {
        next({ path: loginRoutePath, query: { redirect: to.fullPath } })
        NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
