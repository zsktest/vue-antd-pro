<template>
  <div>
    <a-row :gutter="24">
      <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '24px' }">
        <!-- <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :loading="loading" :bordered="false" title="开发者统计" :style="{ height: '100%' }">
          <div>asd</div>
        </a-card> -->
        <div class="account">
          <div class="account_title">
            <h1>许可证列表</h1>
            <!-- <a-tooltip placement="top">
              <template slot="title">
                <span>1</span>
              </template>
              <span class="account_user"><a-icon type="profile" />{{ pagination.pagination }}</span>
            </a-tooltip> -->
            <span class="account_user"><a-icon type="profile" />{{ pagination.total }}</span>
            <div class="acconut_right" @click="pulicence">导入订单激活码</div>
            <!-- <div class="acconut_right" @click="actlicence">激活许可证</div> -->
            <div class="acconut_rightuser" @click="paylicence">创建许可证订单</div>
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
              <template slot="actions" slot-scope="text, record">
                <p style="margin: 0;" v-show="record.licenseSource === 'extra'">附加</p>
                <p style="margin: 0;" v-show="record.licenseSource === 'base'">套餐</p>
              </template>
              <template slot="actionbad" slot-scope="text, record">
                <span><a-badge v-if="record.grantStatus === 'authorized'" status="success" /><a-badge v-if="record.grantStatus === 'unauthorized'" status="processing" />{{ record.grantStatusName }}</span>
              </template>
              <template slot="action" slot-scope="text, record">
                <span>
                  <a v-if="record.grantStatus === 'authorized'" @click="handleReadsee(record)">查看</a>
                  <a v-if="record.grantStatus === 'unauthorized'" @click="handleRead(record)">激活</a>
                  <!-- <a-divider type="vertical" /> -->
                  <a-popconfirm placement="top" ok-text="确定" cancel-text="取消" @confirm="getdelete(record)">
                    <template slot="title">
                      <p>提示</p>
                      <p>确认要删除当前套餐?</p>
                    </template>
                    <a href="javascript:;" v-if="record.grantStatus === 'unauthorized'" class="ant-dropdown-link">删除</a>
                  </a-popconfirm>
                  <!-- <a-dropdown>
                    <a class="ant-dropdown-link">
                      更多 <a-icon type="caret-down" />
                    </a>
                    <a-menu slot="overlay">
                      <a-menu-item>
                        <a href="javascript:;">编辑</a>
                      </a-menu-item>
                      <a-menu-item>
                        <a-popconfirm placement="top" ok-text="确定" cancel-text="取消">
                          <template slot="title">
                            <p>提示</p>
                            <p>确认要删除用户''?</p>
                          </template>
                          <a href="javascript:;">删除</a>
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
    <a-modal v-model="pay" :maskClosable="false" :footer="null" @cancel="Clicensecel" :title="titlename">
      <div v-show="licenseone">
        <div class="month">
          <p>账号类型：</p>
          <div style="margin-bottom:10px">
            <a-radio-group v-model="resource">
              <a-radio value="base">
                套餐
              </a-radio>
              <a-radio value="extra">
                附加
              </a-radio>
            </a-radio-group>
          </div>
        </div>
        <div class="month" style="margin-bottom:14px">
          <div>
            <a-form-model
              ref="ruleForm"
              :model="form"
              v-model="form.date1"
              :rules="rules"
            >
              <a-form-model-item label="到期时间" required prop="date1">
                <a-date-picker
                  v-model="form.date1"
                  :disabled-date="disabledDate"/>
              </a-form-model-item>
            </a-form-model>
          </div>
        </div>
        <div class="month">
          <p>许可证数量：</p>
          <div>
            <a-button-group>
              <a-button @click="denumber">
                <a-icon type="minus" />
              </a-button>
              <a-input v-model="number" @change="insnumber"></a-input>
              <a-button @click="innumber">
                <a-icon type="plus" />
              </a-button>
            </a-button-group>
          </div>
        </div>
      </div>
      <div class="information" v-show="licensetow">
        <p>确认订单信息</p>
        <div class="informationcoms">
          <div>
            <span>账号类型</span>
            <p v-show="resource === 'extra'">附加</p>
            <p v-show="resource === 'base'">套餐</p>
          </div>
          <div>
            <span>采购企业</span>
            <p>{{ licensetowname.enterpriseName }}</p>
          </div>
          <div>
            <span>许可证数量</span>
            <p>{{ licensetowname.licenseQuota }}</p>
          </div>
          <div>
            <span>到期时间</span>
            <p>{{ licensetowname.licenseExpiredDate }}</p>
          </div>
        </div>
      </div>
      <div>
        <div class="return_license" v-show="licenseree">
          <div class="return_licensetop">订单信息</div>
          <div class="return_licensetestarea">
            <a-textarea placeholder="许可证" disabled :rows="5" :value="licensereename.grantRequest"/>
            <div @click="doCopy"><a-icon type="copy"/>复制</div>
          </div>
          <p>如需获订单激活码，请将订单信息提交给影刀</p>
        </div>
        <div class="return_license" v-show="licensefou">
          <div class="return_licensetop">订单激活码</div>
          <div :class="licenssCop ? 'return_licensetestarea':''">
            <a-textarea
              placeholder="订单激活码"
              :disabled="licenssCop"
              v-model="imports"
              :auto-size="{ minRows: 5, maxRows: 5 }"
              :rows="5"
              style="word-break:break-all;" />
            <div @click="doCopyname" v-show="licenssCop"><a-icon type="copy"/>复制</div>
          </div>
        </div>
      </div>
      <div v-show="licenssucc">
        <a-result status="success" sub-title="您已成功激活以下产品" title="激活成功">
          <div class="informationcoms">
            <div>
              <span>产品类型</span>
              <p style="margin:0;" v-show="licenssuccname.licenseSource === 'extra'">附加</p>
              <p style="margin:0;" v-show="licenssuccname.licenseSource === 'base'">套餐</p>
            </div>
            <div>
              <span>采购企业</span>
              <p>{{ licenssuccname.enterpriseName }}</p>
            </div>
            <div>
              <span>账号数量</span>
              <p>{{ licenssuccname.licenseQuota }}</p>
            </div>
            <div>
              <span>到期时间</span>
              <p>{{ licenssuccname.licenseExpiredTime }}</p>
            </div>
          </div>
          <template #extra>
            <a-button type="primary" @click="Clicensecel">完成</a-button>
          </template>
        </a-result>
      </div>
      <div class="primary">
        <div v-show="licenseone">
          <a-button type="primary" @click="Clilicense">下一步</a-button>
        </div>
        <div v-show="licensetow">
          <a-button type="primary" @click="Clicensetow">提交</a-button>
          <a-button style="margin-left:8px" @click="Clicensetows">上一步</a-button>
        </div>
        <div v-show="licenseree || licensefou">
          <a-button type="primary" @click="Clicensefou">激活</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
