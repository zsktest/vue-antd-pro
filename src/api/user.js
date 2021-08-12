import request from '@/utils/request'

// 仪表盘-获取企业添加人数
export function summaryData (parameter) {
  return request({
    url: '/api/v1/enterprise/dashboard/enterprise/summary/data',
    method: 'get',
    params: parameter
  })
}
// 仪表盘-开发者统计
export function dayUser (parameter) {
  return request({
    url: '/api/v1/enterprise/dashboard/enterprise/day/user',
    method: 'get',
    params: parameter
  })
}
// 仪表盘-开发者统计
export function summaryList (parameter) {
  return request({
    url: '/api/v1/enterprise/dashboard/enterprise/developer/summary/list',
    method: 'get',
    params: parameter
  })
}
// 账号管理-获取企业添加人数
export function queryEnterprise (parameter) {
  return request({
    url: '/api/v1/enterprise/queryEnterprise',
    method: 'get',
    params: parameter
  })
}
// 账号管-理获取列表
export function accountUser (parameter) {
  return request({
    url: '/api/v1/enterpriseUser/user/list',
    method: 'get',
    params: parameter
  })
}
// 账号管理-创建用户
export function createUser (data, parameter) {
  return request({
    url: `/api/v1/enterpriseUser/createUser?enterpriseUuid=${data}`,
    method: 'post',
    data: parameter
  })
}
// 账号管理-修改用户
export function updateUser (data, parameter) {
  return request({
    url: `/api/v1/enterpriseUser/updateUser?enterpriseUuid=${data}`,
    method: 'post',
    data: parameter
  })
}
// 账号管理-获取迁移密码
export function createOrQueryMigrateCode (parameter) {
  return request({
    url: '/api/v1/enterpriseUser/createOrQueryMigrateCode',
    method: 'get',
    params: parameter
  })
}
// 账号管理-重置密码
export function resetUserPassword (parameter) {
  return request({
    url: '/api/v1/enterpriseUser/resetUserPassword',
    method: 'post',
    params: parameter
  })
}
// 账号管理-企业用户列表
export function userList (parameter) {
  return request({
    url: '/api/v1/enterpriseUser/user/list',
    method: 'get',
    params: parameter
  })
}
// 账号管理-删除
export function deleteUser (parameter) {
  return request({
    url: '/api/v1/enterpriseUser/deleteUser',
    method: 'post',
    params: parameter
  })
}
// 账号管理-详情list
export function queryUserRunRecordList (parameter) {
  return request({
    url: '/api/v1/enterpriseUser/queryUserRunRecordList',
    method: 'get',
    params: parameter
  })
}
// 账号管理-详情基本信息
export function userDta (parameter) {
  return request({
    url: '/api/v1/enterpriseUser/user/detail',
    method: 'get',
    params: parameter
  })
}
// 账号管理-查询企业可用的额外附加账号
export function queryAvailableEnterpriseLicense (parameter) {
  return request({
    url: '/api/v1/enterpriseUser/queryAvailableEnterpriseLicense',
    method: 'get',
    params: parameter
  })
}
// 账号管理-附加账号续费
export function tradeDelay (parameter) {
  return request({
    url: '/api/v1/enterprise/trade/delay',
    method: 'post',
    params: parameter
  })
}
// 账号管理-附加账号释放许可
export function releaseLicense (parameter) {
  return request({
    url: '/api/v1/enterpriseUser/releaseLicense',
    method: 'post',
    params: parameter
  })
}
// 账号管理-附加账号释放许可
export function updateExtraUserLicense (parameter) {
  return request({
    url: '/api/v1/enterpriseUser/updateExtraUserLicense',
    method: 'post',
    params: parameter
  })
}
// 账号管理-询价单独购买的用户许可
export function enquiryUserLicense (parameter) {
  return request({
    url: '/api/v1/enterprise/trade/enquiry',
    method: 'get',
    params: parameter
  })
}
// 账号管理-询价单独购买的用户许可
export function orderUserLicenseWithAlipay (parameter) {
  return request({
    url: '/api/v1/enterprise/trade/buy',
    method: 'post',
    params: parameter
  })
}
// 账号管理-查询订单状态是否支付成功
export function queryOrderPayoff (parameter) {
  return request({
    url: '/api/v1/enterprise/order/queryOrderPayoff',
    method: 'get',
    params: parameter
  })
}
// 账号管理-点击继续支付
export function tradePay (parameter) {
  return request({
    url: '/api/v1/enterprise/trade/pay',
    method: 'post',
    params: parameter
  })
}
// 账号管理-详情积累数据
export function robotSummaryData (parameter) {
  return request({
    url: '/api/v1/enterpriseRobot/robot/summary/data',
    method: 'get',
    params: parameter
  })
}
// 订单管理-订单列表
export function orderList (parameter) {
  return request({
    url: '/api/v1/enterprise/order/list',
    method: 'get',
    params: parameter
  })
}
// 许可证列表-许可列表
export function grantList (parameter) {
  return request({
    url: '/api/v1/user/license/grant/list',
    method: 'get',
    params: parameter
  })
}
// 许可证列表-创建许可证提交内容
export function grantEvaluate (data, parameter) {
  return request({
    url: `/api/v1/user/license/grant/evaluate?enterpriseUuid=${data}`,
    method: 'post',
    data: parameter
  })
}
// 许可证列表-创建许可证生成激活码
export function grantCreate (data, parameter) {
  return request({
    url: `/api/v1/user/license/grant/create?enterpriseUuid=${data}`,
    method: 'post',
    data: parameter
  })
}
// 许可证列表-创建许可证生成激活码
export function grantImport (parameter) {
  return request({
    url: '/api/v1/user/license/grant/import',
    method: 'post',
    params: parameter
  })
}
// 许可证列表-激活许可证
export function grantDetail (parameter) {
  return request({
    url: '/api/v1/user/license/grant/detail',
    method: 'get',
    params: parameter
  })
}
// 许可证列表-删除当前列表
export function grantDelete (parameter) {
  return request({
    url: '/api/v1/user/license/grant/delete',
    method: 'post',
    params: parameter
  })
}
// 应用管理-应用列表
export function applicaList (parameter) {
  return request({
    url: '/api/v1/enterpriseRobot/list',
    method: 'get',
    params: parameter
  })
}
// 应用管理-删除应用
export function deleteRobot (parameter) {
  return request({
    url: '/api/v1/enterpriseRobot/deleteRobot',
    method: 'post',
    params: parameter
  })
}
// 应用管理-转交应用
export function translateSpecifyRobotOwner (parameter) {
  return request({
    url: '/api/v1/enterpriseRobot/translateSpecifyRobotOwner',
    method: 'post',
    params: parameter
  })
}
// 应用管理-修改应用名称
export function updateRobotInfo (data, parameter) {
  return request({
    url: `/api/v1/enterpriseRobot/updateRobotInfo?enterpriseUuid=${data}`,
    method: 'post',
    data: parameter
  })
}
// 应用管理-详情基本信息
export function robotDetailBO (parameter) {
  return request({
    url: '/api/v1/enterpriseRobot/robotDetailBO',
    method: 'get',
    params: parameter
  })
}
// 应用管理-详情积累数据
export function userSummaryData (parameter) {
  return request({
    url: '/api/v1/enterpriseUser/user/summary/data',
    method: 'get',
    params: parameter
  })
}
// 应用管理-详情基本面积图
export function robotDay (parameter) {
  return request({
    url: '/api/v1/enterpriseRobot/robot/day/use/line',
    method: 'get',
    params: parameter
  })
}
// 应用管理-详情使用时长TOP5
export function robotTop (parameter) {
  return request({
    url: '/api/v1/enterpriseRobot/robot/realtime/use/top',
    method: 'get',
    params: parameter
  })
}
// 应用管理-详情使用获取明细
export function queryRobotUseUserList (parameter) {
  return request({
    url: '/api/v1/enterpriseRobot/queryRobotUseUserList',
    method: 'get',
    params: parameter
  })
}
// 应用管理-详情使用使用记录
export function queryRobotUseRecordList (parameter) {
  return request({
    url: '/api/v1/enterpriseRobot/queryRobotUseRecordList',
    method: 'get',
    params: parameter
  })
}
// 市场管理-列表
export function listMarket (parameter) {
  return request({
    url: '/api/v1/enterprise/market/listMarket',
    method: 'get',
    params: parameter
  })
}
// 市场管理-开启默认市场
export function enableDefaultMarket (parameter) {
  return request({
    url: '/api/v1/enterprise/market/enableDefaultMarket',
    method: 'post',
    params: parameter
  })
}
// 市场管理-关闭默认市场
export function disableDefaultMarket (parameter) {
  return request({
    url: '/api/v1/enterprise/market/disableDefaultMarket',
    method: 'post',
    params: parameter
  })
}
// 设置-修改密码
export function changePwd (parameter) {
  return request({
    url: '/api/v1/user/info/changePwd',
    method: 'post',
    params: parameter
  })
}
// 设置-修改用户信息
export function enterpriseUpdate (data, parameter) {
  return request({
    url: `/api/v1/enterprise/update?enterpriseUuid=${data}`,
    method: 'post',
    data: parameter
  })
}
// 设置-获取验证码
export function sendVerifyCode (parameter) {
  return request({
    url: '/api/v1/enterprise/sendVerifyCode',
    method: 'post',
    params: parameter
  })
}
// 设置-重建索引
export function rebuildindex (parameter) {
  return request({
    url: '/api/v1/sys/cache/rebuild/index',
    method: 'post',
    params: parameter
  })
}
// 激活码-列表
export function listLicense (parameter) {
  return request({
    url: '/api/v1/client/license/listLicense',
    method: 'get',
    params: parameter
  })
}
// 激活码-列表客户端名称修改
export function updateLicense (parameter) {
  return request({
    url: '/api/v1/client/license/updateLicense',
    method: 'post',
    data: parameter
  })
}
// 激活码三方企业-列表
export function thirdList (parameter) {
  return request({
    url: '/api/v1/sys/company/third/list',
    method: 'get',
    params: parameter
  })
}
// 激活码三方企业-列表修改名称
export function thirdUpdateName (parameter) {
  return request({
    url: '/api/v1/sys/company/third/update',
    method: 'post',
    data: parameter
  })
}
// 激活码-创建接口
export function createLicense (data, parameter) {
  return request({
    url: `/api/v1/client/license/createLicense?enterpriseUuid=${data}`,
    method: 'post',
    data: parameter
  })
}
// 客户端版本
export function clientVersionList (parameter) {
  return request({
    url: '/api/v1/sys/clientVersion/list',
    method: 'get',
    params: parameter
  })
}
// 新增版本提交
export function clientVersionCreate (parameter) {
  return request({
    url: '/api/v1/sys/clientVersion/create',
    method: 'post',
    data: parameter
  })
}
// 新增版本提交
export function clientVersionDelete (parameter) {
  return request({
    url: '/api/v1/sys/clientVersion/delete',
    method: 'post',
    params: parameter
  })
}
// Python包管理列表
export function pypiList (parameter) {
  return request({
    url: '/api/v1/sys/pypi/list',
    method: 'get',
    params: parameter
  })
}
// Python包管理删除
export function pypiDelete (parameter) {
  return request({
    url: '/api/v1/sys/pypi/delete',
    method: 'POST',
    params: parameter
  })
}
// 调度中心-调度ws接口获取
export function clientClientConfig (parameter) {
  return request({
    url: '/api/v1/sys/client/clientConfig',
    method: 'get',
    params: parameter
  })
}
// 调度中心-机器人可被调度
export function clientStatusCount (parameter) {
  return request({
    url: '/api/dispatch/v2/client/statusCount',
    method: 'get',
    params: parameter
  })
}
// 调度中心-计划列表应用
export function enterpriseRobotList (parameter) {
  return request({
    url: '/api/v1/enterpriseRobot/list',
    method: 'get',
    params: parameter
  })
}
// 调度中心-计划列表应用
export function scheduleList (parameter) {
  return request({
    url: '/api/dispatch/v2/schedule/list',
    method: 'get',
    params: parameter
  })
}
// 调度中心-计划列表应用简化
export function listSummary (parameter) {
  return request({
    url: '/api/dispatch/v2/schedule/list/summary',
    method: 'get',
    params: parameter
  })
}
// 调度中心-更新计划任务的状态
export function changeEnabledStatus (parameter) {
  return request({
    url: '/api/dispatch/v2/schedule/changeEnabledStatus',
    method: 'post',
    params: parameter
  })
}
// 调度中心-手动执行计划任务
export function manualStart (parameter) {
  return request({
    url: '/api/dispatch/v2/schedule/manual/start',
    method: 'post',
    params: parameter
  })
}
// 调度中心-计划列表弹窗机器人列表
export function clientList (parameter) {
  return request({
    url: '/api/dispatch/v2/client/list',
    method: 'get',
    params: parameter
  })
}
// 调度中心=计划列表弹窗cron表达式预览
export function interfacePreview (parameter) {
  return request({
    url: '/api/dispatch/v2/schedule/cron/interface/preview?size=5',
    method: 'post',
    data: parameter
  })
}
// 调度中心=计划列表弹窗编辑回填
export function scheduleDetail (parameter) {
  return request({
    url: '/api/dispatch/v2/schedule/detail',
    method: 'get',
    params: parameter
  })
}
// 调度中心-计划列表弹窗 创建单应用计划
export function robotSchedule (data, parameter) {
  return request({
    url: `/api/dispatch/v2/schedule/create/multi/robot/schedule?enterpriseUuid=${data}`,
    method: 'post',
    data: parameter
  })
}
// 调度中心-计划列表弹窗 修改单应用计划
export function updateSchedule (data, parameter) {
  return request({
    url: `/api/dispatch/v2/schedule/update/multi/robot/schedule?enterpriseUuid=${data}`,
    method: 'post',
    data: parameter
  })
}
// 调度中心-计划列表弹窗 删除单应用计划
export function scheduleDelete (parameter) {
  return request({
    url: '/api/dispatch/v2/schedule/delete',
    method: 'post',
    params: parameter
  })
}
// 调度中心-列出计划下的客户端列表
export function scheduleClientList (parameter) {
  return request({
    url: '/api/dispatch/v2/schedule/client/list',
    method: 'get',
    params: parameter
  })
}
// 调度中心-任务列表
export function sceneinstlist (parameter) {
  return request({
    url: '/api/dispatch/v2/scene/inst/list',
    method: 'get',
    params: parameter
  })
}
// 调度中心-任务筛选数量
export function instStatusCount (parameter) {
  return request({
    url: '/api/dispatch/v2/scene/inst/statusCount',
    method: 'get',
    params: parameter
  })
}
// 调度中心-任务详情
export function processDetail (parameter) {
  return request({
    url: '/api/dispatch/v2/scene/inst/client/process/detail',
    method: 'get',
    params: parameter
  })
}
// 订单管理-更新企业发票配置信息
export function updateInvoiceConfig (data, parameter) {
  return request({
    url: `/api/v1/enterprise/updateInvoiceConfig?enterpriseUuid=${data}`,
    method: 'post',
    data: parameter
  })
}
// 订单管理-更新企业发票配置信息
export function queryInvoiceConfig (parameter) {
  return request({
    url: '/api/v1/enterprise/queryInvoiceConfig',
    method: 'get',
    params: parameter
  })
}
// 订单管理-申请订单发票
export function applyInvoice (parameter) {
  return request({
    url: '/api/v1/enterprise/order/applyInvoice',
    method: 'post',
    params: parameter
  })
}
// 申请审批列表-客户端嵌套控制台
export function approvalQueryApprovalList (parameter) {
  return request({
    url: '/api/v1/enterprise/approval/queryApprovalList',
    method: 'get',
    params: parameter
  })
}
// 申请审批个数-客户端嵌套控制台
export function approvalQueryNoApprovalCount (parameter) {
  return request({
    url: '/api/v1/enterprise/approval/queryWaitApprovalCount',
    method: 'post',
    params: parameter
  })
}
// 申请审批同意-客户端嵌套控制台
export function approvalAccept (parameter) {
  return request({
    url: '/api/v1/enterprise/approval/accept',
    method: 'post',
    params: parameter
  })
}
// 申请高级账号-客户端嵌套控制台
export function applySeniorAccount (parameter) {
  return request({
    url: '/api/v1/enterprise/apply/applySeniorAccount',
    method: 'post',
    data: parameter
  })
}
// 申请高级账号运行条数-客户端嵌套控制台
export function clientConfig (parameter) {
  return request({
    url: '/api/v1/sys/client/clientConfig',
    method: 'get',
    data: parameter
  })
}
// 申请审批拒绝-客户端嵌套控制台
export function approvalReject (parameter) {
  return request({
    url: '/api/v1/enterprise/approval/reject',
    method: 'post',
    params: parameter
  })
}
// 获取邀请链接-客户端嵌套控制台
export function inviteGetInviteLink (parameter) {
  return request({
    url: '/api/v1/enterprise/invite/getInviteLink',
    method: 'get',
    params: parameter
  })
}
// 重置邀请链接-客户端嵌套控制台
export function inviteResetInviteLink (parameter) {
  return request({
    url: '/api/v1/enterprise/invite/resetInviteLink',
    method: 'get',
    params: parameter
  })
}
// 邮箱邀请-客户端嵌套控制台
export function inviteInviteByMail (parameter) {
  return request({
    url: '/api/v1/enterprise/invite/inviteByMail',
    method: 'post',
    data: parameter
  })
}
// 发送手机验证码-客户端嵌套控制台
export function applySendVerifyCode (parameter) {
  return request({
    url: '/api/noauth/v1/enterprise/apply/sendVerifyCode',
    method: 'post',
    params: parameter
  })
}
// 发送手机验证码-客户端嵌套控制台
export function approvalApplyAccount (parameter) {
  return request({
    url: '/api/noauth/v1/enterprise/apply/applyAccount',
    method: 'post',
    data: parameter
  })
}
// 图片上传
export function uploadImage (parameter) {
  return request({
    url: '/api/v1/sys/media/upload/image',
    method: 'post',
    data: parameter
  })
}
// 积累类别-客户端嵌套控制台
export function userAccumulate (parameter) {
  return request({
    url: '/api/v1/enterprise/dashboard/enterprise/day/user/accumulate',
    method: 'get',
    params: parameter
  })
}
// 柱状图-客户端嵌套控制台
export function userAggr (parameter) {
  return request({
    url: '/api/v1/enterprise/dashboard/enterprise/day/user/aggr',
    method: 'get',
    params: parameter
  })
}
// 柱状图-客户端嵌套控制台
export function accumulateTop (parameter) {
  return request({
    url: '/api/v1/enterprise/dashboard/enterprise/robot/accumulate/top',
    method: 'get',
    params: parameter
  })
}
// 获取分享信息-客户端嵌套控制台
export function queryApplyEnterpriseInfo (parameter) {
  return request({
    url: '/api/noauth/v1/enterprise/apply/queryApplyEnterpriseInfo',
    method: 'get',
    params: parameter
  })
}
// 下载客户端埋点
export function recordLog (parameter) {
  return request({
    url: '/api/noauth/v1/sys/spm/record/log',
    method: 'get',
    params: parameter
  })
}
// 下载客户端埋点
export function queryCreateUserStatus (parameter) {
  return request({
    url: '/api/v1/enterpriseUser/queryCreateUserStatus',
    method: 'get',
    params: parameter
  })
}
