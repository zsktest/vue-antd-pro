<template>
  <div>
    <a-row :gutter="24">
      <a-col :sm="24" :md="24" :xl="24">
        <!-- <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :loading="loading" :bordered="false" title="开发者统计" :style="{ height: '100%' }">
          <div>asd</div>
        </a-card> -->
        <div class="account">
          <div class="account_title">
            <h1>{{ account_user.name }}</h1>
            <a-tooltip placement="top">
              <template slot="title">
                <span>还可创建 {{ account_user.remainUserQuota }} 个高级账号</span>
              </template>
              <span class="account_user"><a-icon type="team" />高级账号: (<em>{{ account_user.userCount }}</em>/{{ account_user.userQuota }})</span>
            </a-tooltip>
            <a-tooltip placement="top">
              <template slot="title">
                <span>还可创建 {{ account_user.remainBasicUserQuota }} 个基础账号</span>
              </template>
              <span class="account_user"><a-icon type="check-circle" />基础账号: (<em>{{ account_user.basicUserCount }}</em>/{{ account_user.basicUserQuota }})</span>
            </a-tooltip>
            <a-tooltip placement="top" v-if="account_user.enableExtraAccount">
              <template slot="title">
                <span>还可创建 {{ account_user.remainExtraUserQuota }} 个临时账号</span>
              </template>
              <span class="account_user"><a-icon type="file-add" />临时账号: (<em>{{ account_user.extraUserCount }}</em>/{{ account_user.extraUserQuota }})</span>
            </a-tooltip>
            <a-input-search placeholder="支持账号或姓名模糊查询" style="width: 200px" @search="handleInputsearch"/>
            <!-- <div class="acconut_right" @click="info" v-if="account_user.enableExtraAccount">开通更多账号</div>
            <div class="acconut_right" @click="infoname" v-else>开通更多账号</div> -->
            <div class="acconut_rightuser" @click="showModal('')"><a-icon type="plus" />添加成员</div>
            <div class="bt"></div>
          </div>
          <div style="padding:0 24px;">
            <a-table
              :row-key="record => record.userLicense.uuid"
              :row-selection="{ selectedRowKeys: selectedItemRowKeys, onChange: onSelectItemChange }"
              :columns="columns"
              :data-source="listData"
              :pagination="pagination"
              :loading="loading"
              @change="handleTableChange"
            >
              <template slot="user" slot-scope="text, record">
                <div class="loginaccountname">{{ record.loginAccount }}<a-tag style="margin-left:5px" color="blue" v-if="record.userLicense && record.userLicense.source === 'extra'">临时</a-tag><a-icon type="copy" @click="doCopyname(record.loginAccount)" /></div>
              </template>
              <template slot="imsl" slot-scope="text, record">
                {{ record.expiredTime.slice(0,10) }}
                <span class="tasktopend" v-if="record.userLicense && record.userLicense.status === 'expired'"><a-icon type="clock-circle" /> 过期</span>
              </template>
              <template slot="accountType" slot-scope="text, record">
                <a-tag color="blue" v-if="record.accountType === 'senior'">{{ record.accountTypeName }}</a-tag>
                <a-tag v-else>{{ record.accountTypeName }}</a-tag>
              </template>
              <template slot="action" slot-scope="text, record">
                <span>
                  <!-- <a @click="handleRead(record.userUuid)">查看</a> -->
                  <a :href="'../account/detail?userUuid='+record.userUuid">查看</a>
                  <!-- <a-divider type="vertical" /> -->
                  <a href="javascript:;" style="margin-left: 15px;" v-if="record.userLicense && record.userLicense.source === 'extra'" @click="gettradeDelay(record.userLicense.uuid)">续费</a>
                  <a-dropdown >
                    <a class="ant-dropdown-link">
                      更多 <a-icon type="caret-down"/>
                    </a>
                    <a-menu slot="overlay">
                      <a-menu-item v-if="record.role != 'e_owner'">
                        <a href="javascript:;" @click="showModal(record)">编辑</a>
                      </a-menu-item>
                      <a-menu-item v-if="enterpriseLicense.length > 0 && record.userLicense.source === 'extra'">
                        <a href="javascript:;" @click="getorderClose(record.userUuid)">更新许可证</a>
                      </a-menu-item>
                      <a-menu-item v-if="record.accountType != 'basic'">
                        <a href="javascript:;" @click="getcreateOrQueryMigrateCode(record)">获取迁移码</a>
                      </a-menu-item>
                      <a-menu-item>
                        <a href="javascript:;" @click="confirm(record)">重置密码</a>
                      </a-menu-item>
                      <a-menu-item v-if="record.role != 'e_owner'">
                        <a href="javascript:;" @click="getdelete(record)">删除</a>
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </span>
              </template>
            </a-table>
          </div>
        </div>
      </a-col>
    </a-row>
    <!-- 修改密码弹窗 -->
    <a-modal v-model="custom_password" title="重置密码" @ok="click_password">
      <a-alert message="请选择重置密码方式" banner />
      <a-form-model
        ref="ruleForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        class="passwordType"
      >
        <a-form-model-item label="初始密码">
          <a-radio-group v-model="pass_form.passwordType">
            <a-radio value="system">系统生成</a-radio>
            <a-radio value="custom">自定义密码</a-radio>
          </a-radio-group>
          <a-input-password v-show="pass_form.passwordType === 'custom'" v-model="pass_form.customPassword" placeholder="请输入密码" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 创建账号 -->
    <a-modal v-model="visible" v-if="visible" :maskClosable="false" :title="titleUserName" on-ok="handleOk">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="账号类型" prop="accountType">
          <a-radio-group v-model="form.accountType" @change="accountclicks">
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
            <a-radio value="extra" v-if="account_user.enableExtraAccount && userLicense.source == 'extra'">临时账号
              <a-tooltip placement="top">
                <template slot="title">
                  <span>有时效性，具有所有功能权限</span>
                </template>
                <a-icon type="question-circle" />
              </a-tooltip>
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <div v-show="form.accountType === 'basic' || form.accountType === 'senior' || (form.accountType === 'extra' && this.enterpriseLicense.length > 0)">
          <a-form-model-item ref="name" label="员工姓名" prop="name">
            <a-input v-model="form.name" :maxLength="50" placeholder="员工姓名或昵称"/>
          </a-form-model-item>
          <a-form-model-item ref="account" label="登录账号" prop="account">
            <a-input
              id="suffix-input"
              :suffix="'@' + abbr"
              :disabled="accountDisabled"
              v-model="form.account"
              :maxLength="50"
              placeholder="建议字母+数字"/>
          </a-form-model-item>
          <a-form-model-item label="用户角色" prop="role">
            <a-select v-model="form.role" placeholder="用户角色">
              <a-select-option value="e_runner">
                仅可运行的用户
              </a-select-option>
              <a-select-option value="e_user">
                可编辑和运行的用户
              </a-select-option>
              <a-select-option value="e_admin" v-if="form.accountType === 'senior'" >
                管理员
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="phone" label="手机号" prop="phone">
            <a-input type="tel" v-model="form.phone" placeholder="用于接收和找回密码"/>
            <a-input type="tel" style="width:10px;position:fixed;top:-9999px"/>
          </a-form-model-item>
          <a-form-model-item ref="userLicenseUuid" label="到期时间" v-if="form.accountType === 'extra' && readsto" prop="userLicenseUuid">
            <a-select v-model="form.userLicenseUuid" placeholder="到期时间选择">
              <a-select-option v-for="(tims, index) in enterpriseLicense" :key="index" :value="tims.uuid">
                {{ tims.endTime.slice(0,10) }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="初始密码" v-show="passwordvis === false">
            <a-radio-group v-model="form.passwordType">
              <a-radio value="system">系统生成</a-radio>
              <a-radio value="custom">自定义密码</a-radio>
            </a-radio-group>
            <a-input-password v-show="form.passwordType === 'custom'" v-model="form.customPassword" placeholder="请输入密码" />
            <a-input-password style="width:10px;position:fixed;top:-9999px" />
          </a-form-model-item>
          <!-- <div class="special_user">
            <span class="font" @click="changStatus">港澳台用户<a-icon :type="specialStatus" /></span><span>-------------------------------------------------------</span>
          </div> -->
          <a-form-model-item ref="email" label="邮箱" prop="email">
            <a-input type="tel" v-model="form.email" placeholder="用于找回密码"/>
          </a-form-model-item>
        </div>
        <div v-show="form.accountType === 'extra' && this.enterpriseLicense.length === 0">
          <div class="radioGroup">
            <img src="@/assets/img/none.png" alt="" width="205">
            <p>暂无临时账号许可证，请购买</p>
          </div>
        </div>
      </a-form-model>
      <template slot="footer">
        <div v-show="form.accountType === 'basic' || form.accountType === 'senior' || this.enterpriseLicense.length > 0">
          <a-button @click="handleCancel">
            取消
          </a-button>
          <a-button type="primary" :loading="loadings" @click="handleOk">
            确定
          </a-button>
        </div>
        <div v-show="form.accountType === 'extra' && this.enterpriseLicense.length === 0">
          <a-button type="primary" :loading="loadings" @click="info">
            购买
          </a-button>
        </div>
      </template>
    </a-modal>
    <!-- 购买 -->
    <a-modal v-model="pay" @cancel="payquxiao" :footer="null" :maskClosable="false" :title="titleSUB">
      <div v-show="userpay === true">
        <p>企业内高级账号不足，可以购买临时账号来补充</p>
        <div class="month">
          <p>购买时长<span>(月)</span></p>
          <div>
            <a-button-group>
              <a-button @click="decline">
                <a-icon type="minus"/>
              </a-button>
              <a-input v-model="month" @blur="descline"></a-input>
              <a-button @click="increase">
                <a-icon type="plus"/>
              </a-button>
            </a-button-group>
          </div>
          <span v-show="tradeDelay === true">到期时间 {{ enquiryUserLicenses.licenseEndTime }}</span>
        </div>
        <div class="month" v-show="tradeDelay === true">
          <p>购买数量</p>
          <div>
            <a-button-group>
              <a-button @click="denumber">
                <a-icon type="minus" />
              </a-button>
              <a-input v-model="number" @blur="insnumber"></a-input>
              <a-button @click="innumber">
                <a-icon type="plus" />
              </a-button>
            </a-button-group>
          </div>
        </div>
        <div class="month" style="margin-top:8px;">
          <p>支付方式</p>
          <div>
            <img src="@/assets/img/alipay.png" alt="" width="32">
            支付宝
          </div>
        </div>
        <a-divider />
        <div class="month" style="margin-top:8px;">
          <p>总计</p>
          <div class="payname">{{ enquiryUserLicenses.totalAmountValue }}元</div>
          <div class="paynameenquiry"><span>促销价</span>{{ enquiryUserLicenses.receiptAmountValue }}<span>元</span></div>
          <div class="bt"></div>
        </div>
        <a-button type="primary" @click="enquiryUserpay" v-show="tradeDelay === true">立即支付</a-button>
        <a-button type="primary" @click="xenqufiryUser" v-show="tradeDelay === false">立即支付</a-button>
      </div>
      <div v-show="userpayname === true">
        <p>支付完成前，请不要关闭此支付验证窗口。支付完成后，请根据您的情况点击下面按钮。</p>
        <template>
          <a-button type="primary" @click="paycomplete">支付完成</a-button>
          <a-button style="margin-left:10px" @click="payquxiao">取消</a-button>
        </template>
      </div>
      <div v-show="paySuccess === true">
        <a-result status="success" title="支付成功">
          <template #extra>
            <a-button type="primary" @click="payquxiao">确定</a-button>
          </template>
        </a-result>
      </div>
      <div v-show="payError">
        <a-result status="error" title="支付失败" sub-title="如果您有任何疑问，请立即联系客服：0571-28284656">
          <template #extra>
            <a-button @click="payquxiao">取消</a-button>
            <a-button type="primary" @click="continuePay">继续支付</a-button>
          </template>
        </a-result>
      </div>
    </a-modal>
    <!-- 删除用户 -->
    <a-modal v-model="delDelete" title="删除用户" on-ok="modelDelete">
      <p>被删除用户的应用和市场，都将转移到指定的员工名下</p>
      <!-- <a-form-model-item ref="userName" label="员工姓名" prop="userName">
        <a-input v-model="userName" placeholder="员工的中文名称或昵称"/>
      </a-form-model-item> -->
      <a-auto-complete
        v-model="userName"
        :data-source="dataSource"
        style="width: 350px"
        placeholder="员工的中文名称或昵称"
        @search="onSearch"
        @select="onSelect">
        <template slot="dataSource">
          <a-select-option v-for="(item,index) in dataSource" :key="index" :value="item.userUuid">账号：{{ item.account }}&nbsp;&nbsp;&nbsp; 姓名：{{ item.name }}</a-select-option>
        </template>
      </a-auto-complete>
      <template slot="footer">
        <a-button @click="CancelmodelDelete">
          取消
        </a-button>
        <a-button type="primary" :loading="loadings" @click="modelDelete">
          确定
        </a-button>
      </template>
    </a-modal>
    <!-- 更新许可证选择日期 -->
    <a-modal v-model="update" title="选择到期时间" @ok="modelUpdate">
      <p>请选择到期时间</p>
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol">
        <a-form-model-item ref="userLicenseUuid" label="到期时间">
          <a-select v-model="form.userLicenseUuid" placeholder="到期时间选择">
            <a-select-option v-for="(tims, index) in enterpriseLicense" :key="index" :value="tims.uuid">
              {{ tims.endTime.slice(0,10) }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <div class="accountBottom" v-show="selectedItemRowKeysname === true">
      <p>已选择<span>{{ `${selectedItemRowKeys.length}` }}</span>项</p>
      <!-- <a-button @click="getorderClose(selectedItemRowKeys)">释放许可证</a-button> -->
      <a-button type="primary" @click="gettradeDelay(selectedItemRowKeys)">续费</a-button>
      <span style="line-height: 50px;float: right;color: #999;margin-right: 20px;">只支持临时账号续费</span>
    </div>
  </div>
</template>
<script>
import { queryEnterprise, accountUser, createUser, updateUser, createOrQueryMigrateCode, resetUserPassword, userList, deleteUser, queryAvailableEnterpriseLicense, enquiryUserLicense, orderUserLicenseWithAlipay, queryOrderPayoff, tradePay, tradeDelay, updateExtraUserLicense } from '@/api/user'
// 表格项
const columns = [
  // {
  //   title: '账号',
  //   dataIndex: 'account'
  //   // width: '20%'
  // },
  {
    title: '登录账号',
    dataIndex: 'loginAccount',
    width: '20%',
    scopedSlots: { customRender: 'user' }
  },
  {
    title: '员工姓名',
    width: '15%',
    dataIndex: 'name'
  },
  // {
  //   title: '手机号',
  //   dataIndex: 'phone'
  // },
  // {
  //   title: '初始密码',
  //   dataIndex: 'password'
  // },
  {
    title: '用户角色',
    dataIndex: 'roleName'
  },
  {
    title: '账号类型',
    dataIndex: '',
    scopedSlots: { customRender: 'accountType' }
  },
  {
    title: '最近登录',
    dataIndex: 'latestLoginTime'
  },
  {
    title: '到期时间',
    dataIndex: 'createTime',
    key: 'createTime',
    slots: { title: 'customTime' },
    scopedSlots: { customRender: 'imsl' },
    filters: [
      {
        text: '未过期',
        value: 'unexpired'
      },
      {
        text: '15天到期',
        value: 'recent15DaysExpired'
      },
      {
        text: '已过期',
        value: 'expired'
      }
    ],
    filterMultiple: false
  },
  {
    title: '操作',
    dataIndex: '',
    width: '14%',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
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
      labelCol: { span: 4 },
      wrapperCol: { span: 19 },
      visible: false,
      delDelete: false,
      update: false,
      updatauserUuid: '',
      enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
      enterpriseType: this.$store.getters.userInfo.enterpriseType || '',
      account_user: '',
      loading: false,
      loadings: false,
      pagination: {
        showQuickJumper: true
      },
      abbr: this.$store.state.user.info.enterprise.abbr || '',
      listData: [],
      userName: '',
      titleUserName: '添加账号',
      columns,
      action: 'create',
      userLicense: {},
      form: {
        name: '',
        account: '',
        role: 'e_user',
        phone: '',
        enterpriseUserUuid: '',
        userLicenseUuid: '',
        passwordType: 'system',
        customPassword: '',
        accountType: '',
        email: ''
      },
      accountDisabled: false,
      postData: {
        enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
        userUuid: '',
        groupInfoUuid: '',
        key: '',
        expiredStatus: '',
        page: 1,
        size: 10
      },
      selectedItemRowKeys: [],
      selectedItemRows: '',
      selectedItemRowKeysname: false,
      rules: { // 判断
        accountType: [
          { required: true, message: '请选择账号类型', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择用户角色', trigger: 'change' }
        ],
        account: [
          { required: true, validator: validateAccount, trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePass, trigger: 'blur' }
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
      selectUsdeptsFs: '',
      titleSUB: '购买临时账号',
      dataSource: [],
      receiveUserUuid: '',
      enterpriseLicense: [],
      readsto: true,
      radioGroup: '',
      pay: false,
      tradeDelay: true,
      month: 1,
      number: 1,
      enquiryUserLicenses: '',
      userOrderUuid: '',
      enquiryUser: false,
      userpay: true,
      userpayname: false,
      paySuccess: false,
      payError: false,
      custom_password: false,
      pass_form: {
        userUuid: '',
        passwordType: 'system',
        customPassword: ''
      },
      passwordvis: false,
      specialStatus: 'down'
    }
  },
  mounted () {
    this.getMyActivity()
    this.accountUsery(this.postData)
    this.$spm('o.b')
    this.getqueryAvailableEnterpriseLicense()
    const data = {
      count: this.number,
      duration: this.month,
      enterpriseUuid: this.enterpriseUuid
    }
    this.getenquiryUserLicense(data)
  },
  methods: {
    // 员工登记选择默认
    accountclicks (e) {
      if ((e.target.value === 'basic' || e.target.value === 'extra') && this.form.role === 'e_admin') {
        this.form.role = 'e_user'
      }
    },
    // 展开与收起港澳台邮箱输入框
    changStatus () {
      this.specialStatus = this.specialStatus === 'down' ? 'up' : 'down'
    },
    // 点击复制
    doCopyname (index) {
      const text = index
      this.$copyText(text).then(message => {
        this.$message.success('登录账号已复制到剪切板')
      }).catch(err => {
        console.log('copy.err', err)
        this.$message.error('复制失败')
      })
    },
    info () {
      this.userpay = true
      this.paySuccess = false
      this.payError = false
      this.userpayname = false
      this.$spm('o.b.2')
      this.pay = true
      this.visible = false
      this.titleSUB = '购买临时账号'
      this.tradeDelay = true
      this.month = 1
      this.number = 1
      const data = {
        count: this.number,
        duration: this.month,
        enterpriseUuid: this.enterpriseUuid
      }
      this.getenquiryUserLicense(data)
    },
    infoname () {
      this.$spm('o.b.2')
      const h = this.$createElement
      this.$info({
        title: '请联系影刀官方技术支持',
        content: h('div', {}, [
        ]),
        onOk () {}
      })
    },
    // 附加账号续费
    gettradeDelay (last) {
      if (last instanceof Array) {
        this.number = last.length
      } else {
        this.number = 1
      }
      this.titleSUB = '续费临时账号'
      this.month = 1
      this.pay = true
      this.tradeDelay = false
      this.userpay = true
      this.paySuccess = false
      this.payError = false
      this.userpayname = false
      this.selectedItemRows = last.toString()
      const data = {
        count: this.number,
        duration: this.month,
        enterpriseUuid: this.enterpriseUuid
      }
      this.getenquiryUserLicense(data)
    },
    // 点击续费
    xenqufiryUser () {
      const data = {
        duration: this.month,
        userLicenseUuids: this.selectedItemRows,
        enterpriseUuid: this.enterpriseUuid
      }
      tradeDelay(data).then(res => {
        if (res.code === 200) {
          this.userpay = false
          this.userpayname = true
          // payUrl
          this.userOrderUuid = res.data
          window.open(res.data.payUrl, '_blank')
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 点击释放附加账号
    modelUpdate () {
      const data = {
        userUuid: this.updatauserUuid,
        userLicenseUuid: this.form.userLicenseUuid
      }
      updateExtraUserLicense(data).then(res => {
        if (res.code === 200) {
          this.$message.success('账号修改成功')
          this.accountUsery(this.postData)
          this.getqueryAvailableEnterpriseLicense()
          this.update = false
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    getorderClose (last) {
      this.update = true
      this.updatauserUuid = last.toString()
    },
    // 点击支付完成
    paycomplete () {
      const data = {
        userOrderUuid: this.userOrderUuid.userOrderUuid
      }
      queryOrderPayoff(data).then(res => {
        if (res.code === 200) {
          this.userpayname = false
          if (res.data === 'payed' || res.data === 'finish') {
            this.paySuccess = true
          } else {
            this.payError = true
          }
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 点击支付
    enquiryUserpay () {
      const data = {
        count: this.number,
        duration: this.month,
        enterpriseUuid: this.enterpriseUuid
      }
      orderUserLicenseWithAlipay(data).then(res => {
        if (res.code === 200) {
          this.userpay = false
          this.userpayname = true
          // payUrl
          this.userOrderUuid = res.data
          window.open(res.data.payUrl, '_blank')
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 点击继续支付
    continuePay () {
      const data = {
        enterpriseUuid: this.enterpriseUuid,
        userOrderUuid: this.userOrderUuid.userOrderUuid
      }
      tradePay(data).then(res => {
        if (res.code === 200) {
          this.userpay = false
          this.payError = false
          this.userpayname = true
          this.userOrderUuid = res.data
          window.open(res.data.payUrl, '_blank')
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 是否选中
    oncheckbox (e) {
      if (e.target.checked) {
        this.enquiryUser = false
      } else {
        this.enquiryUser = true
      }
    },
    // 加减月份
    decline () {
      let month = this.month - 1
      if (month <= 1) {
        month = 1
      }
      this.month = month
      const data = {
        count: this.number,
        duration: this.month,
        enterpriseUuid: this.enterpriseUuid
      }
      this.getenquiryUserLicense(data)
    },
    increase () {
      this.month++
      if (this.month >= 12) {
        this.month = 12
      }
      const data = {
        count: this.number,
        duration: this.month,
        enterpriseUuid: this.enterpriseUuid
      }
      this.getenquiryUserLicense(data)
    },
    descline () {
      if (this.month >= 12) {
        this.month = 12
      }
      if (this.month === '') {
        this.month = 1
      }
      var isNaN = /^[1-9]+[0-9]*]*$/
      if (!isNaN.test(this.month)) {
        this.month = 1
      }
      const data = {
        count: this.number,
        duration: this.month,
        enterpriseUuid: this.enterpriseUuid
      }
      this.getenquiryUserLicense(data)
    },
    // 加减数量
    denumber () {
      let number = this.number - 1
      if (number <= 1) {
        number = 1
      }
      this.number = number
      const data = {
        count: this.number,
        duration: this.month,
        enterpriseUuid: this.enterpriseUuid
      }
      this.getenquiryUserLicense(data)
    },
    innumber () {
      this.number++
      if (this.number >= 99) {
        this.number = 99
      }
      const data = {
        count: this.number,
        duration: this.month,
        enterpriseUuid: this.enterpriseUuid
      }
      this.getenquiryUserLicense(data)
    },
    insnumber () {
      if (this.number >= 99) {
        this.number = 99
      }
      if (this.number === '') {
        this.number = 1
      }
      var isNaN = /^[1-9]+[0-9]*]*$/
      if (!isNaN.test(this.number)) {
        this.number = 1
      }
      const data = {
        count: this.number,
        duration: this.month,
        enterpriseUuid: this.enterpriseUuid
      }
      this.getenquiryUserLicense(data)
    },
    // 获取价格
    getenquiryUserLicense (data) {
      enquiryUserLicense(data).then(res => {
        if (res.code === 200) {
          this.enquiryUserLicenses = res.data
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 取消购买附加账号
    payquxiao () {
      this.pay = false
      this.getMyActivity()
      this.accountUsery(this.postData)
    },
    // title还可创建多少个用户
    getMyActivity (data) {
      data = {
        enterpriseUuid: this.enterpriseUuid
      }
      queryEnterprise(data).then(res => {
        this.account_user = res.data
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
            this.radioGroup = null
          } else {
            this.radioGroup = res.data[0].uuid
            this.form.userLicenseUuid = res.data[0].uuid
          }
        }
      })
    },
    // 获取列表
    accountUsery (data) {
      this.loading = true
      accountUser(data).then(res => {
        if (res.code === 200) {
          const pagination = { ...this.pagination }
          pagination.total = res.page.total
          pagination.current = res.page.page
          this.loading = false
          this.listData = res.data
          this.pagination = pagination
        } else {
          this.loading = false
          this.listData = []
          if (res.code === 500) {
            this.$message.warning('系统异常！')
          } else {
            this.$message.warning(res.msg + '， 失败')
          }
        }
      })
    },
    /**
     * @description: 表格分页、排序、筛选变化时触发
     * @param {Object} pagination：分页
     * @param {Object} filters：筛选
     * @param {Object} sorter：排序
     */
    handleTableChange (pagination, filters, sorter) {
      if (!filters.createTime) {
        filters.createTime = []
      }
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.postData.expiredStatus = filters.createTime[0] || filters.createTime
      this.postData.page = pager.current
      this.accountUsery(this.postData)
      this.onSelectItemChange([], [])
    },
    // 搜索
    handleInputsearch (value, event) {
      this.postData.key = value
      this.postData.page = 1
      this.accountUsery(this.postData)
    },
    // 查看
    handleRead (key) {
      this.$router.push({
        path: '/account/detail',
        query: {
          userUuid: key
        }
      })
    },
    // 添加成员
    showModal (last) {
      if (last === '') {
        this.passwordvis = false
        this.getqueryAvailableEnterpriseLicense()
        this.readsto = true
        this.action = 'create'
        this.form = {
          name: '',
          account: '',
          role: 'e_user',
          phone: '',
          enterpriseUserUuid: '',
          userLicenseUuid: this.radioGroup,
          passwordType: 'system',
          customPassword: '',
          accountType: 'senior'
        }
        this.userLicense = {
          source: 'extra'
        }
        this.titleUserName = '添加账号'
        this.accountDisabled = false
      } else {
        this.passwordvis = true
        this.readsto = false
        this.action = 'edit'
        this.titleUserName = '编辑账号'
        this.form = {
          name: last.name,
          account: last.account,
          role: last.role,
          phone: last.phone,
          enterpriseUserUuid: last.uuid,
          userLicenseUuid: '',
          passwordType: 'system',
          customPassword: '',
          accountType: last.userLicense && last.userLicense.source === 'extra' ? last.userLicense.source : last.accountType,
          email: last.email
        }
        this.userLicense = last.userLicense
        this.accountDisabled = true
      }
      this.visible = true
      this.$nextTick(() => {
        const width = document.getElementById('suffix-input').nextSibling.clientWidth
        const suffixInput = document.getElementById('suffix-input')
        suffixInput.style.paddingRight = Math.ceil(width) + 15 + 'px'
      })
    },
    // 默认列表&&全选
    onSelectItemChange (selectedRowKeys, selectedRows) {
      this.selectedItemRowKeys = selectedRowKeys
      for (const item of selectedRows) {
        if (item.userLicense.source === 'basic') {
          this.selectedItemRowKeysname = false
          return false
        } else {
          this.selectedItemRowKeysname = true
        }
      }
      if (this.selectedItemRowKeys.length === 0) {
        this.selectedItemRowKeysname = false
      }
    },
    // 确定提交
    handleOk () {
      this.loadings = true
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const data = this.enterpriseUuid
          // 注册提交接口
          if (this.action === 'create') {
            this.getcreateUser(data, this.form) // 创建
          } else if (this.action === 'edit') {
            this.getupdateUser(data, this.form) // 修改
          }
        } else {
          this.loadings = false
          return false
        }
      })
    },
    // 取消创建
    handleCancel (e) {
      this.visible = false
    },
    // 创建用户接口请求
    getcreateUser (data, form) {
      createUser(data, form).then(res => {
        if (res.code === 200) {
          this.loadings = false
          this.visible = false
          this.$message.success('账号' + res.data.account + '创建成功')
          this.accountUsery(this.postData)
          this.getMyActivity()
          this.getqueryAvailableEnterpriseLicense()
          this.$spm('o.b.1')
        } else {
          this.loadings = false
          this.$message.warning(res.msg)
        }
      })
    },
    // 修改用户接口
    getupdateUser (data, form) {
      updateUser(data, form).then(res => {
        if (res.code === 200) {
          this.loadings = false
          this.visible = false
          this.$message.success('账号' + res.data.account + '修改成功')
          this.accountUsery(this.postData)
          this.getMyActivity()
          this.getqueryAvailableEnterpriseLicense()
        } else {
          this.loadings = false
          this.$message.warning(res.msg)
        }
      })
    },
    // 获取迁移密码
    getcreateOrQueryMigrateCode (res) {
      const data = {
        enterpriseUuid: this.enterpriseUuid,
        userUuid: res.userUuid
      }
      createOrQueryMigrateCode(data).then(res => {
        this.$success({
          title: '用户迁移码',
          okText: '确定',
          width: '500px',
          content: (
            <div>
              <p style='font-size:1.5em;color:#DE503E;margin-bottom: 10px;'>{res.data}</p>
              <p style='margin-bottom: 0;'>通过迁移码，能够迁移个人版用户下的应用到企业中。详细使用参考文档：<a target="_blank" style="color:#2488e5" href="https://www.yuque.com/shibu/winrobot/gggqcw">个人应用迁移企业</a></p>
            </div>
          )
        })
      })
    },
    // 重置密码
    confirm (res) {
      this.pass_form.userUuid = res.userUuid
      this.custom_password = true
    },
    click_password () {
      const data = {
        enterpriseUuid: this.enterpriseUuid,
        userUuid: this.pass_form.userUuid,
        passwordType: this.pass_form.passwordType,
        customPassword: this.pass_form.customPassword
      }
      resetUserPassword(data).then(res => {
        if (res.code === 200) {
          this.$message.success(res.data.remindMessage)
          this.custom_password = false
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 删除用户
    getdelete (res) {
      this.receiveUserUuid = res.userUuid
      const that = this
      this.$confirm({
        title: '提示',
        content: '确认要删除用户' + res.name,
        okText: '确认',
        cancelText: '取消',
        onOk () {
          if (res.accountType === 'basic') {
              that.modelDelete()
            } else {
              that.delDelete = true
            }
          }
      })
    },
    // 删除用户确定
    modelDelete () {
      const data = {
        enterpriseUuid: this.enterpriseUuid,
        userUuid: this.receiveUserUuid,
        receiveUserUuid: this.userName
      }
      deleteUser(data).then(res => {
        if (res.code === 200) {
          this.delDelete = false
          this.visible = false
          this.$message.success('账号删除成功')
          this.accountUsery(this.postData)
          this.getqueryAvailableEnterpriseLicense()
          this.getMyActivity()
        } else {
          this.delDelete = false
          this.$message.warning(res.msg)
        }
      })
    },
    // 取消删除
    CancelmodelDelete () {
      this.delDelete = false
    },
    // 222
    onSearch (val) {
      const data = {
        enterpriseUuid: this.enterpriseUuid,
        key: val
      }
      userList(data).then(res => {
        this.dataSource = res.data
      })
    },
    onSelect (val) {
      this.userName = val
    }
  }
}
</script>
<style lang="less" scoped>
.account{
  background: #fff;
  min-height: calc(100vh - 98px);
  .account_title{
    min-height: 70px;
    position: relative;
    padding: 0 24px;
    &:before{
      content: "";
      width:4px;
      height:16px;
      background:rgba(255,82,91,1);
      float: left;
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -7px;
    }
    .account_user{
      line-height: 70px;
      font-size:14px;
      font-family:Microsoft YaHei;
      font-weight:400;
      color:rgba(140,140,140,1);
      margin: 0 30px 0 0;
      i{
        color: #A6A6A6;
        font-size: 16px;
        margin-right: 8px;
      }
      em{
        color: #595959;
        font-style: normal;
      }
    }
    .acconut_right{
      cursor: pointer;
      width:116px;
      height:32px;
      background:rgba(255,255,255,1);
      border:1px solid rgba(217,217,217,1);
      border-radius:3px;
      font-size:14px;
      font-family:Microsoft YaHei;
      font-weight:400;
      color:rgba(89,89,89,1);
      float: right;
      line-height: 32px;
      text-align: center;
      margin-top: 21px;
    }
    .acconut_rightuser{
      cursor: pointer;
      float: right;
      margin-top: 21px;
      width:109px;
      height:32px;
      background:rgba(255,82,91,1);
      border-radius:3px;
      font-size:14px;
      font-family:Microsoft YaHei;
      font-weight:400;
      color:rgba(255,255,255,1);
      line-height:34px;
      text-align: center;
      margin-right: 6px;
      i{
        color: #fff;
        font-weight: bold;
        font-size: 16px;
      }
    }
  }
}
.ant-dropdown-menu-item:hover{
  background: #e6f7ff !important;
}
.accountBottom{
  position: absolute;
  bottom: 0;
  background: #fff;
  box-shadow: -1px -6px 15px 0px rgba(0, 0, 0, 0.06);
  height: 50px;
  width: 100%;
  margin-left: -24px;
  padding: 0 22px;
  border-radius: 0 0 0 10px;
  p{
    float: left;
    line-height: 50px;
    color: #595959;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    span{
      color: #2587E5;
      margin: 0 4px
    }
  }
  button{
    text-align: right;
    float: right;
    margin-top: 10px;
    margin-left: 8px;
  }
}
.porary{
  display: inline-block;
  font-style: normal;
  width: 38px;
  height: 18px;
  border-radius: 2px;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 18px;
  text-align: center;
  background: #F99D3B;
}
.tasktopend{
  display: inline-block;
  font-style: normal;
  width: 50px;
  height: 18px;
  border-radius: 8px;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 16px;
  text-align: center;
  background: #B1B8BC;
}
.radioGroup{
  img{
    display: block;
    margin: 0 auto;
  }
  p{
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #262626;
    line-height: 33px;
    text-align: center;
  }
}
.month{
  p{
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #272727;
    line-height: 34px;
    margin: 0;
  }
  input{
    display: -webkit-inline-box;
    width: 76px;
    border-left: none;
    border-right: none;
    border-radius: 0;
    text-align: center;
    height: 32px;
    vertical-align: top;
  }
  span{
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #8D8D8D;
    line-height: 34px;
    em{
      font-style: normal;
    }
  }
}
.payname{
  font-size: 24px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #272727;
  line-height: 34px;
  margin-bottom: 20px;
  float: left;
  margin-right: 20px;
  text-decoration: line-through;
}
.paynameenquiry{
  font-size: 24px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #272727;
  line-height: 34px;
  margin-bottom: 20px;
  color: #FF525B;
  span{
    color: #FF525B;
    font-weight: bold;
  }
}
.oscheckbox{
  margin-left: 20px;
  color: #8D8D8D;
}
/deep/ .ant-result-title{
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #272727;
  line-height: 34px;
}
/deep/ .ant-result-icon {
  i{
    font-size: 50px;
  }
}
/deep/ .ant-result{
  padding-top: 10px;
}
/deep/ .ant-tag{
  padding: 0 2px;
  line-height: 16px;
}
/deep/ .ant-table-selection-column{
  padding: 16px 4px;
  width: 30px;
}
.ant-alert-warning{
  margin: -24px;
  margin-bottom: 10px;
}
.passwordType{
  .ant-row{
    margin-bottom: 0;
  }
}
.loginaccountname{
  transition: all 0.3s;
  i{
    display: none;
    margin-left: 6px;
    margin-top: 2px;
    cursor: pointer;
  }
  &:hover{
    i{
      display: inline-block;
    }
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
// /deep/ .ant-table-thead > tr > th .ant-table-filter-icon{
//   color: #2587E5 !important;
//   right: unset;
// }
</style>
