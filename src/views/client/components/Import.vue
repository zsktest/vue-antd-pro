<template>
  <div>
    <a-upload-dragger
      v-if="colleague"
      name="file"
      :before-upload="beforeUpload"
      :showUploadList="false"
      accept=".xlsx, .xls"
      style="height:360px;display: block;"
    >
      <p class="ant-upload-drag-icon">
        <a-icon type="cloud-upload" style="color:#ccc;" />
      </p>
      <p class="ant-upload-text">将文件拖拽到这里或者点击此区域开始导入</p>
      <p class="ant-upload-hint">仅支持 .xlsx .xls文件</p>
    </a-upload-dragger>
    <div v-else class="upload-choice">
      <img src="@/assets/img/excel_icon@2x.png" alt="">
      <p v-if="fileList.length > 0">{{ fileList[0].name }} （{{ fileList[0].size/1024 }}kb）</p>
      <a-button @click="choice">重新选择</a-button>
    </div>
    <a href="https://winrobot-pub-a.oss-cn-hangzhou.aliyuncs.com/assets/files/企业用户导入模版.xlsx" class="upload_url">点击下载员工信息模板 .xlsx</a>
    <div class="ant-modal-footer">
      <a-button @click="colleagueCancel">
        取消
      </a-button>
      <a-button type="primary" :disabled="colleague" :loading="loadings" @click="handleOk">
        导入
      </a-button>
    </div>
    <div class="upload-process" v-if="process">
      <div class="process">
        <img src="@/assets/img/excel_icon@2x.png" alt="">
        <div>
          <p v-if="fileList.length > 0">{{ fileList[0].name }}</p>
          <a-progress :percent="Create.createRate" status="active" />
        </div>
      </div>
    </div>
    <div class="upload-fail" v-if="tableing">
      <div class="fail-title">
        <p><a-icon type="close-circle" theme="filled" />导入失败</p>
        <a-button type="primary" @click="choice">重新导入</a-button>
      </div>
      <div class="fail-table">
        <a-table :columns="columns" :data-source="failtable" :row-key="record => record.rowIndex" :pagination="false" :scroll="{ x: 1000, y: 360 }">
        </a-table>
      </div>
    </div>
    <div class="upload-fail" v-if="successing">
      <a-result
        status="success"
        :title="successtitle">
        <template #extra>
          <a-button key="buy" @click="upload_clics">完成</a-button>
        </template>
      </a-result>
    </div>
  </div>
</template>
<script>
import reqwest from 'reqwest'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { queryCreateUserStatus } from '@/api/user'
const columns = [
  {
    title: 'Excel行号',
    dataIndex: 'rowIndex',
    width: 100,
    key: '1'
  },
  {
    title: '账号',
    dataIndex: 'account',
    key: '2'
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: '3'
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: '4'
  },
  {
    title: '密码',
    dataIndex: 'customPassword',
    key: '5'
  },
  {
    title: '错误信息',
    fixed: 'right',
    width: 200,
    dataIndex: 'errorMessage',
    key: '6'
  }
]
// 表格项
export default {
  data () {
    return {
      loadings: false,
      colleague: true,
      process: false,
      tableing: false,
      successing: false,
      successtitle: '',
      uploadImage: process.env.VUE_APP_API_BASE_URL + 'api/v1/enterpriseUser/createEnterpriseUserByExcel',
      fileList: [],
      createStatusUuid: '',
      failtable: [],
      Create: '',
      importfios: true,
      columns
    }
  },
  mounted () {
  },
  methods: {
    // 成功关闭
    upload_clics () {
      this.$emit('importclcks', this.importfios)
      this.colleague = true
      this.tableing = false
      this.process = false
      this.successing = false
      this.fileList = []
    },
    colleagueCancel () {
      this.loadings = false
      this.$emit('importclcks', this.importfios)
      this.colleague = true
      this.tableing = false
      this.process = false
      this.successing = false
      this.fileList = []
    },
    beforeUpload (file) {
      this.fileList = [...this.fileList, file]
      this.colleague = false
      return false
    },
    handleOk () {
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('file', file)
      })
      this.loadings = true
      reqwest({
        url: this.uploadImage,
        method: 'post',
        processData: false,
        headers: {
          Authorization: 'Bearer ' + storage.get(ACCESS_TOKEN)
        },
        data: formData,
        success: (res) => {
          if (res.code === 200) {
            this.loadings = false
            this.process = true
            this.createStatusUuid = res.data.createBatchUuid
            this.handleChange()
          } else {
            this.$message.error(res.msg)
          }
        },
        error: () => {
          this.fileList = []
          this.loadings = false
          this.$message.error('失败')
        }
      })
    },
    // 获取
    handleChange () {
      const data = {
        createBatchUuid: this.createStatusUuid
      }
      queryCreateUserStatus(data).then(res => {
        if (res.code === 200) {
          this.Create = res.data
          if (res.data.checkStatus) {
            if (res.data.createStatus === 'finish') {
              this.successing = true
              this.successtitle = '导入成功，已新增' + res.data.successCount + '个账号'
            } else {
              this.handleChange()
            }
          } else {
            if (res.data.errorDataList.length <= 0) {
              this.$message.error(res.data.message)
            } else {
              this.failtable = res.data.errorDataList
            }
            this.tableing = true
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 重新选择
    choice () {
      this.colleague = true
      this.tableing = false
      this.process = false
      this.fileList = []
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.ant-table-body{
  min-height: 360px;
}
/deep/.ant-table-scroll{
  position: relative;
}
.upload_url{
  display: block;
  margin-top: 22px;
  color: #2588E6;
  margin-bottom: 12px;
}
.upload-choice{
  position: relative;
  width: 488px;
  height: 360px;
  text-align: center;
  background: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 3px;
  cursor: pointer;
  -webkit-transition: border-color 0.3s;
  transition: border-color 0.3s;
  img{
    width: 108/2px;
    margin-top: 117px;
    margin-bottom: 20px;
  }
}
/deep/.ant-modal-footer{
  border: none;
  padding: 10px 0;
  float: right;
  margin-top: -46px;
}
.upload-process{
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(252, 252, 252, 0.9);
  z-index: 2;
  .process{
    width: 431px;
    height: 150px;
    background: #FFFFFF;
    box-shadow: 0px 6px 15px 0px rgba(13, 23, 38, 0.1);
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -75px 0 0 -216px;
    padding: 48px 32px;
    img{
      width: 108/2px;
      margin-right: 12px;
      vertical-align: top;
    }
    div{
      width: 300px;
      display: inline-block;
      p{
        margin: 0;
        margin-top: 7px;
      }
    }
  }
}
.upload-fail{
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: #fff;
  z-index: 3;
  .fail-title{
    line-height: 58px;
    height: 58px;
    padding: 0 24px;
    p{
      float: left;
      margin: 0;
      i{
        font-size: 16px;
        color: #FF525B;
        margin-right: 8px;
      }
    }
    button{
      float: right;
      margin-top: 12px;
    }
  }
  .fail-table{
    background: #FFFFFF;
    border: 1px solid #D7DAE0;
    margin: 0 24px;
  }
  /deep/.ant-table-placeholder{
    border-bottom: none;
    position: absolute;
    width: 100%;
    top: 54px;
  }
  /deep/.ant-result-icon{
    margin-top: 70px;
    i{
      font-size: 58px;
    }
  }
}
/deep/.ant-result-title{
  font-size: 14px;
}
</style>
