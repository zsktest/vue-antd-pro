<template>
  <div>
    <a-row :gutter="24">
      <a-col :sm="24" :md="24" :xl="24">
        <!-- <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :loading="loading" :bordered="false" title="开发者统计" :style="{ height: '100%' }">
          <div>asd</div>
        </a-card> -->
        <div class="account right_content">
          <div class="account_title">
            <h1>订单管理</h1>
            <span class="account_user"><a-icon type="profile" />{{ listpage.total }}</span>
            <div class="acconut_rightuser" @click="inputInvoice">完善发票信息</div>
          </div>
          <div class="application_sear">
            <a-table
              :row-key="record => record.uuid"
              :columns="columns"
              :data-source="listData"
              :pagination="pagination"
              :loading="loading"
              @change="handleTableChange"
            >
              <template slot="state" slot-scope="text">
                <span>
                  <a-badge :color="text.state | statusTypeFilter" :text="text.state | statusFilter" />
                </span>
              </template>
              <template slot="action" slot-scope="text, record">
                <span>
                  <a @click="continuePay(record)" v-if="record.orderStatus === 'waitPay'">去支付</a>
                  <!-- <a-divider type="vertical" /> -->
                  <a href="javascript:;" @click="invoiceOrder(record)" v-if="record.orderStatus === 'finish'">申请发票</a>
                  <!-- <a-dropdown>
                    <a class="ant-dropdown-link">
                      更多 <a-icon type="caret-down" />
                    </a>
                    <a-menu slot="overlay">
                      <a-menu-item v-if="record.orderStatus === 'finish'">
                        <a href="javascript:;">申请发票</a>
                      </a-menu-item>
                      <a-menu-item>
                        <a-popconfirm placement="top" ok-text="确定" cancel-text="取消">
                          <template slot="title">
                            <p>提示</p>
                            <p>确认要关闭该订单么'{{ record.businessRemark }}'?</p>
                          </template>
                          <a href="javascript:;">关闭</a>
                        </a-popconfirm>
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown> -->
                </span>
              </template>
            </a-table>
          </div>
        </div>
      </a-col>
    </a-row>
    <!-- 购买 -->
    <a-modal v-model="pay" @cancel="payquxiao" :footer="null" :maskClosable="false" title="支付订单">
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
            <a-button type="primary" @click="continuePayhov">继续支付</a-button>
          </template>
        </a-result>
      </div>
    </a-modal>
    <!-- 填写发票内容 -->
    <a-modal v-model="paynms" title="完善发票信息">
      <a-alert message="请在申请发票前先完善发票信息" banner style="margin: -24px -24px 0 -24px;"/>
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        style="margin-top:8px;"
      >
        <a-form-model-item label="账号类型">
          <a-radio-group v-model="form.invoiceType">
            <a-radio value="common">增值税普通发票</a-radio>
            <a-radio value="VAT">增值税专用发票</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="invoiceTitle" label="发票抬头" prop="invoiceTitle">
          <a-input v-model="form.invoiceTitle" placeholder="请输入发票抬头"/>
        </a-form-model-item>
        <a-form-model-item ref="identifyNumber" label="纳税人识别号" prop="identifyNumber">
          <a-input v-model="form.identifyNumber" placeholder="请输入纳税人识别号"/>
          <p style="font-size: 12px;margin: 0;color:#8C8C8C;line-height: 20px;">请仔细核实填写，否则影响后续发票的使用</p>
        </a-form-model-item>
        <a-form-model-item ref="bankName" label="开户银行名称">
          <a-input v-model="form.bankName" placeholder="请输入开户行名称"/>
        </a-form-model-item>
        <a-form-model-item ref="bankAccountNumber" label="基本开户账号">
          <a-input v-model="form.bankAccountNumber" placeholder="请输入开户账号"/>
        </a-form-model-item>
        <a-form-model-item ref="registerAddress" label="注册场所地址">
          <a-input v-model="form.registerAddress" placeholder="请输入注册场地地址"/>
        </a-form-model-item>
        <a-form-model-item ref="registerPhone" label="注册号码">
          <a-input v-model="form.registerPhone" placeholder="请输入注册号码"/>
        </a-form-model-item>
        <a-divider orientation="left" :dashed="true">发票寄送信息</a-divider>
        <div v-show="form.invoiceType === 'common'">
          <a-form-model-item ref="receiveEmail" label="邮箱">
            <a-input v-model="form.receiveEmail" placeholder="请输入邮箱地址"/>
          </a-form-model-item>
        </div>
        <div v-show="form.invoiceType === 'VAT'">
          <a-form-model-item ref="contactName" label="收件人">
            <a-input v-model="form.contactName" placeholder="请输入收件人"/>
          </a-form-model-item>
          <a-form-model-item ref="receiveAddress" label="收件地址">
            <a-input v-model="form.receiveAddress" placeholder="请输入收件地址"/>
          </a-form-model-item>
          <a-form-model-item ref="contactPhone" label="联系电话">
            <a-input v-model="form.contactPhone" placeholder="请输入联系电话"/>
          </a-form-model-item>
        </div>
      </a-form-model>
      <template slot="footer">
        <div>
          <a-button type="primary" :loading="loadings" @click="handleOk">完成</a-button>
        </div>
      </template>
    </a-modal>
    <!-- 购买 -->
    <a-modal v-model="payname" title="确认发票信息">
      <a-form-model
        ref="ruleForm"
        :label-col="labelCol"
        :model="form"
        :wrapper-col="wrapperCol"
        class="modelname"
      >
        <a-form-model-item label="发票类型">
          <span v-show="form.invoiceType === 'common'">增值税普通发票</span>
          <span v-show="form.invoiceType === 'VAT'">增值税专用发票</span>
        </a-form-model-item>
        <a-form-model-item label="发票抬头">
          <span>{{ form.invoiceTitle }}</span>
        </a-form-model-item>
        <a-form-model-item label="税务登记证号">
          <span>{{ form.identifyNumber }}</span>
        </a-form-model-item>
        <a-form-model-item label="开户银行名称">
          <span>{{ form.bankName }}</span>
        </a-form-model-item>
        <a-form-model-item label="基本开户账号">
          <span>{{ form.bankAccountNumber }}</span>
        </a-form-model-item>
        <a-form-model-item label="注册场所地址">
          <span>{{ form.registerAddress }}</span>
        </a-form-model-item>
        <a-form-model-item label="注册号码">
          <span>{{ form.registerPhone }}</span>
        </a-form-model-item>
        <a-divider orientation="left" :dashed="true">发票寄送信息</a-divider>
        <div v-show="form.invoiceType === 'common'">
          <a-form-model-item ref="receiveEmail" label="邮箱">
            <span>{{ form.receiveEmail }}</span>
          </a-form-model-item>
        </div>
        <div v-show="form.invoiceType === 'VAT'">
          <a-form-model-item ref="contactName" label="收件人">
            <span>{{ form.contactName }}</span>
          </a-form-model-item>
          <a-form-model-item ref="receiveAddress" label="收件地址">
            <span>{{ form.receiveAddress }}</span>
          </a-form-model-item>
          <a-form-model-item ref="contactPhone" label="联系电话">
            <span>{{ form.contactPhone }}</span>
          </a-form-model-item>
        </div>
      </a-form-model>
      <template slot="footer">
        <div>
          <a-button @click="modifyInput">修改</a-button>
          <a-button @click="modifyInvoice" type="primary">确认并开票</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { orderList, applyInvoice, queryInvoiceConfig, updateInvoiceConfig, tradePay, queryOrderPayoff } from '@/api/user'