import { grantList, grantEvaluate, grantCreate, grantDetail, grantDelete, grantImport } from '@/api/user'
// 表格项
const columns = [
  {
    title: '订单描述',
    dataIndex: 'licenseSourceName'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime'
  },
  {
    title: '到期时间',
    dataIndex: 'licenseExpiredTime'
  },
  {
    title: '账号类型',
    dataIndex: '',
    scopedSlots: { customRender: 'actions' }
  },
  {
    title: '状态',
    dataIndex: 'grantStatusName',
    scopedSlots: { customRender: 'actionbad' }
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
      moment,
      enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
      loading: false,
      pagination: {
        showQuickJumper: true
      },
      resource: 'base',
      listData: [],
      licensetowname: '',
      licensereename: '',
      columns,
      form: {
        date1: undefined
      },
      rules: {
        date1: [{ required: true, message: '请选择日期', trigger: 'change' }]
      },
      postData: {
        enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
        page: 1,
        size: 10
      },
      pay: false,
      number: 1,
      imports: '',
      titlename: '购买附加账号',
      licenseone: true,
      licensetow: false,
      licenseree: false,
      licensefou: false,
      licenssucc: false,
      licenssCop: false,
      licenssuccname: ''
    }
  },
  mounted () {
    this.accountUsery(this.postData)
  },
  methods: {
    // 获取列表
    accountUsery (data) {
      this.loading = true
      grantList(data).then(res => {
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
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.postData.page = pager.current
      this.accountUsery(this.postData)
    },
    // // 选择时间
    // onChange (date, dateString) {
    //   console.log(dateString)
    //   this.form.data1 = dateString
    // },
    // 不可选择的时间
    disabledDate (current) {
      // Can not select days before today and today
      return current && current < moment().startOf('day')
    },
    // 加减数量
    denumber () {
      let number = this.number - 1
      if (number <= 1) {
        number = 1
      }
      this.number = number
    },
    innumber () {
      this.number++
      if (this.number >= 99) {
        this.number = 99
      }
    },
    insnumber () {
      if (this.number >= 99) {
        this.number = 99
      }
    },
    // 购买账号许可证
    paylicence () {
      this.titlename = '创建许可证订单'
      this.pay = true
      this.form.date1 = undefined
      this.number = 1
      this.licenseone = true
      this.licensetow = false
      this.licenseree = false
      this.licensefou = false
      this.licenssucc = false
      this.licenssCop = false
    },
    // 激活许可证
    actlicence () {
      this.titlename = '激活许可证订单'
      this.pay = true
      this.licensefou = true
      this.licenseone = false
      this.licenssucc = false
    },
    // 更新企业许可证
    pulicence () {
      this.titlename = '激活许可证订单'
      this.pay = true
      this.imports = ''
      this.licensefou = true
      this.licenseree = false
      this.licenseone = false
      this.licenssucc = false
      this.licenssCop = false
    },
    // 点击跳转下一步
    Clilicense () {
      console.log(this.form)
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const data = this.enterpriseUuid
          const form = {
            'licenseExpiredDate': moment(this.form.date1).format('YYYY-MM-DD'),
            'licenseQuota': this.number,
            'licenseSource': this.resource
          }
          grantEvaluate(data, form).then(res => {
            if (res.code === 200) {
              this.licensetowname = res.data
              this.licenseone = false
              this.licensetow = true
            } else {
              this.$message.warning(res.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    // 信息确认订单上一步
    Clicensetows () {
      this.licenseone = true
      this.licensetow = false
    },
    // 提交订单
    Clicensetow () {
      this.titlename = '激活许可证订单'
      const data = this.enterpriseUuid
      const form = {
        'licenseExpiredDate': moment(this.form.date1).format('YYYY-MM-DD'),
        'licenseQuota': this.number,
        'licenseSource': this.resource
      }
      grantCreate(data, form).then(res => {
        if (res.code === 200) {
          this.licensereename = res.data
          this.imports = ''
          this.licensetow = false
          this.licenseree = true
          this.licensefou = true
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 复制
    doCopy () {
      // get current settings from mixin or this.$store.state.app, pay attention to the property name
      const text = this.licensereename.grantRequest
      this.$copyText(text).then(message => {
        console.log('copy', message)
        this.$message.success('订单信息已复制到剪切板')
      }).catch(err => {
        console.log('copy.err', err)
        this.$message.error('复制失败')
      })
    },
    doCopyname () {
      const text = this.imports
      this.$copyText(text).then(message => {
        console.log('copy', message)
        this.$message.success('订单激活码复制到剪切板')
      }).catch(err => {
        console.log('copy.err', err)
        this.$message.error('复制失败')
      })
    },
    // 激活
    handleRead (index) {
      this.licenssCop = false
      this.licenssucc = false
      this.imports = ''
      this.titlename = '激活许可证订单'
      const data = {
        enterpriseUuid: this.enterpriseUuid,
        userLicenseGrantUuid: index.uuid
      }
      grantDetail(data).then(res => {
        if (res.code === 200) {
          this.licensereename = res.data
          this.pay = true
          this.licensetow = false
          this.licenseone = false
          this.licenseree = true
          this.licensefou = true
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 查看
    handleReadsee (index) {
      this.licenssucc = false
      this.licenssCop = true
      this.imports = ''
      this.titlename = '激活许可证订单'
      const data = {
        enterpriseUuid: this.enterpriseUuid,
        userLicenseGrantUuid: index.uuid
      }
      grantDetail(data).then(res => {
        if (res.code === 200) {
          this.licensereename = res.data
          this.imports = res.data.grantCipher
          this.pay = true
          this.licensetow = false
          this.licenseone = false
          this.licenseree = true
          this.licensefou = true
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 提交附加验证码
    Clicensefou () {
      const data = {
        enterpriseUuid: this.enterpriseUuid,
        grantCipher: this.imports
      }
      grantImport(data).then(res => {
        if (res.code === 200) {
          this.pay = true
          this.licenssuccname = res.data
          this.licensetow = false
          this.licenseone = false
          this.licenseree = false
          this.licensefou = false
          this.licenssucc = true
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 删除当前订单
    getdelete (index) {
      const data = {
        enterpriseUuid: this.enterpriseUuid,
        userLicenseGrantUuid: index.uuid
      }
      grantDelete(data).then(res => {
        if (res.code === 200) {
          this.accountUsery(this.postData)
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 取消订单
    Clicensecel () {
      this.accountUsery(this.postData)
      this.pay = false
    }
  }
}
</script>
<style lang="less" scoped>
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
.primary{
  margin-top: 48px;
  margin-bottom: 10px;
}
.information{
  p{
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #272727;
  }
}
.informationcoms{
  background: #FAFAFA;
  padding: 24px;
  div{
    width: 50%;
    display: inline-block;
    span{
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #8D8D8D;
      line-height: 34px;
    }
    p{
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #5A5A5A;
    }
  }
}
.return_licensetop{
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #272727;
  line-height: 34px;
  margin-bottom: 10px;
  i{
    margin-left: 8px;
    color: #818282;
  }
}
.return_license{
  .return_licensetestarea{
    position: relative;
    textarea{
      color: #5A5A5A;
      word-break:break-all;
      background: #fafafa;
      font-size: 12px;
      line-height: 24px;
    }
    div{
      position: absolute;
      right: 0;
      bottom: 0;
      width: 59px;
      height: 24px;
      line-height: 22px;
      background: #FFFFFF;
      border: 1px solid #D9D9D9;
      border-radius: 3px 0px 3px 0px;
      text-align: center;
      cursor: pointer;
      font-size: 12px;
      color: #5A5A5A;
      i{
        margin-right: 4px;
        color: rgba(141, 141, 141, 1);
      }
    }
  }
  p{
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #8D8D8D;
    line-height: 34px;
  }
}
/deep/ .ant-result-icon {
  i{
    font-size: 50px;
  }
}
/deep/ .ant-result{
  padding: 0;
}
/deep/ .ant-result-content{
  padding: 0;
}
/deep/ .ant-form-item-required{
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #272727;
  line-height: 34px;
  margin: 0;
}
</style>
