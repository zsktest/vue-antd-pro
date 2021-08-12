<template>
  <div class="page-header-index-wide">
    <a-card :bordered="false" :bodyStyle="{ padding: '16px 0', height: '100%' }" :style="{ height: '100%' }">
      <div class="account-settings-info-main" :class="{ 'mobile': isMobile }">
        <div class="account-settings-info-right">
          <div class="account-settings-info-title">
            <span>{{ $route.meta.title }}</span>
          </div>
          <div>
            <a-list
              itemLayout="horizontal"
            >
              <a-list-item >
                <a-list-item-meta>
                  <p slot="title">登录用户名: {{ user_name }}
                    <template>
                      <a @click="showModal()">修改密码</a>
                    </template>
                  </p>
                  <!-- <span slot="description">
                    <span class="security-list-description">{{ scurity.createTime }}</span>
                    <span v-if="scurity.ownerName"> : </span>
                    <span class="security-list-value">{{ scurity.updateTime }}</span>
                  </span> -->
                </a-list-item-meta>
              </a-list-item>
              <a-list-item >
                <a-list-item-meta>
                  <p slot="title" v-show="!getcreateUsername">企业名称: {{ scurity.name }} <span class="scurityName" v-if="enterpriseType === 'private'" @click="scurityname">修改</span></p>
                  <p slot="title" v-show="getcreateUsername">企业名称: <a-input placeholder="请输入企业名称" style="width:200px" v-model="scurity.name"/> <span class="scurityName" @click="getenterpriseUpdate">确定</span></p>
                  <p slot="title" class="descriptionstitle"><span>版本信息:</span>
                    <a-descriptions layout="vertical" bordered>
                      <a-descriptions-item label="版本类型">
                        企业版
                      </a-descriptions-item>
                      <a-descriptions-item label="高级账号">
                        {{ scurity.userQuota }}个<a class="acconut_right" @click="info">开通更多</a>
                      </a-descriptions-item>
                      <a-descriptions-item label="附加账号" v-if="enterpriseType != 'private' && scurity.enableExtraAccount">
                        {{ scurity.extraUserQuota }}个<a class="acconut_right" @click="infos">临时开通</a>
                      </a-descriptions-item>
                    </a-descriptions>
                  </p>
                  <p slot="title">联系邮箱: {{ scurity.contactEmail }}
                    <template v-if="enterpriseRoleCode === 'e_owner'">
                      <a @click="showmail()">修改</a>
                    </template>
                  </p>
                  <div slot="title" style="margin-bottom:14px"><span style="padding-right:14px">联系人:</span> <span style="padding-right:4px">{{ scurity.contactMan }}</span>
                    <template v-if="enterpriseRoleCode === 'e_owner'">
                      <a @click="showtacts()">修改</a>
                    </template>
                  </div>
                  <p slot="title">联系电话: {{ scurity.contactPhone }}
                    <template v-if="enterpriseRoleCode === 'e_owner'">
                      <a @click="showphone()">修改</a>
                    </template>
                  </p>
                  <p slot="title">到期时间: {{ scurity.expiredTime }}</p>
                  <div slot="title" v-if="betaTags">
                    <span>基础账号免审批：</span><a-switch size="small" @change="onChange" v-model="defaults" />
                  </div>
                  <div slot="title" class="enableDefaultMarket">
                    <span>企业默认市场：</span><a-switch size="small" @change="onChangeMarket" v-model="enableDefaultMarket" />
                  </div>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item v-if="enterpriseType === 'private'">
                <a-list-item-meta>
                  <p slot="title" class="security_bottom">到期时间: <br><span>重建索引会重新计算今天以前系统的统计数据，如应用、用户的使用时长，使用次数等。
                    <a-popconfirm
                      title="确定要重建此任务么?"
                      ok-text="确定"
                      cancel-text="取消"
                      @confirm="confirm">
                      <a href="#">重建</a>
                    </a-popconfirm>
                  </span></p>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </div>
        </div>
      </div>
    </a-card>
    <!-- 修改密码 -->
    <a-modal v-model="visible" title="修改密码" on-ok="handleOk">
      <a-form-model
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item ref="pass" label="设置新密码" prop="pass">
          <a-input-password v-model="ruleForm.pass" placeholder="请输入新密码"/>
        </a-form-model-item>
        <a-form-model-item ref="checkPass" label="重复新密码" prop="checkPass">
          <a-input-password v-model="ruleForm.checkPass" placeholder="请再次输入新密码"/>
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button @click="handleCancel('ruleForm')">
          取消
        </a-button>
        <a-button type="primary" :loading="loadings" @click="handleOk('ruleForm')">
          确定
        </a-button>
      </template>
    </a-modal>
    <!-- 修改邮箱 -->
    <a-modal v-model="difymail" :footer="null" title="修改邮箱">
      <a-form :form="difymailform" @submit="handleSubmit">
        <a-form-item>
          <a-input
            style="width: 60%"
            placeholder="请输入新邮箱"
            v-decorator="['mail',
                          { rules: [
                            { required: true, message: '邮箱不能为空！' },
                            { type: 'email', message: '请输入正确的邮箱地址！'}
                          ] }
            ]"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">
            修改
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 修改联系人 -->
    <a-modal v-model="difyacts" :footer="null" title="修改联系人" on-ok="handleOk">
      <a-form :form="difyactsform" @submit="difyactsSubmit">
        <a-form-item>
          <a-input
            style="width: 60%"
            placeholder="请输入新联系人"
            v-decorator="['name',
                          { rules: [
                            { required: true, message: '联系人不能为空！' },
                            { whitespace: true, message: '联系人不能为空！' }
                          ] }
            ]"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">
            修改
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 修改联系电话 -->
    <a-modal v-model="difyiphone" :footer="null" title="修改联系电话" on-ok="handleOk">
      <a-form-model
        ref="ruleForm"
        :model="difyiphoneform"
        :rules="iphone_rules"
      >
        <a-form-model-item ref="iphone" prop="iphone">
          <a-input style="width: 60%" v-model="difyiphoneform.iphone" placeholder="请输入新手机号"/>
        </a-form-model-item>
        <a-form-model-item ref="code" prop="code">
          <a-input v-model="difyiphoneform.code" :maxLength="6" style="width: 30%;margin-right:10px;" placeholder="6位短信验证码"/>
          <a-button style="width:28%" :disabled="totalTime <60" @click="code_iphone">{{ content }}</a-button>
        </a-form-model-item>
        <a-button type="primary" @click="iphoneOk">修改</a-button>
      </a-form-model>
    </a-modal>
    <!-- 购买 -->
    <a-modal v-model="pay" @cancel="payquxiao" :footer="null" :maskClosable="false" title="购买附加账号">
      <div v-show="userpay === true">
        <p>企业内高级账号不足，可以购买附加账号来补充</p>
        <!-- <p>企业内套餐账号不足，可以购买附加账号来补充<a href="" target="_blank" style="color:#2587E5">了解更多</a></p> -->
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
          <span>到期时间 {{ enquiryUserLicenses.licenseEndTime }}</span>
        </div>
        <div class="month">
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
        </div>
        <a-button type="primary" @click="enquiryUserpay">立即支付</a-button>
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
  </div>
