<template>
  <div class="enterprise">
    <div style="height: 15px;box-shadow: rgba(0, 0, 0, 0.06) 0px 0px 15px 6px;margin-top: -15px;position: fixed;left: 0;top: 0;width: 100%;z-index: 999;"></div>
    <a-page-header style="border-bottom: 1px solid rgb(235, 237, 240);background: #fff;padding:0 100px">
      <template v-slot:title>
        <a-col :md="24" :sm="24">
          <div class="application_detail">
            <div class="application_detailimg">
              <img :src="formname.enterpriseIcon" style="width:56px;height:56px;" />
            </div>
            <div class="application_detailright">
              <h2>{{ scurity.name }}<a-icon v-if="enterpriseRoleCode.enterpriseRoleCode === 'e_owner' || enterpriseRoleCode.enterpriseRoleCode === 'e_admin'" type="edit" class="edits" @click="edits" /></h2>
              <span>{{ scurity.enterpriseDescription }}
                <a-popover placement="rightTop">
                  <template slot="content">
                    <p><a-icon type="user" />  {{ scurity.principalUserName }}</p>
                    <p><a-icon type="phone" />  {{ scurity.principalUserPhone }}</p>
                  </template>
                  <template slot="title">
                    <span>负责人</span>
                  </template>
                  <a-icon type="exclamation-circle" />
                </a-popover>
              </span>
            </div>
            <div class="bt"></div>
          </div>
        </a-col>
      </template>
      <template v-slot:extra>
        <div>
          <a-button icon="link" type="primary" @click="colleagues" style="margin-top: 42px;">邀请同事</a-button>
          <a href="https://console.winrobot360.com" style="margin-left: 8px;" target="_blank" v-if="enterpriseRoleCode.enterpriseRoleCode === 'e_owner' || enterpriseRoleCode.enterpriseRoleCode === 'e_admin'"><a-button>控制台</a-button></a>
          <a-button v-if="enterpriseUserAccountType === 'basic'" style="margin-left: 8px;" @click="usersenior">申请高级账号</a-button>
        </div>
      </template>
      <template slot="footer">
        <a-tabs v-if="enterpriseRoleCode.enterpriseRoleCode === 'e_owner' || enterpriseRoleCode.enterpriseRoleCode === 'e_admin'" default-active-key="1" @change="callback">
          <a-tab-pane key="1" tab="首页" />
          <a-tab-pane key="2" tab="账号管理" />
          <a-tab-pane key="3">
            <span slot="tab">
              <a-badge :count="count">
                申请审批
              </a-badge>
            </span>
          </a-tab-pane>
          <!-- <a-tab-pane key="4" tab="需求池" /> -->
        </a-tabs>
        <div v-else style="height:6px"></div>
      </template>
    </a-page-header>
    <div style="margin:24px 100px;">
      <div v-show="tabActiveKey === '1'">
        <div class="invitation">
          <div class="invitation_right">
            <h1>邀请同事使用影刀，共享自动化高效办公</h1>
            <p>邀请链接：{{ inviteGetInviteLink }}</p>
            <div class="invitation_bottom">
              <div class="invitation_copy" @click="doCopyname"><a-icon type="copy" />  复制邀请链接</div>
              <a href="https://www.winrobot360.com/team.html" target="_blank"><div class="invitation_hove">向团队介绍影刀</div></a>
            </div>
            <img src="@/assets/img/share_bg.png" alt="">
          </div>
        </div>
        <!-- <div class="index_title">统计 <em>|</em>  <span>每日上午9点更新数据</span></div> -->
        <a-row :gutter="24">
          <a-col :sm="24" :md="12" :xl="6">
            <div class="index_app application">
              <img :src="icon1" alt="">
              <h2>开发应用数</h2>
              <countTo :startVal="0" :endVal="lastTop.robotCnt" :duration="2000"></countTo>
            </div>
          </a-col>
          <a-col :sm="24" :md="12" :xl="6">
            <div class="index_app execution">
              <img :src="icon2" alt="">
              <h2>累计执行时长(小时)</h2>
              <countTo :startVal="0" :endVal="lastTop.totalRunHours" :duration="2000"></countTo>
            </div>
          </a-col>
          <a-col :sm="24" :md="12" :xl="6">
            <div class="index_app Number">
              <img :src="icon3" alt="">
              <h2>执行任务数</h2>
              <countTo :startVal="0" :endVal="lastTop.totalRunCount" :duration="2000"></countTo>
            </div>
          </a-col>
          <a-col :sm="24" :md="12" :xl="6">
            <div class="index_app manpower">
              <img :src="icon4" alt="">
              <h2>相当于节省人力(天)</h2>
              <countTo :startVal="0" :endVal="lastTop.totalRunWorkDays" :duration="2000"></countTo>
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :sm="24" :md="24" :xl="24">
            <a-card
              class="antd-pro-pages-dashboard-analysis-salesCard"
              description="时长"
              :loading="loading"
              :bordered="false"
              title="机器人累计运行时间(小时)"
              :style="{ height: '100%' }">
              <div slot="extra" class="analysis-salesTypeRadio">
                <a-radio-group defaultValue="week" @change="onChanger">
                  <a-radio-button value="week">最近一周</a-radio-button>
                  <a-radio-button value="month">最近一月</a-radio-button>
                  <a-radio-button value="year">最近一年</a-radio-button>
                </a-radio-group>
              </div>
              <div id="container" :style="{ 'margin-top': '-20px' }"></div>
            </a-card>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :sm="24" :md="24" :xl="24">
            <a-card
              class="antd-pro-pages-dashboard-analysis-salesCard"
              description="时长"
              :loading="loading"
              :bordered="false"
              title="机器人执行任务时间(小时)"
              :style="{ height: '100%' }">
              <div slot="extra" class="analysis-salesTypeRadio">
                <a-radio-group defaultValue="week" @change="ramChanger">
                  <a-radio-button value="week">最近一周</a-radio-button>
                  <a-radio-button value="month">最近一月</a-radio-button>
                  <a-radio-button value="year">最近一年</a-radio-button>
                </a-radio-group>
              </div>
              <div id="lumnContainer" :style="{ 'margin-top': '-20px' }"></div>
            </a-card>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :sm="24" :md="24" :xl="24">
            <a-card
              class="antd-pro-pages-dashboard-analysis-salesCard"
              description="时长"
              :loading="loading"
              :bordered="false"
              title="TOP3应用统计"
              :style="{ height: '100%' }">
              <a-table
                :row-key="record => record.robotUuid"
                :columns="columns"
                :data-source="listData"
                :loading="loading"
                :pagination="false"
                style="padding:0 20px;padding-bottom:50px;">
              </a-table>
            </a-card>
          </a-col>
        </a-row>
      </div>
      <div v-show="tabActiveKey === '2'">
        <account @nameaccuns="nameaccouns($event)" :bindsd="accountbindId"></account>
      </div>
      <div v-show="tabActiveKey === '3'">
        <approval @noApprovalCount="apppro($event)" :rovalCount="approveBindId"></approval>
      </div>
      <!-- <div v-show="tabActiveKey === '4'">4</div> -->
      <!-- 申请高级版弹窗 -->
      <a-modal
        title="申请高级账号"
        :visible="userble"
        :maskClosable="false"
        @ok="userhandleOk"
        @cancel="userhandleCancel">
        <a-form-model
          ref="userForm"
          :model="userform"
          :rules="userrules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol">
          <a-form-model-item label="账号类型">
            <a-input value="高级账号" placeholder="请输入企业名称" disabled/>
          </a-form-model-item>
          <a-form-model-item ref="applyRemark" label="申请备注" prop="applyRemark">
            <a-textarea v-model="userform.applyRemark" :auto-size="{ minRows: 3, maxRows: 3 }" placeholder="请输入备注"/>
          </a-form-model-item>
          <div class="seniorRobotBlockCount"><a-badge color="#108ee9" />高级账号权益：<span>运行或开发超过{{ berClientConfig }}条指令的应用</span></div>
          <div class="seniorRobotBlockCount"><a-badge status="default" />基础账号权益：<span>运行或开发小于{{ berClientConfig }}条指令的应用</span></div>
        </a-form-model>
      </a-modal>
      <!-- 企业信息编辑 -->
      <a-modal
        title="编辑企业信息"
        :visible="visible"
        :maskClosable="false"
        @ok="principalHandleOk"
        @cancel="handleCancel">
        <a-form-model
          ref="principaForm"
          :model="formname"
          :rules="principarules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol">
          <a-form-model-item ref="name" label="企业名称" prop="name">
            <a-input v-model="formname.name" :disabled="true" placeholder="请输入企业名称"/>
          </a-form-model-item>
          <a-form-model-item ref="enterpriseDescription" label="简介" prop="enterpriseDescription">
            <a-textarea v-model="formname.enterpriseDescription" :auto-size="{ minRows: 3, maxRows: 3 }" placeholder="有任何问题都可以联系负责人"/>
          </a-form-model-item>
          <a-form-model-item ref="enterpriseIcon" label="企业" prop="enterpriseIcon">
            <div class="icon_upload">
              <img :src="formname.enterpriseIcon" alt="">
            </div>
            <a-upload
              name="file"
              :multiple="true"
              :action="uploadImage"
              :data="authData"
              :headers="myHeaders"
              :showUploadList="false"
              accept=".png, .jpg, .jpeg"
              @change="handleChange">
              <a-button :loading="formnameble">上传图片</a-button>
            </a-upload>
            <a-input type="hidden" v-model="formname.enterpriseIcon" placeholder="员工的中文名称或昵称"/>
          </a-form-model-item>
          <a-divider />
          <a-form-model-item ref="principalUserName" label="负责人姓名" prop="principalUserName">
            <a-input v-model="formname.principalUserName" placeholder="请输入负责人姓名"/>
          </a-form-model-item>
          <a-form-model-item ref="principalUserPhone" label="负责人手机号" prop="principalUserPhone">
            <a-input v-model="formname.principalUserPhone" placeholder="请输入负责人手机号"/>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <!-- 邀请同事弹窗 -->
      <a-modal
        title="添加团队成员"
        :visible="colleague"
        :footer="null"
        class="colleagus"
        :body-style="{ 'min-height': '500px', 'position': 'relative'}"
        @cancel="colleagueCancel">
        <a-tabs :default-active-key="activeakey" @change="colleagus">
          <a-tab-pane key="1" tab="直接创建" v-if="enterpriseRoleCode.enterpriseRoleCode === 'e_owner' || enterpriseRoleCode.enterpriseRoleCode === 'e_admin'" />
          <a-tab-pane key="2" tab="链接邀请" />
          <a-tab-pane key="3" tab="邮箱邀请" />
          <a-tab-pane key="4" tab="批量导入" v-if="enterpriseRoleCode.enterpriseRoleCode === 'e_owner' || enterpriseRoleCode.enterpriseRoleCode === 'e_admin'" />
        </a-tabs>
        <div class="colltab" v-if="colleagustab === '1'">
          <a-alert message="仅管理员才能直接创建账号" type="info" banner style="margin-bottom:20px" />
          <a-form-model
            ref="ruleForm"
            :model="coll_form"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <a-form-model-item label="账号类型" prop="accountType">
              <a-radio-group v-model="coll_form.accountType" @change="accountclicks">
                <a-radio value="senior">高级账号
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>具有所有功能权限</span>
                    </template>
                    <a-icon type="question-circle" />
                  </a-tooltip>
                </a-radio>
                <a-radio value="basic">基础账号
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>只有部分功能权限，编辑和运行应用有指令行数限制</span>
                    </template>
                    <a-icon type="question-circle" />
                  </a-tooltip>
                </a-radio>
                <a-radio value="extra" v-if="scurity.enableExtraAccount">临时账号
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>有时效性，具有所有功能权限</span>
                    </template>
                    <a-icon type="question-circle" />
                  </a-tooltip>
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
            <div>
              <a-form-model-item ref="name" label="员工姓名" prop="name">
                <a-input :maxLength="50" v-model="coll_form.name" placeholder="员工姓名或昵称"/>
              </a-form-model-item>
              <a-form-model-item ref="account" label="登录账号" prop="account">
                <a-input id="suffix-input-console" v-model="coll_form.account" :maxLength="50" :suffix="'@' + abbr" placeholder="建议字母+数字"/>
              </a-form-model-item>
              <a-form-model-item label="用户角色" prop="role">
                <a-select v-model="coll_form.role" placeholder="用户角色">
                  <a-select-option value="e_runner">
                    仅可运行的用户
                  </a-select-option>
                  <a-select-option value="e_user">
                    可编辑和运行的用户
                  </a-select-option>
                  <a-select-option value="e_admin" v-if="coll_form.accountType === 'senior'" >
                    管理员
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item ref="phone" label="手机号" prop="phone">
                <a-input type="tel" v-model="coll_form.phone" placeholder="用于接收和找回密码"/>
                <a-input type="tel" style="width:10px;position:fixed;top:-9999px"/>
              </a-form-model-item>
              <a-form-model-item ref="userLicenseUuid" label="到期时间" v-show="coll_form.accountType === 'extra'">
                <a-select v-model="coll_form.userLicenseUuid" placeholder="到期时间选择" prop="userLicenseUuid">
                  <a-select-option v-for="(tims, index) in enterpriseLicense" :key="index" :value="tims.uuid">
                    {{ tims.endTime.slice(0,10) }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="初始密码">
                <a-radio-group v-model="coll_form.passwordType">
                  <a-radio value="system">系统生成</a-radio>
                  <a-radio value="custom">自定义密码</a-radio>
                </a-radio-group>
                <a-input-password v-show="coll_form.passwordType === 'custom'" v-model="coll_form.customPassword" placeholder="请输入密码" />
                <a-input-password style="width:10px;position:fixed;top:-9999px" />
              </a-form-model-item>
              <a-form-model-item ref="email" label="邮箱" prop="email">
                <a-input type="tel" v-model="coll_form.email" placeholder="用于找回密码"/>
              </a-form-model-item>
            </div>
          </a-form-model>
        </div>
        <div class="colltab" v-if="colleagustab === '2'">
          <a-alert message="链接邀请方式只能创建基础账号，添加成功后可由管理员更改权限" type="info" banner />
          <div class="colltab_url">
            <a-input v-model="inviteGetInviteLink" disabled/>
            <a-button type="primary" @click="doCopyname">复制链接</a-button>
            <a-icon type="reload" :class="inviteReset == true ? 'inviteResetsty' :''" @click="getinviteResetInviteLink" />
            <div class="bt"></div>
          </div>
        </div>
        <div class="colltab" v-if="colleagustab === '3'">
          <a-alert message="邮箱邀请方式只能创建基础账号，添加成功后可由管理员更改权限" type="info" banner style="margin-bottom:24px" />
          <a-form :form="form" @submit="handleSubmit">
            <a-form-item
              v-for="(k, index) in form.getFieldValue('keys')"
              :key="k"
              v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel"
              :required="false"
            >
              <a-input
                v-decorator="[
                  `names[${k}]`,
                  {
                    validateTrigger: ['change', 'blur'],
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '请输入邮箱',
                      }
                    ],
                  },
                ]"
                placeholder="输入同事的邮箱"
                style="width: 95%; margin-right: 8px"
              />
              <a-icon
                v-if="form.getFieldValue('keys').length > 1"
                class="dynamic-delete-button"
                type="minus-circle-o"
                :disabled="form.getFieldValue('keys').length === 1"
                @click="() => remove(k)"
              />
            </a-form-item>
            <a-form-item v-bind="formItemLayoutWithOutLabel">
              <div style="width: 30%;color:#2588E6;cursor: pointer;" @click="add">
                <a-icon type="plus" /> 继续添加
              </div>
            </a-form-item>
            <a-form-item v-bind="formItemLayoutWithOutLabel">
              <a-button type="primary" html-type="submit" style="float: right;">
                发送邀请
              </a-button>
            </a-form-item>
          </a-form>
        </div>
        <div class="colltab" v-if="colleagustab === '4'">
          <mport @importclcks="importfios($event)"></mport>
        </div>
        <div v-if="colleagustab === '1'">
          <div class="ant-modal-footer">
            <a-button @click="colleagueCancel">
              取消
            </a-button>
            <a-button type="primary" :loading="loadings" @click="handleOk">
              确定
            </a-button>
          </div>
        </div>
      </a-modal>
    </div>
    <div class="footer"><span></span>解放你的双手，快乐工作，认真生活<span style="float:right"></span></div>
  </div>
