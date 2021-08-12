<template>
  <div>
    <a-row :gutter="24">
      <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '24px' }">
        <!-- <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :loading="loading" :bordered="false" title="开发者统计" :style="{ height: '100%' }">
          <div>asd</div>
        </a-card> -->
        <div class="account">
          <div class="account_title">
            <h1>市场管理</h1>
            <span class="account_user"></span>
            <a-input-search placeholder="请输入市场名称" style="width: 200px" @search="handleInputsearch"/>
            <div class="default_cha">
              <a-switch @change="onChange" v-model="defaults" /><span>企业默认市场</span>
            </div>
          </div>
          <div style="padding:0 24px;">
            <a-table
              :row-key="record => record.groupInfoBO.uuid"
              :columns="columns"
              :data-source="listData"
              :pagination="pagination"
              :loading="loading"
              @change="handleTableChange"
            >
              <template slot="action" slot-scope="text, record">
                <span v-if="record.groupInfoBO.enterpriseDefault" class="actions">默认</span>
                <span>{{ record.groupInfoBO.name }}</span>
              </template>
            </a-table>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { listMarket, enableDefaultMarket, disableDefaultMarket, queryEnterprise } from '@/api/user'
// 表格项
const columns = [
  {
    title: '市场名称',
    dataIndex: 'groupInfoBO.name',
    scopedSlots: { customRender: 'action' }
  },
  {
    title: '归属账号',
    dataIndex: 'groupOwnerName'
  },
  {
    title: '应用数量',
    dataIndex: 'groupInfoBO.robotCount'
  },
  {
    title: '用户数量',
    dataIndex: 'groupInfoBO.userCount'
  },
  {
    title: '创建时间',
    dataIndex: 'groupInfoBO.createTime'
  }
]
export default {
  data () {
    return {
      enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
      loading: false,
      pagination: {
        showQuickJumper: true
      },
      listData: [],
      columns,
      defaults: false,
      postData: {
        enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
        key: '',
        page: 1,
        size: 10
      }
    }
  },
  mounted () {
    this.accountUsery(this.postData)
    this.queryEnterprise()
    this.$spm('o.d')
  },
  methods: {
    // 获取默认数据
    queryEnterprise () {
      const data = {
        enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid
      }
      queryEnterprise(data).then(res => {
        if (res.code === 200) {
          this.defaults = res.data.enableDefaultMarket
        }
      })
    },
    // 点击切换默认市场
    onChange (checked) {
      const data = {
        enterpriseUuid: this.enterpriseUuid
      }
      const _this = this
      if (checked) {
        _this.defaults = false
          _this.$confirm({
          title: '提示',
          content: '企业默认市场面向企业内所有员工可见，且市场用户列表不可修改。你可随时关闭或重新开启企业市场，确认开启?',
          onOk () {
            enableDefaultMarket(data).then(res => {
              if (res.code === 200) {
                _this.postData.page = 1
                _this.defaults = true
                _this.accountUsery(_this.postData)
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
          content: '你可随时重新开启企业市场，确认关闭?',
          onOk () {
            disableDefaultMarket(data).then(res => {
              if (res.code === 200) {
                _this.postData.page = 1
                _this.defaults = false
                _this.accountUsery(_this.postData)
              }
            })
          },
          onCancel () {
          }
        })
      }
    },
    // 获取列表
    accountUsery (data) {
      this.loading = true
      listMarket(data).then(res => {
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
    // 搜索
    handleInputsearch (value, event) {
      this.postData.key = value
      this.postData.page = 1
      this.accountUsery(this.postData)
    }
  }
}
</script>
<style lang="less" scoped>
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
