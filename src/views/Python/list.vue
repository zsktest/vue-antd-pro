<template>
  <div>
    <a-row :gutter="24">
      <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '24px' }">
        <!-- <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :loading="loading" :bordered="false" title="开发者统计" :style="{ height: '100%' }">
          <div>asd</div>
        </a-card> -->
        <div class="account">
          <div class="account_title">
            <h1>Python包管理</h1>
            <div class="acconut_rightuser" @click="showModal()"><a-icon type="plus" /> Python包</div>
          </div>
          <div style="padding:0 24px;">
            <a-table
              :row-key="record => record.packageName"
              :columns="columns"
              :data-source="listData"
              :pagination="pagination"
              :loading="loading"
              @change="handleTableChange"
            >
              <!-- <template slot="action" slot-scope="text, record">
                <span>
                  <a @click="handleRead(record.fileName)">删除</a>
                </span>
              </template> -->
              <template slot="action" slot-scope="text, record">
                <span>
                  <a-popconfirm placement="top" ok-text="确定" cancel-text="取消" @confirm="handleRead(record.fileName)">
                    <template slot="title">
                      <p>提示</p>
                      <p>确认要删除当前依赖包'{{ record.packageName }}'?</p>
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
    <!-- 上传Python包 -->
    <a-modal v-model="visible" @cancel="handleCancel" title="上传Python包">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item ref="phone" label="文件上传">
          <a-upload
            name="file"
            accept=".whl, .egg"
            :multiple="false"
            :data="authData"
            :remove="remove"
            :file-list="fileList"
            action="/api/v1/sys/pypi/upload"
            @change="handleChange"
          >
            <a-button>上传安装包</a-button>
          </a-upload>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { pypiList, pypiDelete } from '@/api/user'
// 表格项
const columns = [
  {
    title: '依赖包',
    dataIndex: 'packageName',
    width: '10%'
  },
  {
    title: '版本',
    dataIndex: 'version',
    width: '10%'
  },
  {
    title: '作者',
    dataIndex: 'author'
  },
  {
    title: '摘要',
    dataIndex: 'summary'
  },
  {
    title: '文件',
    dataIndex: 'fileName'
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
        installKey: ''
      },
      loadings: false,
      listData: [],
      listmsg: 1,
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
      rules: { // 判断
      }
    }
  },
  mounted () {
    this.accountUsery(this.postData)
  },
  methods: {
    // 上传版本
    handleChange (info) {
      this.listmsg = 1
      // eslint-disable-next-line no-unused-vars
      let fileList = [...info.fileList]
      fileList = fileList.map(file => {
        if (file.response) {
          if (file.response.code === 400) {
            this.$message.warning(info.file.response.msg)
            this.listmsg = 2
          } else {
            file.url = file.response.url
          }
        }
        return file
      })
      this.fileList = fileList
      if (this.listmsg === 1) {
      } else {
        this.fileList = []
      }
    },
    // 删除
    remove (file) {
      this.handleRead(file.name)
    },
    // 添加版本
    showModal (last) {
      this.visible = true
    },
    // 取消添加版本
    handleCancel (e) {
      this.fileList = []
      this.visible = false
      this.accountUsery(this.postData)
    },
    handleOk () {
      this.loadings = true
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
        } else {
          this.loadings = false
          return false
        }
      })
    },
    // 删除
    handleRead (key) {
      const data = {
        fileName: key
      }
      pypiDelete(data).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.accountUsery(this.postData)
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 获取列表
    accountUsery (data) {
      this.loading = true
      pypiList(data).then(res => {
        if (res.code === 200) {
          const pagination = { ...this.pagination }
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
/deep/ .ant-modal-footer{
  display: none;
}
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