</template>
<script>
import countTo from 'vue-count-to'
import { Trend } from '@/components'
import account from '../components/account.vue'
import approval from '../components/approval.vue'
import mport from '../components/Import.vue'
import { Area, Column } from '@antv/g2plot'
import { accumulateTop, createUser, enterpriseUpdate, approvalQueryNoApprovalCount, queryAvailableEnterpriseLicense, inviteGetInviteLink, inviteResetInviteLink, inviteInviteByMail, applySeniorAccount, clientConfig, queryEnterprise, summaryData, userAccumulate, userAggr } from '@/api/user'
const data = [
  {
    时间: '2020-01-01',
    运行时长: 12
  },
  {
    时间: '2020-01-02',
    运行时长: 15
  }
]
// 表格项
const columns = [
  {
    title: '应用名称',
    dataIndex: 'robotName'
  },
  {
    title: '开发者',
    dataIndex: 'ownerName'
  },
  {
    title: '应用累计运行时长(小时)',
    dataIndex: 'accumulateRunTimeHour'
  },
  {
    title: '相当于节省人力(天)',
    dataIndex: 'accumulateRunTimeWorkDays'
  }
]
let id = 0
export default {
  components: {
    countTo,
    Trend,
    account,
    approval,
    mport
  },
  data () {
    const validatePass = (rule, value, callback) => {
      const phone = /^1[3456789]\d{9}$/
      // 包含港澳台电话号码校验，暂时去掉
      // const phone = /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^6\d{5}$/
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else {
        if (!phone.test(value)) {
          callback(new Error('请输入正确的手机号'))
        }
        callback()
      }
    }
    const validateSpecialUser = (rule, value, callback) => {
      const idcardReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
      if (value && !idcardReg.test(value)) {
          callback(new Error('请输入正确的邮箱'))
      }
      callback()
    }
    const validateAccount = (rule, value, callback) => {
      const account = /\s/
      if (value === '') {
        callback(new Error('请输入账号'))
      } else {
        if (account.test(value)) {
          callback(new Error('账号不能有空格'))
        }
        callback()
      }
    }
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      accountbindId: false,
      approveBindId: false,
      uploadImage: process.env.VUE_APP_API_BASE_URL + 'api/v1/sys/media/upload/image',
      enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
      enterpriseRoleCode: this.$store.getters.userInfo || '',
      enterpriseUserAccountType: this.$store.getters.userInfo.enterpriseUserAccountType || '',
      authData: {
        access_token: this.$store.getters.token
      },
      myHeaders: { Authorization: 'Bearer ' + this.$store.getters.token },
      activeakey: '1',
      rules: { // 判断
        accountType: [
          { required: true, message: '请选择账号类型', trigger: 'change' }
        ],
        role: [
          { required: true, message: '请选择用户角色', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        account: [
          { required: true, validator: validateAccount, trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePass, trigger: 'change' }
        ],
        userName: [
          { required: true, message: '请输入你要转移的员工', trigger: 'blur' }
        ],
        email: [
          { validator: validateSpecialUser, trigger: 'blur' }
        ],
        userLicenseUuid: [
          { required: true, message: '请选择到期时间', trigger: 'change' }
        ]
      },
      principarules: { // 判断
        name: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        enterpriseDescription: [
          { required: true, message: '请输入企业简介', trigger: 'blur' }
        ],
        principalUserName: [
          { required: true, message: '请输入负责人姓名', trigger: 'blur' }
        ],
        principalUserPhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ]
      },
      userform: {
        applyRemark: ''
      },
      userrules: {
        applyRemark: [
          { required: true, message: '描述不能为空', trigger: 'blur' }
        ]
      },
      visible: false,
      loading: false,
      loadings: false,
      colleague: false,
      userble: false,
      formnameble: false,
      inviteReset: false,
      icon1: require('@/assets/img/icon_01.png'),
      icon2: require('@/assets/img/icon_02.png'),
      icon3: require('@/assets/img/icon_03.png'),
      icon4: require('@/assets/img/icon_04.png'),
      count: 0,
      tabActiveKey: '1',
      colleagustab: '1',
      radioGroup: '',
      formname: {
        name: '',
        enterpriseDescription: '',
        enterpriseIcon: '' || 'https://winrobot-pub-a.oss-cn-hangzhou.aliyuncs.com/images/f7/05/ab1a364b117127f08fe0ba32cda7.jpg',
        principalUserName: '',
        principalUserPhone: ''
      },
      coll_form: {
        name: '',
        account: '',
        role: 'e_user',
        phone: '',
        accountType: 'senior',
        userLicenseUuid: '',
        passwordType: 'system',
        customPassword: '',
        email: ''
      },
      enterpriseLicense: [],
      abbr: this.$store.state.user.info.enterprise.abbr || '',
      dayUser: {
        enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
        days: '7'
      },
      listData: [],
      columns,
      postData: {
        enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
        size: 3
      },
      inviteGetInviteLink: '',
      painObj: null,
      ColumnObj: null,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 24 }
        }
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 24, offset: 0 }
        }
      },
      newData: '',
      scurity: '',
      lastTop: '',
      berClientConfig: 0,
      specialStatus: 'down'
    }
  },
  mounted () {
    this.getdayUser(this.dayUser)
    this.getuserAggr(this.dayUser)
    this.ans('运行时长')
    this.Column()
    this.getsummaryList(this.postData)
    this.add()
    this.getqueryAvailableEnterpriseLicense()
    this.clinviteGetInviteLink()
    this.getqueryEnterprise()
    this.getsummaryData()
    this.getapprovalQueryNoApprovalCount()
    this.getClientConfig()
    if (this.enterpriseRoleCode.enterpriseRoleCode === 'e_owner' || this.enterpriseRoleCode.enterpriseRoleCode === 'e_admin') {
      this.activeakey = '1'
      this.colleagustab = '1'
    } else {
      this.activeakey = '2'
      this.colleagustab = '2'
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'dynamic_form_item' })
    this.form.getFieldDecorator('keys', { initialValue: [], preserve: true })
  },
  methods: {
    // 展开与收起港澳台邮箱输入框
    changStatus () {
      this.specialStatus = this.specialStatus === 'down' ? 'up' : 'down'
    },
    // 获取条目
    getClientConfig () {
      clientConfig().then(res => {
        if (res.code === 200) {
          this.berClientConfig = res.data.seniorRobotBlockCount || 0
        }
      })
    },
    // 获取批量导入返回结果
    importfios (data) {
      if (data) {
        this.colleagueCancel()
        this.accountbindId = true
      }
    },
    // 获取用户信息子组件
    nameaccouns (data) {
      this.accountbindId = data
    },
    apppro (data) {
      this.approveBindId = data
      this.getapprovalQueryNoApprovalCount()
    },
    // 员工登记选择默认
    accountclicks (e) {
      if ((e.target.value === 'basic' || e.target.value === 'extra') && this.coll_form.role === 'e_admin') {
        this.coll_form.role = 'e_user'
      }
    },
    // 申请成为高级账号
    userhandleCancel () {
      this.userble = false
    },
    userhandleOk () {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          applySeniorAccount(this.userform).then(res => {
            if (res.code === 200) {
              this.$message.success('申请成功请找管理员审核！')
              this.userble = false
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    usersenior () {
      this.userble = true
    },
    // 新增邮箱
    remove (k) {
      const { form } = this
      const keys = form.getFieldValue('keys')
      if (keys.length === 1) {
        return
      }
      form.setFieldsValue({
        keys: keys.filter(key => key !== k)
      })
    },
    add () {
      const { form } = this
      const keys = form.getFieldValue('keys')
      if (keys.length > 7) {
        this.$message.error('邮箱最多可添加8个！')
      } else {
        const nextKeys = keys.concat(id++)
        form.setFieldsValue({
          keys: nextKeys
        })
      }
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const { names } = values
          inviteInviteByMail(names).then(res => {
            if (res.code === 200) {
              this.$message.success('邮箱邀请成功！')
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    edits () {
      this.visible = true
    },
    // 企业信息修改
    principalHandleOk () {
      this.$refs.principaForm.validate(valid => {
        if (valid) {
          enterpriseUpdate(this.enterpriseUuid, this.formname).then(res => {
            if (res.code === 200) {
              this.getqueryEnterprise()
              this.$message.success('企业信息修改成功')
              this.visible = false
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    // 账号创建
    handleOk () {
      this.loadings = true
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const data = this.enterpriseUuid
          createUser(data, this.coll_form).then(res => {
            if (res.code === 200) {
              this.loadings = false
              this.visible = false
              this.$message.success('账号' + res.data.account + '创建成功')
              this.colleague = false
              this.accountbindId = true
              this.approveBindId = false
            } else {
              this.loadings = false
              this.$message.error(res.msg)
            }
          })
        } else {
          this.loadings = false
          return false
        }
      })
    },
    handleCancel () {
      this.visible = false
    },
    colleagues () {
      this.colleague = true
      if (this.activeakey === '1') {
        this.$nextTick(() => {
          const width = document.getElementById('suffix-input-console').nextSibling.clientWidth
          const suffixInput = document.getElementById('suffix-input-console')
          suffixInput.style.paddingRight = Math.ceil(width) + 15 + 'px'
        })
      }
    },
    colleagueCancel () {
      this.loadings = false
      this.colleague = false
    },
    // 积累数据
    getsummaryData () {
      const data = {
        enterpriseUuid: this.enterpriseUuid
      }
      summaryData(data).then(res => {
        if (res.code === 200) {
          this.lastTop = res.data
        }
      })
    },
    // 获取用户信息
    getqueryEnterprise () {
      const data = {
        enterpriseUuid: this.enterpriseUuid
      }
      queryEnterprise(data).then(res => {
        if (res.code === 200) {
          this.scurity = res.data
          this.formname = {
            name: res.data.name,
            enterpriseDescription: res.data.enterpriseDescription,
            enterpriseIcon: res.data.enterpriseIcon || 'https://winrobot-pub-a.oss-cn-hangzhou.aliyuncs.com/images/f7/05/ab1a364b117127f08fe0ba32cda7.jpg',
            principalUserName: res.data.principalUserName,
            principalUserPhone: res.data.principalUserPhone
          }
        }
      })
    },
    // 上传照片
    handleChange ({ file, fileList }) {
      this.formnameble = true
      if (file.response) {
        if (file.response.code === 200) {
          this.formname.enterpriseIcon = file.response.data.url
          this.formnameble = false
        } else {
          this.formnameble = false
        }
      }
    },
    // 点击重置邀请链接
    getinviteResetInviteLink () {
      this.inviteReset = true
      inviteResetInviteLink().then(res => {
        if (res.code === 200) {
          this.inviteGetInviteLink = res.data.inviteLink
          this.inviteReset = false
          this.$message.success('刷新成功！')
        }
      })
    },
    // 点击复制
    doCopyname () {
      const text = this.inviteGetInviteLink
      this.$copyText(text).then(message => {
        this.$message.success('链接已复制到剪切板')
      }).catch(err => {
        console.log('copy.err', err)
        this.$message.error('复制失败')
      })
    },
    // 获取分享链接
    clinviteGetInviteLink () {
      inviteGetInviteLink().then(res => {
        if (res.code === 200) {
          this.inviteGetInviteLink = res.data.inviteLink
        }
      })
    },
    // 开发者统计
    getsummaryList (data) {
      accumulateTop(data).then(res => {
        if (res.code === 200) {
          this.loading = false
          this.listData = res.data
        }
      })
    },
    // 获取默认年份
    getdayUser (data) {
      userAccumulate(data).then(res => {
        if (res.code === 200) {
          this.painObj.changeData(res.data.dataRows)
        }
      })
    },
    // 获取默认年份
    getuserAggr (data) {
      userAggr(data).then(res => {
        if (res.code === 200) {
          this.ColumnObj.changeData(res.data.dataRows)
        }
      })
    },
    // 获取附加账号
    getqueryAvailableEnterpriseLicense () {
      const data = {
        enterpriseUuid: this.enterpriseUuid
      }
      queryAvailableEnterpriseLicense(data).then(res => {
        if (res.code === 200) {
          this.enterpriseLicense = res.data
          if (res.data.length === 0) {
            this.coll_form.userLicenseUuid = ''
          } else {
            this.coll_form.userLicenseUuid = res.data[0].uuid
          }
        }
      })
    },
    // 面积图点击切换年月周
    onChanger (e) {
      switch (e.target.value) {
        case 'year':
          this.dayUser.days = '365'
          break
        case 'month':
          this.dayUser.days = '30'
          break
        case 'week':
          this.dayUser.days = '7'
          break
      }
      this.getdayUser(this.dayUser)
    },
    // 柱状图点击切换年月周
    ramChanger (e) {
      switch (e.target.value) {
        case 'year':
          this.dayUser.days = '365'
          break
        case 'month':
          this.dayUser.days = '30'
          break
        case 'week':
          this.dayUser.days = '7'
          break
      }
      this.getuserAggr(this.dayUser)
    },
    // 柱状图
    Column () {
      const columnPlot = new Column(document.getElementById('lumnContainer'), {
        title: {
          visible: true,
          text: ''
        },
        forceFit: true,
        data,
        padding: 'auto',
        xField: '时间',
        yField: '运行时长',
        meta: {
          时间: {
            alias: ''
          },
          运行时长: {
            alias: '执行时长(小时)'
          }
        }
      })
      columnPlot.render()
      this.ColumnObj = columnPlot
    },
    // 积累运行时间面积图
    ans (test) {
      const areaPlot = new Area(document.getElementById('container'), {
        title: {
          visible: true,
          text: ''
        },
        data,
        forceFit: true,
        height: 400,
        meta: {
          时间: {
            alias: '年份',
            range: [0, 1]
          }
        },
        xAxis: {
          type: 'dateTime',
          tickCount: 8
        },
        yAxis: {
          min: 0
        },
        lineDash: 'number',
        color: ['#FF7F86'],
        xField: '时间',
        yField: '运行时长',
        smooth: true
      })
      areaPlot.render()
      this.painObj = areaPlot
    },
    // 需要审批条数
    getapprovalQueryNoApprovalCount () {
      approvalQueryNoApprovalCount().then(res => {
        if (res.code === 200) {
          this.count = res.data.waitApprovalCount
        } else {
        }
      })
    },
    // 切换
    callback (key) {
      switch (key) {
        case '1':
          this.accountbindId = false
          this.approveBindId = false
          break
        case '2':
          this.accountbindId = true
          this.approveBindId = false
          break
        case '3':
          this.accountbindId = false
          this.approveBindId = true
          break
      }
      this.tabActiveKey = key
    },
    // 切换
    colleagus (key) {
      this.colleagustab = key
      if (key === '1') {
        this.$nextTick(() => {
        const width = document.getElementById('suffix-input-console').nextSibling.clientWidth
        const suffixInput = document.getElementById('suffix-input-console')
        suffixInput.style.paddingRight = Math.ceil(width) + 15 + 'px'
      })
      }
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.ant-modal-header{
  padding: 16px 24px;
    color: rgba(0, 0, 0, 0.65);
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    border-radius: 3px 3px 0 0;
  .ant-modal-title{
    margin: 0;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    word-wrap: break-word;
  }
}
.ant-popover-inner-content{
  p:last-child{
    margin: 0;
  }
}
/deep/.ant-page-header-footer .ant-tabs-bar .ant-tabs-nav .ant-tabs-tab{
  font-size: 14px;
  margin-right: 20px;
  width: 80px;
  text-align: center;
}
/deep/.ant-table-thead tr th {
  background: #FAFAFA;
}
/deep/.ant-modal-close-x{
  width: 40px;
  height: 40px;
  line-height: 40px;
}
/deep/.ant-badge{
  font-size: 14px;
}
// /deep/.ant-page-header-heading-title{
//   width:80%;
// }
/deep/.ant-breadcrumb{
  display: none;
}
/deep/.ant-card-body{
  padding: 24px 0 0 0;
}
/deep/.ant-form-horizontal{
  .ant-row{
    padding: 0;
  }
}
.edits{
  margin-left: 8px;
}
.ant-row{
  padding: 24px 0 0 0;
}
.ant-btn-group{
  margin-top: 20px;
}
.enterprise{
  background: #fafafa;
  min-height: 100%;
  /deep/.ant-badge-count{
    top: -1px;
    right: -8px;
    height: 14px;
    line-height: 14px;
  }
}
.application_detail{
  margin-top: 30px;
  .application_detailimg{
    float: left;
    img{
      width: 64px;
      height: 64px;
      border-radius: 50%;
      // border: 1px solid #D9D9D9;
      border: 1px solid rgba(31,35,41,.1);
    }
  }
  .application_detailright{
    float: left;
    margin-left: 20px;
    h2{
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #474F59;
      margin: 0;
    }
    span{
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #979DA5;
      margin-top: -6px;
      display: block;
    }
  }
}
.index_title{
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #474F59;
  em{
    font-style: normal;
    color: #979DA5;
    margin: 0 10px;
  }
  span{
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #979DA5;
  }
}
.index_app{
  padding: 24px 24px 24px 24px;
  border-radius: 3px;
  height: 95px;
  position: relative;
  background: #fff;
  img{
    width: 80/2px;
    float: left;
    margin-top: 3 px;
    margin-right: 15px;
  }
  h2{
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #474F59;
    margin: 0px;
    margin-top: 1px;
  }
  span{
    font-size: 18px;
    font-family: DINOT;
    font-weight: bold;
    color: #474F59;
    display: block;
    margin-top: 1px;
  }
  .ant-pro-trend{
    display: block;
    border-top: 1px solid #e8e8e8;
    padding-top: 9px;
    margin-top: 20px;
    span{
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #979DA5;
    }
    /deep/.up{
      top: -1px;
      margin-left: 8px;
    }
    /deep/.item-text{
      margin-left: 0;
    }
  }
}
.icon_upload{
  width: 56px;
  height: 56px;
  display: inline-block;
  margin-right: 16px;
  img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 1px solid #D9D9D9;
  }
}
.footer{
  margin-top: 45px;
  text-align: center;
  width: 430px;
  margin: 0 auto;
  padding-bottom: 50px;
  color: #979DA5;
  span{
    width: 80px;
    height: 1px;
    background: #E8E8E8;
    float: left;
    margin-top: 10px;
  }
}
.colleagus{
  /deep/.ant-modal-body{
    padding: 0;
    .ant-tabs-bar{
      margin: 0 0 8px 0;
    }
    .ant-tabs-tab{
      margin-right: 16px;
    }
    /deep/.ant-tabs-nav{
      margin: 0 20px;
    }
  }
}
.colltab{
  padding: 0 16px 16px 16px;
  .colltab_url{
    position: relative;
    margin-top: 24px;
    padding: 0 16px;
    margin-bottom: 24px;
    input{
      width: 80%;
      float: left;
      border-right: none;
      border-radius: 3px 0 0 3px;
      padding-right: 30px;
    }
    button{
      float: left;
      border-radius: 0 3px 3px 0;
    }
    i{
      position: absolute;
      right: 24%;
      top: 10px;
      cursor: pointer;
    }
  }
}
.coll_formbody{
  width: 32px;
  height: 20px;
  line-height: 18px;
  background: #1890FF;
  border-radius: 7px;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #FFFFFF;
  display: inline-block;
  transform: scale(0.83);
  text-align: center;
  position: absolute;
  right: -14px;
  top: -14px;
}
.invitation{
  background: #E8F5FC;
  border: 1px solid #C1DDEC;
  border-radius: 3px;
  height: 140px;
  display: flex;
  .invitation_left{
    width: 120px;
    height: 80px;
    border-right: 1px solid #C1DDEC;
    margin-top: 30px;
    padding-top: 4px;
    div{
      font-size: 40px;
      font-family: DINOT;
      font-weight: bold;
      color: #474F59;
      line-height: 34px;
      text-align: center;
    }
    span{
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #979DA5;
      line-height: 34px;
      text-align: center;
      margin-top: 18px;
      display: block;
    }
  }
  .invitation_right{
    flex: 1;
    position: relative;
    margin-left: 40px;
    h1{
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #474F59;
      margin-top: 26px;
      margin-bottom: 0;
      em{
        font-style: normal;
      }
    }
    p{
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #B2B9C2;
      margin: 0;
      margin-top: 2px;
    }
    img{
      width: 500/2px;
      position: absolute;
      right: 6%;
      bottom: 0;
    }
    .invitation_bottom{
      margin-top: 14px;
      .invitation_copy{
        width: 136px;
        height: 28px;
        background: #FFFFFF;
        border: 1px solid #C1DDEC;
        border-radius: 14px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #474F59;
        line-height: 26px;
        text-align: center;
        float: left;
        margin-right: 8px;
        cursor: pointer;
      }
      .invitation_hove{
        width: 136px;
        height: 28px;
        background: #E8F5FC;
        border: 1px solid #C1DDEC;
        border-radius: 14px;
        text-align: center;
        float: left;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #474F59;
        line-height: 26px;
        cursor: pointer;
        transition: 0.3s all;
        &:hover{
          background: #dcecf5;
        }
      }
    }
  }
}
.extra_tab{
  text-align: center;
  line-height: 40px;
  a{
    color: #1890FF;
  }
}
.inviteResetsty{
  animation: loadingCircle 1s linear infinite;
}
.seniorRobotBlockCount{
  font-size: 12px;
  margin-left: 40px;
  margin-bottom: 6px;
  color: #333;
  span{
    color: #999;
  }
}
/deep/ .special_user{
  color: #A6A6A6;
  margin-bottom: 24px;
  font-size: 14px;
  .font{
    cursor: pointer;
    padding: 0 7px;
    .anticon{
      font-size: 12px;
    }
  }
}
/deep/ .ant-input-affix-wrapper .ant-input:not(:last-child) {
    padding-right: 50px;
}
</style>
