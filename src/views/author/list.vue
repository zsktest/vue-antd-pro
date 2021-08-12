<template>
  <div>
    <a-row :gutter="24">
      <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '24px' }">
        <!-- <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :loading="loading" :bordered="false" title="开发者统计" :style="{ height: '100%' }">
          <div>asd</div>
        </a-card> -->
        <div class="account">
          <div class="account_title">
            <h1>激活码管理</h1>
            <div class="acconut_rightuser" @click="showModal('')">企业管理</div>
          </div>
          <div class="table-page-search-wrapper" style="padding:0 24px">
            <a-form-model :model="form" layout="inline">
              <a-row :gutter="20">
                <a-col :md="6" :sm="24">
                  <a-form-model-item ref="robotName" label="机器码" prop="robotName">
                    <a-input v-model="form.robotName" placeholder="机器码" allowClear/>
                  </a-form-model-item>
                </a-col>
                <a-col :md="5" :sm="24" :span="24">
                  <a-select v-model="form.companyThirdUuid" placeholder="请选择企业" @change="selecsChange">
                    <a-select-option v-for="(tims, index) in enterpriseLicense" :key="index" :value="tims.uuid">
                      {{ tims.thirdName }}
                    </a-select-option>
                  </a-select>
                </a-col>
                <a-col :md="5" :sm="24" :span="24">
                  <a-select v-model="form.licenseType" placeholder="请选择激活码类型">
                    <a-select-option value="temp">
                      临时激活码
                    </a-select-option>
                    <a-select-option value="formal">
                      正式激活码
                    </a-select-option>
                  </a-select>
                </a-col>
                <a-col :md="6" :sm="24" >
                  <a-form-model-item>
                    <a-button
                      class="search"
                      type="primary"
                      html-type="submit"
                      @click="setSearch(form)"
                    >查询</a-button>
                    <a-button style="margin-left:10px;" @click="authors()">创建激活码</a-button>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-form-model>
            <div class="bt"></div>
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
              <template slot="name" slot-scope="text, record">
                <editable-cell :uuid="record.uuid" :text="record.clientName" @change="onCellChange(record, 'name', $event)" />
              </template>
              <template slot="hwid" slot-scope="text, record">
                <a @click="doCopy('1', record)">{{ record.hwid }}</a>
              </template>
              <template slot="licenseType" slot-scope="text, record">
                <span v-if="record.licenseType === 'temp'">临时</span>
                <span v-if="record.licenseType === 'formal'">正式</span>
              </template>
              <template slot="actionkid" slot-scope="text, record">
                <span v-if="record.kind === 10">studio</span>
                <span v-if="record.kind === 11">robot</span>
              </template>
              <template slot="createTime" slot-scope="text, record">
                起 {{ record.createTime.substring(0,10) }}<br>止 {{ record.expireDate.substring(0,10) }}
              </template>
              <template slot="action" slot-scope="text, record">
                <!-- <span>
                  <a @click="doCopy(record)">编辑</a>
                </span> -->
                <span>
                  <a @click="doCopy('2', record)">复制激活码</a>
                </span>
              </template>
            </a-table>
          </div>
        </div>
      </a-col>
    </a-row>
    <!-- 创建激活码 -->
    <a-modal v-model="visible" title="创建激活码" @cancel="handleCancel" on-ok="handleOk">
      <a-form-model
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item ref="clientName" label="客户端名称" prop="clientName">
          <a-input v-model="ruleForm.clientName" placeholder="客户端名称"/>
        </a-form-model-item>
        <a-form-model-item ref="hwid" label="机器码" prop="hwid">
          <a-input v-model="ruleForm.hwid" placeholder="机器码"/>
        </a-form-model-item>
        <a-form-model-item label="客户端类型" prop="kind">
          <a-select v-model="ruleForm.kind" placeholder="请选择类型">
            <a-select-option value="11">
              robot
            </a-select-option>
            <a-select-option value="10">
              studio
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="licenseType" label="激活码类型" prop="licenseType">
          <a-select v-model="ruleForm.licenseType" @change="handleChange" placeholder="请选择激活码类型">
            <a-select-option value="temp">
              临时激活码
            </a-select-option>
            <a-select-option value="formal">
              正式激活码
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item v-if="ruleForm.licenseType === 'temp'" ref="expireDays" label="有效时间" prop="expireDays">
          <a-select v-model="ruleForm.expireDays" placeholder="请选择有效时间">
            <a-select-option value="14">
              14天
            </a-select-option>
            <a-select-option value="45">
              45天
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="companyThirdUuid" label="企业名称" prop="companyThirdUuid">
          <a-select v-model="ruleForm.companyThirdUuid" placeholder="请选择企业">
            <a-select-option v-for="(tims, index) in enterpriseLicense" :key="index" :value="tims.uuid">
              {{ tims.thirdName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button @click="handleCancel('ruleForm')">
          取消
        </a-button>
        <a-button type="primary" :loading="loadings" @click="handleOk()">
          确定
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { listLicense, createLicense, thirdList, updateLicense } from '@/api/user'
const EditableCell = {
  template: `
      <div class="editable-cell">
        <div v-if="editable" class="editable-cell-input-wrapper">
          <a-input :value="value" @change="handleChange" @pressEnter="check" /><a-icon
            type="check"
            class="editable-cell-icon-check"
            @click="check"
          />
        </div>
        <div v-else class="editable-cell-text-wrapper">
          {{ value || ' ' }}
          <a-icon type="edit" class="editable-cell-icon" @click="edit" />
        </div>
      </div>
    `,
  props: {
    text: String,
    uuid: String
  },
  data () {
    return {
      value: this.text,
      companyThirdUuid: this.uuid,
      editable: false
    }
  },
  methods: {
    handleChange (e) {
      const value = e.target.value
      this.value = value
    },
    check () {
      const data = {
        'clientLicenseUuid': this.companyThirdUuid,
        'clientName': this.value
      }
      updateLicense(data).then(res => {
        if (res.code === 200) {
          this.$message.success('企业名称修改成功')
          this.editable = false
          this.$emit('change', this.value)
        } else {
          if (res.code === 500) {
            this.$message.warning('系统异常！')
          } else {
            this.$message.warning(res.msg)
          }
        }
      })
    },
    edit () {
      this.editable = true
    }
  }
}
// 表格项
const columns = [
  {
    title: '客户端名称',
    dataIndex: 'clientName',
    scopedSlots: { customRender: 'name' }
    // width: '20%'
  },
  {
    title: '企业名称',
    dataIndex: 'companyThirdName'
  },
  {
    title: '机器码(点击复制)',
    dataIndex: 'hwid',
    width: '270px',
    scopedSlots: { customRender: 'hwid' }
  },
  {
    title: '有效日期',
    dataIndex: '',
    scopedSlots: { customRender: 'createTime' }
  },
  {
    title: '激活码类型',
    dataIndex: 'licenseType',
    scopedSlots: { customRender: 'licenseType' }
  },
  {
    title: '客户端类型',
    dataIndex: 'kind',
    scopedSlots: { customRender: 'actionkid' }
  },
  {
    title: '操作',
    dataIndex: '',
    width: '14%',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  components: {
    EditableCell
  },
  data () {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
      form: {
        robotName: '',
        licenseType: undefined,
        companyThirdUuid: undefined
      },
      enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
      enterpriseLicense: [],
      companyThirdUuid: '',
      ruleForm: {
        clientName: '', // 名称
        companyUuid: this.$store.getters.userInfo.enterpriseUuid || '', // 企业id
        hwid: '', // 机器码
        licenseType: undefined, // 客户端类型
        expireDays: 14, // 选择日期
        kind: undefined, // 激活码类型
        companyThirdUuid: '' // 企业uuid
      },
      loading: false,
      columns,
      listData: [],
      pagination: {
        showQuickJumper: true
      },
      visible: false,
      thirdListData: {
        page: 1,
        size: 1000
      },
      postData: {
        enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
        hwid: '',
        page: 1,
        size: 10
      },
      loadings: false,
      rules: { // 判断
        clientName: [
          { required: true, message: '客户端名称不能为空', trigger: 'blur' }
        ],
        hwid: [
          { required: true, message: '机器码不能为空', trigger: 'blur' },
          { pattern: /^[A-F\d]{56}$/, message: '请输入正确的56位机器码', trigger: 'blur' }
        ],
        licenseType: [
          { required: true, message: '请选择客户端类型', trigger: 'change' }
        ],
        kind: [
          { required: true, message: '请选择激活码类型', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.accountUsery(this.postData)
    this.getThirdList(this.thirdListData)
    // this.$spm('o.c')
  },
  methods: {
    handleChange (e) {
      if (e === 'temp') {
        this.ruleForm.expireDays = '14'
        this.ruleForm.companyThirdUuid = undefined
      } else {
        this.ruleForm.expireDays = undefined
        this.ruleForm.companyThirdUuid = this.companyThirdUuid
      }
    },
    selecsChange (e) {
      this.form.licenseType = undefined
    },
    onCellChange (key, dataIndex, value) {
      this.accountUsery(this.postData)
    },
    showModal () {
      this.$router.push({
        path: '/author/tripartite'
      })
    },
    doCopy (test, index) {
      var name = ''
      if (test === '1') {
        name = index.hwid
      } else {
        name = index.license
      }
      this.$copyText(name).then(message => {
        this.$message.success('已复制到剪切板')
      }).catch(err => {
        console.log('copy.err', err)
        this.$message.error('复制失败')
      })
    },
    getThirdList (data) {
      thirdList(data).then(res => {
        if (res.code === 200) {
          this.enterpriseLicense = res.data
          this.ruleForm.companyThirdUuid = undefined
          this.companyThirdUuid = res.data[0].uuid
        } else {
          this.enterpriseLicense = []
          if (res.code === 500) {
            this.$message.warning('系统异常！')
          } else {
            this.$message.warning(res.msg + '， 失败')
          }
        }
      })
    },
    // 唤起创建激活码
    authors () {
      this.visible = true
    },
    // 确定提交
    handleOk () {
      this.loadings = true
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const data = this.enterpriseUuid
          this.getcreateLicense(data, this.ruleForm)
        } else {
          this.loadings = false
          return false
        }
      })
    },
    // 取消创建
    handleCancel () {
      this.visible = false
      this.$refs.ruleForm.resetFields()
    },
    // 创建确定接口
    getcreateLicense (data, form) {
      createLicense(data, form).then(res => {
        this.loadings = false
        if (+res.code === 200) {
          this.visible = false
          this.loadings = false
          this.$message.success('临时激活码创建成功')
          this.accountUsery(this.postData)
          // this.$refs[formName].resetFields()
          this.$refs.ruleForm.resetFields()
        } else {
          this.visible = false
          this.loadings = false
          this.$message.warning(res.msg)
        }
      })
    },
    // 获取列表
    accountUsery (data) {
      this.loading = true
      listLicense(data).then(res => {
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
    // 点击搜索
    setSearch (val) {
      this.postData = {
        enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
        companyThirdUuid: val.companyThirdUuid,
        licenseType: val.licenseType,
        hwid: val.robotName,
        page: 1,
        size: 10
      }
      this.accountUsery(this.postData)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .editable-cell {
  position: relative;
}
/deep/ .editable-cell-input-wrapper,
/deep/ .editable-cell-text-wrapper {
  padding-right: 24px;
  box-sizing: border-box;
}
/deep/ .editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}
/deep/ .editable-cell-icon{
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}
/deep/.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}
/deep/ .editable-cell-icon {
  line-height: 18px;
  display: none;
}
/deep/ .editable-cell-icon-check {
  line-height: 28px;
}
/deep/ .editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
/deep/ .editable-cell-icon:hover,
/deep/ .editable-cell-icon-check:hover {
  color: #108ee9;
}
/deep/ .editable-add-btn {
  margin-bottom: 8px;
}
.acconut_rightuser{
  cursor: pointer;
  float: right;
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
  margin-right: 37px;
  i{
    color: #fff;
    font-weight: bold;
    font-size: 16px;
  }
}
</style>