// 表格项
const columns = [
  {
    title: '订单编号',
    dataIndex: 'orderNo'
    // scopedSlots: { customRender: 'action' }
  },
  {
    title: '描述',
    dataIndex: 'businessRemark'
  },
  {
    title: '金额',
    dataIndex: 'receiptAmountValue'
  },
  {
    title: '日期',
    dataIndex: 'updateTime'
  },
  {
    title: '状态',
    dataIndex: 'orderStatusName'
    // scopedSlots: { customRender: 'state' }
  },
  {
    title: '操作',
    dataIndex: 'prodSpecName',
    width: '14%',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  data () {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
      loading: false,
      pagination: {
        showQuickJumper: true
      },
      listData: [],
      listpage: '',
      columns,
      loadings: false,
      postData: {
        enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
        page: 1,
        size: 10
      },
      form: {
        invoiceType: 'common', // 发票类型
        invoiceTitle: '', // 发票抬头
        identifyNumber: '', // 纳税人识别号
        bankName: '', // 开户银行名称
        bankAccountNumber: '', // 基本开户账号
        registerAddress: '', // 注册场所地址
        registerPhone: '', // 注册号码
        receiveEmail: '', // 接受邮箱
        contactName: '', // 收件人姓名
        receiveAddress: '', // 发票邮寄地址
        contactPhone: '' // 联系电话
      },
      rules: { // 判断
        invoiceTitle: [
          { required: true, message: '发票抬头不能为空', trigger: 'blur' }
        ],
        identifyNumber: [
          { required: true, message: '纳税人识别号不能为空', trigger: 'blur' }
        ]
      },
      pay: false,
      paynms: false,
      payname: false,
      nofillend: false,
      invoiceOrdername: '',
      userOrderUuid: '',
      userpay: true,
      userpayname: true,
      paySuccess: false,
      payError: false,
      listuserOrderUuid: ''
    }
  },
  mounted () {
    this.accountUsery(this.postData)
  },
  methods: {
    // 获取列表
    accountUsery (data) {
      this.loading = true
      orderList(data).then(res => {
        if (res.code === 200) {
          const pagination = { ...this.pagination }
          pagination.total = res.page.total
          pagination.current = res.page.page
          this.loading = false
          this.listData = res.data
          this.listpage = res.page
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
      queryInvoiceConfig(data).then(res => {
        if (res.code === 200) {
          if (res.data === undefined || res.data === null || res.data === '') {
            this.nofillend = true
          } else {
            this.nofillend = false
            this.form = {
              invoiceType: res.data.invoiceType, // 发票类型
              invoiceTitle: res.data.invoiceTitle || '', // 发票抬头
              identifyNumber: res.data.identifyNumber, // 纳税人识别号
              bankName: res.data.bankName, // 开户银行名称
              bankAccountNumber: res.data.bankAccountNumber, // 基本开户账号
              registerAddress: res.data.registerAddress, // 注册场所地址
              registerPhone: res.data.registerPhone, // 注册号码
              receiveEmail: res.data.receiveEmail, // 接受邮箱
              contactName: res.data.contactName, // 收件人姓名
              receiveAddress: res.data.receiveAddress, // 发票邮寄地址
              contactPhone: res.data.contactPhone // 联系电话
            }
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
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.postData.page = pager.current
      this.accountUsery(this.postData)
    },
    // 弹窗发票填写
    inputInvoice () {
      this.paynms = true
    },
    // 取消购买附加账号
    payquxiao () {
      this.pay = false
      this.accountUsery(this.postData)
    },
    // 确定提交
    handleOk () {
      this.loadings = true
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const data = this.enterpriseUuid
          updateInvoiceConfig(data, this.form).then(res => {
            if (res.code === 200) {
              this.paynms = false
              this.$message.success('发票信息填写成功')
              this.loadings = false
            } else {
              this.loadings = false
              this.$message.warning(res.msg)
            }
          })
        } else {
          this.loadings = false
          return false
        }
      })
    },
    // 点击继续支付
    continuePay (index) {
      const data = {
        enterpriseUuid: this.enterpriseUuid,
        userOrderUuid: index.userOrderUuid
      }
      tradePay(data).then(res => {
        if (res.code === 200) {
          this.pay = true
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
    continuePayhov () {
      const data = {
        enterpriseUuid: this.enterpriseUuid,
        userOrderUuid: this.userOrderUuid.userOrderUuid
      }
      tradePay(data).then(res => {
        if (res.code === 200) {
          this.pay = true
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
    // 点击申请发票
    invoiceOrder (index) {
      if (this.nofillend === false) {
        this.payname = true
      } else {
        this.paynms = true
      }
      this.invoiceOrdername = index
    },
    // 修改发票信息
    modifyInput () {
      this.payname = false
      this.paynms = true
    },
    // 确定申请发票
    modifyInvoice () {
      const data = {
        enterpriseUuid: this.enterpriseUuid,
        userOrderUuid: this.invoiceOrdername.userOrderUuid
      }
      applyInvoice(data).then(res => {
        if (res.code === 200) {
          this.payname = false
          this.$message.success('发票申请成功')
        } else {
          this.payname = false
          this.$message.warning(res.msg)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-form-item{
  margin-bottom: 14px;
}
.modelname{
  padding: 10px 0;
  /deep/ .ant-form-item{
    margin-bottom: 8px;
  }
  margin-top:8px;
  background: #F9F9F9;
  /deep/ label{
      color: #8B8B8B;
    }
  /deep/ .ant-form-item-children{
    span{
      color: #595959;
    }
  }
}
</style>
