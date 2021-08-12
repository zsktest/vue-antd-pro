// eslint-disable-next-line
import { UserLayout, BasicLayout, PageView, BlankLayout } from '@/layouts'
// market 市场管理，暂时去掉
import { index, account, set, application, code, robot, order } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/home/index',
    children: [
      // index
      {
        path: '/home',
        name: 'home',
        redirect: '/home/index',
        component: RouteView,
        hideChildrenInMenu: true,
        meta: {
          icon: index,
          title: '仪表盘',
          keepAlive: false,
          permission: ['index']
        },
        children: [
          {
            path: '/home/index',
            name: 'HomeIndex',
            meta: {
              title: '仪表盘',
              keepAlive: true,
              permission: ['index']
            },
            component: () => import('@/views/index/index')
          }
        ]
      },
      // 账号管理
      {
        path: '/account',
        name: 'account',
        redirect: '/account/list',
        component: RouteView,
        hideChildrenInMenu: true,
        meta: {
          icon: account,
          title: '账号管理',
          keepAlive: false,
          permission: ['account']
        },
        children: [
          {
            path: '/account/list',
            name: 'accountList',
            meta: {
              title: '账号管理',
              keepAlive: true,
              permission: ['account']
            },
            component: () => import('@/views/account/list')
          },
          {
            path: '/account/detail',
            name: 'accountDetail',
            meta: {
              title: '账号管理详情',
              keepAlive: true,
              permission: ['account']
            },
            component: () => import('@/views/account/detail')
          }
        ]
      },
      // 专有云账号管理
      {
        path: '/account',
        name: 'account',
        redirect: '/account/list',
        component: RouteView,
        hideChildrenInMenu: true,
        meta: {
          icon: account,
          title: '账号管理',
          keepAlive: false,
          permission: ['pertaccount']
        },
        children: [
          {
            path: '/account/list',
            name: 'accountList',
            meta: {
              title: '账号管理',
              keepAlive: true,
              permission: ['pertaccount']
            },
            component: () => import('@/views/account/list1')
          },
          {
            path: '/account/detail',
            name: 'accountDetail',
            meta: {
              title: '账号管理详情',
              keepAlive: true,
              permission: ['pertaccount']
            },
            component: () => import('@/views/account/detail')
          }
        ]
      },
      // 调度中心
      {
        path: '/plans',
        name: 'plans',
        redirect: '/plans/list',
        component: RouteView,
        meta: {
          icon: robot,
          title: '调度中心',
          keepAlive: false,
          permission: ['robot_name']
        },
        children: [
          {
            path: '/robot/list',
            name: 'robotList',
            meta: {
              title: '机器人管理',
              keepAlive: true,
              permission: ['robot']
            },
            component: () => import('@/views/dispatch/robot/list')
          },
          {
            path: '/plans/list',
            name: 'plansList',
            hideChildrenInMenu: true,
            component: RouteView,
            meta: {
              title: '计划执行',
              keepAlive: true,
              permission: ['plans']
            },
            children: [
              {
                path: '/plans/list',
                name: 'plansList',
                hideChildrenInMenu: true,
                meta: {
                  title: '计划执行',
                  keepAlive: true,
                  permission: ['plans']
                },
                component: () => import('@/views/dispatch/plans/list')
              },
              {
                path: '/plans/add',
                name: 'plansAdd',
                meta: {
                  title: '新建计划',
                  keepAlive: true,
                  permission: ['plans']
                },
                component: () => import('@/views/dispatch/plans/add')
              }
            ]
          }
          // {
          //   path: '/task/list',
          //   name: 'taskList',
          //   meta: {
          //     title: '任务列表',
          //     keepAlive: true,
          //     permission: ['task']
          //   },
          //   component: () => import('@/views/dispatch/task/list')
          // }
        ]
      },
      // 应用管理
      {
        path: '/application',
        name: 'application',
        redirect: '/application/list',
        component: RouteView,
        hideChildrenInMenu: true,
        meta: {
          icon: application,
          title: '应用管理',
          keepAlive: false,
          permission: ['Application']
        },
        children: [
          {
            path: '/application/list',
            name: 'applicationList',
            meta: {
              title: '应用管理',
              keepAlive: true,
              permission: ['Application']
            },
            component: () => import('@/views/application/list')
          },
          {
            path: '/application/detail',
            name: 'applicationDetail',
            meta: {
              title: '应用管理详情',
              keepAlive: true,
              permission: ['Application']
            },
            component: () => import('@/views/application/detail')
          }
        ]
      },
      // 市场管理
      // {
      //   path: '/market',
      //   name: 'market',
      //   redirect: '/market/list',
      //   component: RouteView,
      //   hideChildrenInMenu: true,
      //   meta: {
      //     icon: market,
      //     title: '市场管理',
      //     keepAlive: false,
      //     permission: ['market']
      //   },
      //   children: [
      //     {
      //       path: '/market/list',
      //       name: 'marketList',
      //       meta: {
      //         title: '市场管理',
      //         keepAlive: true,
      //         permission: ['market']
      //       },
      //       component: () => import('@/views/market/list')
      //     }
      //   ]
      // },
      // 订单管理
      {
        path: '/order',
        component: RouteView,
        name: 'order',
        redirect: '/order/list',
        hideChildrenInMenu: true,
        meta: {
          icon: order,
          title: '订单管理',
          keepAlive: false,
          permission: ['order']
        },
        children: [
          {
            path: '/order/list',
            nama: 'orderList',
            meta: {
              title: '订单管理',
              keepAlive: true,
              permission: ['order']
            },
            component: () => import('@/views/order/list')
          }
        ]
      },
      // 激活码
      {
        path: '/author',
        component: RouteView,
        name: 'author',
        redirect: '/author/list',
        hideChildrenInMenu: true,
        meta: {
          icon: code,
          title: '激活码',
          keepAlive: false,
          permission: ['Authorization']
        },
        children: [
          {
            path: '/author/list',
            nama: 'Authorization',
            meta: {
              title: '激活码',
              keepAlive: true,
              permission: ['Authorization']
            },
            component: () => import('@/views/author/list')
          },
          {
            path: '/author/tripartite',
            nama: 'tripartite',
            meta: {
              title: '企业管理',
              keepAlive: true,
              permission: ['tripartite']
            },
            component: () => import('@/views/author/tripartite')
          }
        ]
      },
      // 许可证列表
      {
        path: '/licence',
        component: RouteView,
        name: 'licence',
        redirect: '/licence/list',
        hideChildrenInMenu: true,
        meta: {
          icon: set,
          title: '许可证列表',
          keepAlive: false,
          permission: ['licence']
        },
        children: [
          {
            path: '/licence/list',
            nama: 'licenceList',
            meta: {
              title: '许可证列表',
              keepAlive: true,
              permission: ['licence']
            },
            component: () => import('@/views/licence/list')
          }
        ]
      },
      // 客户端版本管理
      {
        path: '/Client',
        component: RouteView,
        name: 'Client',
        redirect: '/Clientversion/list',
        hideChildrenInMenu: true,
        meta: {
          icon: set,
          title: '客户端版本',
          keepAlive: false,
          permission: ['Clientversion']
        },
        children: [
          {
            path: '/Clientversion/list',
            nama: 'Clientversion',
            meta: {
              title: '客户端版本',
              keepAlive: true,
              permission: ['Clientversion']
            },
            component: () => import('@/views/Clientversion/list')
          }
        ]
      },
      // Python包管理
      {
        path: '/Python',
        component: RouteView,
        name: 'Python',
        redirect: '/Python/list',
        hideChildrenInMenu: true,
        meta: {
          icon: set,
          title: 'Python包管理',
          keepAlive: false,
          permission: ['PythonList']
        },
        children: [
          {
            path: '/Python/list',
            nama: 'PythonList',
            meta: {
              title: 'Python包管理',
              keepAlive: true,
              permission: ['PythonList']
            },
            component: () => import('@/views/Python/list')
          }
        ]
      },
      // 审批管理
      {
        path: '/client',
        component: RouteView,
        name: 'approval',
        redirect: '/client/approval',
        hideChildrenInMenu: true,
        meta: {
          icon: set,
          title: '审批管理',
          keepAlive: false,
          permission: ['approval']
        },
        children: [
          {
            path: '/client/approval',
            nama: 'approvalList',
            meta: {
              title: '审批管理',
              keepAlive: true,
              permission: ['approval']
            },
            component: () => import('@/views/client/components/approval')
          }
        ]
      },
      // {
      //   path: '/setting',
      //   component: RouteView,
      //   name: 'setting',
      //   redirect: '/setting/security',
      //   hideChildrenInMenu: true,
      //   meta: {
      //     icon: set,
      //     title: '设置',
      //     keepAlive: false,
      //     permission: ['setting']
      //   },
      //   children: [
      //     {
      //       path: '/setting/index',
      //       nama: 'index',
      //       meta: {
      //         title: '设置',
      //         keepAlive: true,
      //         permission: ['setting']
      //       },
      //       component: () => import('@/views/setting/index'),
      //       hideChildrenInMenu: true,
      //       redirect: '/setting/security',
      //       children: [
      //         {
      //           path: '/setting/security',
      //           name: 'settingSecurity',
      //           meta: {
      //             title: '设置',
      //             keepAlive: true
      //           },
      //           component: () => import('@/views/setting/security')
      //         }
      //       ]
      //     }
      //   ]
      // }
      // 设置
      {
        path: '/setting',
        component: RouteView,
        name: 'setting',
        redirect: '/setting/security',
        hideChildrenInMenu: true,
        meta: {
          icon: set,
          title: '设置',
          keepAlive: false,
          permission: ['setting']
        },
        children: [
          {
            path: '/setting/security',
            nama: 'settingSecurity',
            meta: {
              title: '设置',
              keepAlive: true,
              permission: ['setting']
            },
            component: () => import('@/views/setting/security')
          }
        ]
      }
    ]
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },
  {
    path: '/client',
    component: RouteView,
    name: 'approval',
    redirect: '/client/approval',
    hideChildrenInMenu: true,
    meta: {
      icon: set,
      title: '审批管理',
      keepAlive: false,
      permission: ['approval']
    },
    children: [
      {
        path: '/client/approval',
        nama: 'approvalList',
        meta: {
          title: '审批管理',
          keepAlive: true,
          permission: ['approval']
        },
        component: () => import('@/views/client/components/approval')
      }
    ]
  },
  {
    path: '/client',
    name: 'client',
    component: RouteView,
    redirect: '/client/enterprise/index',
    hidden: true,
    children: [
      {
        path: '/client/enterprise/index',
        name: 'client',
        component: () => import('@/views/client/enterprise/index')
      }
    ]
  },
  {
    path: '/client',
    name: 'invitation',
    component: RouteView,
    redirect: '/s',
    hidden: true,
    children: [
      {
        meta: {
          title: '用户分享',
          keepAlive: true
        },
        path: '/s',
        name: 'invitation',
        component: () => import('@/views/client/invitation/enterprise')
      }
    ]
  },
  {
    path: '/client',
    name: 'success',
    component: RouteView,
    redirect: '/client/invitation/success',
    hidden: true,
    children: [
      {
        path: '/client/invitation/success',
        name: 'success',
        component: () => import('@/views/client/invitation/success')
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