</template>

<script>
import { RouteView } from '@/layouts'
import { baseMixin } from '@/store/app-mixin'
import { queryEnterprise, changePwd, tradePay, queryOrderPayoff, orderUserLicenseWithAlipay, enquiryUserLicense, enterpriseUpdate, sendVerifyCode, rebuildindex, disableDefaultMarket, enableDefaultMarket } from '@/api/user'

export default {
  components: {
    RouteView
  },
  mixins: [baseMixin],
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请重新输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两个输入不匹配!'))
      } else {
        callback()
      }
    }
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      visible: false,
      loadings: false,
      getcreateUsername: false,
      ruleForm: {
        pass: '',
        checkPass: ''
      },
      rules: { // 判断
        pass: [{ validator: validatePass, trigger: 'change' }],
        checkPass: [{ validator: validatePass2, trigger: 'change' }]
      },
      enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
      enterpriseType: this.$store.getters.userInfo.enterpriseType || '',
      enterpriseRoleCode: this.$store.getters.userInfo.enterpriseRoleCode || '',
      user_name: this.$store.getters.userInfo.name || '',
      mode: 'inline',
      openKeys: [],
      selectedKeys: [],
      // cropper
      preview: {},
      option: {
        img: '/avatar2.jpg',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1]
      },
      pageTitle: '',
      scurity: [],
      pay: false,
      month: 1,
      number: 1,
      enquiryUserLicenses: '',
      userOrderUuid: '',
      enquiryUser: false,
      userpay: true,
      userpayname: false,
      paySuccess: false,
      payError: false,
      account_user: '',
      difymail: false,
      difymailform: this.$form.createForm(this, { name: 'dynamic_rule' }),
      difyacts: false,
      difyactsform: this.$form.createForm(this, { name: 'dynamic_rule' }),
      difyiphone: false,
      difyiphoneform: {
        iphone: '',
        code: ''
      },
      verifyCodeUuid: '',
      phone_code: false,
      iphone_rules: { // 判断
        code: [
          { required: true, message: '请输入6位验证码', trigger: 'blur' }
        ],
        iphone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ]
      },
      totalTime: 60,
      content: '发送验证码',
      defaults: true,
      betaTags: false,
      enableDefaultMarket: false
    }
  },
  mounted () {
    this.getqueryEnterprise()
  },
  methods: {
    // 是否开启自动审核申请
    onChange (checked) {
      const _this = this
      if (checked) {
        _this.defaults = false
          _this.$confirm({
          title: '提示',
          content: '确认开启基础账号免审批?',
          onOk () {
            const data = {
              basicAccountAutoAuditSwitch: 'on'
            }
            enterpriseUpdate(_this.enterpriseUuid, data).then(res => {
              if (res.code === 200) {
                _this.defaults = true
                _this.getqueryEnterprise()
              }
            })
          },
          onCancel () {
          }
        })
      } else {
        _this.defaults = true
          _this.$confirm({
          title: '提示',
          content: '确认关闭基础账号免审批?',
          onOk () {
            const data = {
              basicAccountAutoAuditSwitch: 'off'
            }
            enterpriseUpdate(_this.enterpriseUuid, data).then(res => {
              if (res.code === 200) {
                _this.defaults = false
                _this.getqueryEnterprise()
              }
            })
          },
          onCancel () {
          }
        })
      }
    },
    // 重构
    confirm () {
      rebuildindex().then(res => {
        if (res.code === 200) {
          this.$message.success('重建成功！')
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 60秒倒计时
    code () {
      const data = {
        enterpriseUuid: this.enterpriseUuid,
        phone: this.difyiphoneform.iphone
      }
      sendVerifyCode(data).then(res => {
        if (res.code === 200) {
          this.verifyCodeUuid = res.data
          const clock = window.setInterval(() => {
            this.content = this.totalTime + 's后重新发送'
            this.totalTime--
            if (this.totalTime < 0) {
                this.totalTime = 60
                this.content = '重新发送验证码'
                window.clearInterval(clock)
            }
          }, 1000)
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 获取验证码
    code_iphone () {
      // eslint-disable-next-line no-unused-vars
      const sphone = this.difyiphoneform.iphone
      if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(sphone))) {
        this.$refs.iphone.onFieldBlur()
        return false
      } else {
        this.code()
        this.phone_code = true
      }
    },
    // 确定手机号修改提交
    iphoneOk () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const data = {
            contactPhone: this.difyiphoneform.iphone,
            verifyCode: this.difyiphoneform.code,
            verifyCodeUuid: this.verifyCodeUuid
          }
          enterpriseUpdate(this.enterpriseUuid, data).then(res => {
            if (res.code === 200) {
              this.$message.success('联系电话修改成功！')
              this.getqueryEnterprise()
              this.difyiphone = false
            } else {
              this.$message.warning(res.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    // 修改联系人
    difyactsSubmit (e) {
      e.preventDefault()
      this.difyactsform.validateFields((err, values) => {
        if (!err) {
          const data = {
            contactMan: values.name
          }
          enterpriseUpdate(this.enterpriseUuid, data).then(res => {
            if (res.code === 200) {
              this.$message.success('联系人修改成功！')
              this.getqueryEnterprise()
              this.difyacts = false
            } else {
              this.$message.warning(res.msg)
            }
          })
        }
      })
    },
    // 修改邮箱
    handleSubmit (e) {
      e.preventDefault()
      this.difymailform.validateFields((err, values) => {
        if (!err) {
          const data = {
            contactEmail: values.mail
          }
          enterpriseUpdate(this.enterpriseUuid, data).then(res => {
            if (res.code === 200) {
              this.$message.success('联系人修改成功！')
              this.getqueryEnterprise()
              this.difymail = false
            } else {
              this.$message.warning(res.msg)
            }
          })
        }
      })
    },
    showmail () {
      this.difymail = true
    },
    showtacts () {
      this.difyacts = true
    },
    showphone () {
      this.difyiphone = true
    },
    info () {
      const h = this.$createElement
      this.$info({
        title: '请联系影刀官方技术支持',
        content: h('div', {}, [
        ]),
        onOk () {}
      })
    },
    infos () {
      this.userpay = true
      this.paySuccess = false
      this.payError = false
      this.userpayname = false
      this.pay = true
      this.visible = false
      this.month = 1
      this.number = 1
      const data = {
        count: this.number,
        duration: this.month,
        enterpriseUuid: this.enterpriseUuid
      }
      this.getenquiryUserLicense(data)
      this.pay = true
    },
    // 修改企业名称
    scurityname () {
      this.getcreateUsername = true
    },
    // 修改企业名称接口
    getenterpriseUpdate () {
      const data = {
        name: this.scurity.name
      }
      enterpriseUpdate(this.enterpriseUuid, data).then(res => {
        if (res.code === 200) {
          this.$message.success('企业名称修改成功')
          this.getcreateUsername = false
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 确定提交
    handleOk (formName) {
      this.loadings = true
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = {
            password: this.ruleForm.pass
          }
          changePwd(data).then(res => {
            if (res.code === 200) {
              this.$message.success('密码修改成功')
              this.loadings = false
              this.visible = false
            } else {
              this.$message.warning(res.msg)
              this.loadings = false
            }
          })
        } else {
          return false
        }
      })
    },
    // 取消创建
    handleCancel (formName) {
      this.visible = false
      this.$refs[formName].resetFields()
    },
    // 修改密码弹窗
    showModal () {
      this.visible = true
    },
    getqueryEnterprise () {
      const data = {
        enterpriseUuid: this.enterpriseUuid
      }
      queryEnterprise(data).then(res => {
        if (res.code === 200) {
          this.scurity = res.data
          this.enableDefaultMarket = res.data.enableDefaultMarket
          if (res.data.betaTags) {
            for (var i in res.data.betaTags) {
              if (res.data.betaTags[i] === 'console') {
                this.betaTags = true
              }
            }
          }
          if (res.data.basicAccountAutoAuditSwitch === 'off') {
            this.defaults = false
          } else {
            this.defaults = true
          }
        }
      })
    },
    // 取消购买附加账号
    payquxiao () {
      this.pay = false
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
     // 点击切换默认市场
    onChangeMarket (checked) {
      const data = {
        enterpriseUuid: this.enterpriseUuid
      }
      const _this = this
      if (checked) {
        _this.enableDefaultMarket = false
          _this.$confirm({
          title: '提示',
          content: '企业默认市场开启后，默认企业内所有员工可见。开启后可随时关闭',
          onOk () {
            enableDefaultMarket(data).then(res => {
              if (res.code === 200) {
                _this.enableDefaultMarket = true
              }
            })
          },
          onCancel () {
          }
        })
      } else {
        _this.enableDefaultMarket = true
          _this.$confirm({
          title: '提示',
          content: '你可随时重新开启企业市场，确认关闭?',
          onOk () {
            disableDefaultMarket(data).then(res => {
              if (res.code === 200) {
                _this.enableDefaultMarket = false
              }
            })
          },
          onCancel () {
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.page-header-index-wide{
    height: calc(100vh - 98px);
  }
  a{
    color: #1890ff !important;
  }
  .account-settings-info-main {
    width: 100%;
    display: flex;
    height: 100%;
    overflow: auto;

    &.mobile {
      display: block;

      .account-settings-info-left {
        border-right: unset;
        border-bottom: 1px solid #e8e8e8;
        width: 100%;
        height: 50px;
        overflow-x: auto;
        overflow-y: scroll;
      }
      .account-settings-info-right {
        padding: 20px 40px;
      }
    }

    .account-settings-info-left {
      border-right: 1px solid #e8e8e8;
      width: 224px;
    }

    .account-settings-info-right {
      flex: 1 1;
      padding: 8px 40px;

      .account-settings-info-title {
        color: rgba(0,0,0,.85);
        font-size: 20px;
        font-weight: 500;
        line-height: 28px;
        margin-bottom: 12px;
      }
      .account-settings-info-view {
        padding-top: 12px;
      }
    }
  }
.account{
  background: #fff;
  .account_title{
    height: 70px;
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
.scurityName{
  margin-left: 6px;
  cursor: pointer;
  color: #1890ff;
}
.descriptionstitle{
  span{
    float: left;
  }
  .ant-descriptions{
    display: inline-block;
    margin-left: 10px;
    text-align: center;
  }
}
.enableDefaultMarket{
  margin-top: 14px;
  &>span{
    padding-right: 15px;
  }
}
/deep/ .ant-descriptions-item-label{
  line-height: 1;
}
/deep/ .ant-descriptions-item-content{
  line-height: 1;
}
.security_bottom{
  span{
    color: rgba(0, 0, 0, 0.45);
    margin-top: 6px;
    display: block;
  }
}
.default_cha{
  span{
    float: left;
    line-height: 24px;
  }
}
</style>
