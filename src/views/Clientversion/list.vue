<template>
  <div>
    <a-row :gutter="24">
      <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '24px' }">
        <!-- <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :loading="loading" :bordered="false" title="开发者统计" :style="{ height: '100%' }">
          <div>asd</div>
        </a-card> -->
        <div class="account">
          <div class="account_title">
            <h1>客户端版本管理</h1>
            <div class="acconut_rightuser" @click="showModal()"><a-icon type="plus" /> 客户端版本</div>
          </div>
          <div style="padding:0 24px;">
            <a-table
              :row-key="record => record.uuid"
              :columns="columns"
              :data-source="listData"
              :pagination="pagination"
              :loading="loading"
              @change="handleTableChange"
            >
              <template slot="action" slot-scope="text, record">
                <span>
                  <a-popconfirm placement="top" ok-text="确定" cancel-text="取消" @confirm="handleRead(record)">
                    <template slot="title">
                      <p>提示</p>
                      <p>确认要删除当前版本'{{ record.clientVersion }}'?</p>
                    </template>
                    <a href="javascript:;">删除</a>
                  </a-popconfirm>
                </span>
              </template>
            </a-table>
          </div>
        </div>
      </a-col>
    </a-row>
    <!-- 新增版本 -->
    <a-modal v-model="visible" title="新增版本" on-ok="handleOk">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item ref="clientVersion" label="版本号" prop="clientVersion">
          <a-input v-model="form.clientVersion" placeholder="a.b.c格式的版本号"/>
        </a-form-model-item>
        <a-form-model-item ref="description" label="版本说明" prop="description">
          <a-input v-model="form.description" type="textarea" :rows="5" placeholder="版本说明"/>
        </a-form-model-item>
        <a-form-model-item ref="phone" label="文件上传">
          <a-upload
            name="file"
            :multiple="false"
            :data="authData"
            :file-list="fileList"
            action="/api/v1/sys/clientVersion/upload/temp"
            @change="handleChange"
          >
            <a-button>上传安装包</a-button>
          </a-upload>
          <a-upload
            name="file"
            :multiple="false"
            :data="authData"
            :file-list="fileListkey"
            action="/api/v1/sys/clientVersion/upload/temp"
            @change="handleChangekey"
          >
            <a-button>上传升级包(可选)</a-button>
          </a-upload>
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button @click="handleCancel">
          取消
        </a-button>
        <a-button type="primary" :loading="loadings" @click="handleOk">
          确定
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { clientVersionList, clientVersionCreate, clientVersionDelete } from '@/api/user'
// 表格项
const columns = [
  {
    title: '版本号',
    dataIndex: 'clientVersion',
    width: '8%'
  },
  {
    title: '安装包地址',
    dataIndex: 'installUrl'
  },
  {
    title: '升级包地址',
    dataIndex: 'updateUrl'
  },
  {
    title: '发布时间',
    dataIndex: 'updateTime',
    width: '18%'
  },
  {
    title: '版本描述',
    dataIndex: 'description'
  },
  {
    title: '操作',
    dataIndex: '',
    scopedSlots: { customRender: 'action' },
    width: '10%'
  }
]
export default {
  data () {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 19 },
      enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
      loading: false,
      visible: false,
      pagination: {
        showQuickJumper: true
      },
      form: {
        clientVersion: '',
        description: '1. 问题修复。\n2. 性能优化。',
        installKey: '',
        updateKey: ''
      },
      loadings: false,
      listData: [],
      columns,
      postData: {
        enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
        page: 1,
        size: 10
      },
      authData: {
        access_token: this.$store.getters.token
      },
      fileList: [],
      fileListkey: [],
      rules: { // 判断
        clientVersion: [
          { required: true, message: '请输入版本号', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入版本说明', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.accountUsery(this.postData)
  },
  methods: {
    // 删除
    handleRead (key) {
      const data = {
        clientVersionUuid: key.uuid
      }
      clientVersionDelete(data).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功!')
          this.accountUsery(this.postData)
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 上传版本
    handleChange (info) {
      // eslint-disable-next-line no-unused-vars
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      fileList = fileList.map(file => {
        if (file.response) {
          // Component will show file.url as link
          file.url = file.response.url
        }
        return file
      })
      if (!info.file.response) {
      } else {
        this.form.installKey = info.file.response.data
      }
      this.fileList = fileList
    },
    handleChangekey (info) {
      // eslint-disable-next-line no-unused-vars
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      fileList = fileList.map(file => {
        if (file.response) {
          // Component will show file.url as link
          file.url = file.response.url
        }
        return file
      })
      if (!info.file.response) {
      } else {
        this.form.updateKey = info.file.response.data
      }
      this.fileListkey = fileList
    },
    // 添加版本
    showModal (last) {
      this.visible = true
    },
    // 取消添加版本
    handleCancel (e) {
      this.visible = false
    },
    handleOk () {
      this.loadings = true
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          clientVersionCreate(this.form).then(res => {
            if (res.code === 200) {
              this.loadings = false
              this.visible = false
              this.$message.success('版本添加成功!')
              this.accountUsery(this.postData)
            } else {
              this.loadings = false
              this.visible = false
              this.$message.warning(res.msg)
            }
          })
        } else {
          this.loadings = false
          return false
        }
      })
    },
    // 获取列表
    accountUsery (data) {
      this.loading = true
      clientVersionList(data).then(res => {
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
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ td {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  padding-right: 10px;
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
.default_cha{
  float: right;
  line-height: 70px;
  span{
    margin-left: 10px;
    margin-top: 2px;
    float: right;
  }
}
.actions{
  width: 36px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
  float: left;
  margin-right: 6px;
  background-color :#ff525b;
}
</style>
