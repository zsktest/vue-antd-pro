<template>
  <page-header-wrapper
    title="用户信息"
  >
    <template v-slot:content>
      <div class="userInfo">
        <div>
          <p><span>登录账号：</span><span>{{ detailTop.loginAccount }}</span></p>
          <p><span>创建时间：</span><span>{{ detailTop.createTime }}</span></p>
          <p><span>到期时间：</span><span>{{ detailTop.expiredTime }}</span></p>
        </div>
        <div>
          <p><span>手机号：</span><span>{{ detailTop.phone }}</span></p>
          <p v-if="detailTop.email"><span>邮箱：</span><span>{{ detailTop.email }}</span></p>
          <p><span>初始密码：</span><span>{{ detailTop.password }}</span></p>
        </div>
      </div>
    </template>
    <!-- 操作 -->
    <!-- <a-descriptions size="small" :column="isMobile ? 1 : 3">
        <a-descriptions-item label="登录次数">{{ detailTop.loginCount }}</a-descriptions-item>
        <a-descriptions-item label="使用次数">{{ detailTop.useRobotCount }}</a-descriptions-item>
        <a-descriptions-item label="获取应用">{{ detailTop.acquireRobotCount }}</a-descriptions-item>
        <a-descriptions-item label="运行次数">{{ detailTop.currentUseRobotCount }}</a-descriptions-item>
      </a-descriptions> -->
    <a-row :gutter="24">
      <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '24px' }">
        <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :loading="loadingindex" :bordered="false" title="积累数据" :style="{ height: '100%' }">
          <div slot="extra" class="analysis-salesTypeRadio">
            <a-radio-group defaultValue="month" @change="onChanger">
              <!-- <a-radio-button value="week">最近一周</a-radio-button> -->
              <a-radio-button value="month">最近一月</a-radio-button>
              <a-radio-button value="year">最近一年</a-radio-button>
            </a-radio-group>
          </div>
          <a-col
            :sm="24"
            :md="12"
            :xl="6"
            :style="{ marginBottom: '24px' }"
            v-for="(last, index) in userSummaryDatalist"
            :key="index">
            <div class="index_app application">
              <h2>{{ last.name }}
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>{{ last.remark }}</span>
                  </template>
                  <a-icon type="question-circle" />
                </a-tooltip>
              </h2>
              <span>{{ last.value }}</span>
              <!-- <countTo :startVal="0" :endVal="last.value" :duration="2000"></countTo> -->
            </div>
          </a-col>
        </a-card>
      </a-col>
    </a-row>
    <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '24px' }">
      <div class="account">
        <div class="account_title">
          <h1>使用记录</h1>
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
              <a class="ant-dropdown-link" v-if="record.remark" @click="showDrawer(record.remark)">查看</a>
              <p v-else>-</p>
            </template>
          </a-table>
        </div>
      </div>
    </a-col>
    <a-drawer
      title="异常日志"
      placement="right"
      width="320"
      :closable="false"
      :visible="visible"
      @close="onClose"
    >
      <p>{{ drawers }}</p>
    </a-drawer>
  </page-header-wrapper>
</template>

<script>
import { baseMixin } from '@/store/app-mixin'
import countTo from 'vue-count-to'
import { queryUserRunRecordList, userDta, userSummaryData } from '@/api/user'

// 表格项
const columns = [
  {
    title: '使用应用',
    dataIndex: 'robotName'
    // width: '20%'
  },
  {
    title: '开始时间',
    dataIndex: 'startTime'
  },
  {
    title: '结束时间',
    dataIndex: 'endTime'
  },
  {
    title: '同步时间',
    dataIndex: 'heartTime'
  },
  {
    title: '运行状态',
    dataIndex: 'statusName'
  },
  {
    title: '运行时长',
    dataIndex: 'seconds'
  }
  // {
  //   title: '运行结束',
  //   dataIndex: 'statusName'
  // },
  // {
  //   title: '运行备注',
  //   dataIndex: 'remark',
  //   width: '10%',
  //   scopedSlots: { customRender: 'action' }
  // }
]
export default {
  components: {
    countTo
  },
  name: 'Detail',
  mixins: [baseMixin],
  data () {
    return {
      loading: false,
      loadingindex: false,
      listData: [],
      pagination: {
        showQuickJumper: true
      },
      visible: false,
      drawers: '',
      detailTop: '',
      columns,
      postData: {
        enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
        userUuid: this.$route.query.userUuid,
        page: 1,
        size: 10
      },
      userdata: {
        days: '30',
        enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
        userUuid: this.$route.query.userUuid
      },
      userSummaryDatalist: []
    }
  },
  filters: {
  },
  mounted () {
    this.getqueryUserRunRecordList(this.postData)
    this.getuserDta()
    this.getuserSummaryData(this.userdata)
    this.$spm('o.b.3')
  },
  methods: {
    // 打开抽屉
    showDrawer (e) {
      this.drawers = e
      this.visible = true
    },
    onClose () {
      this.visible = false
    },
    // 点击切换年月周
    onChanger (e) {
      switch (e.target.value) {
        case 'year':
          this.userdata.days = '365'
          break
        case 'month':
          this.userdata.days = '30'
          break
        case 'week':
          this.userdata.days = '7'
          break
      }
      this.getuserSummaryData(this.userdata)
    },
    // 积累数据
    getuserSummaryData (data) {
      this.loadingindex = true
      userSummaryData(data).then(res => {
        if (res.code === 200) {
          this.userSummaryDatalist = res.data
          this.loadingindex = false
        }
      })
    },
    // 获取列表
    getqueryUserRunRecordList (data) {
      this.loading = true
      queryUserRunRecordList(data).then(res => {
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
      this.getqueryUserRunRecordList(this.postData)
    },
    getuserDta () {
      const data = {
        userUuid: this.$route.query.userUuid,
        enterpriseUuid: this.postData.enterpriseUuid
      }
      userDta(data).then(res => {
        this.detailTop = res.data
      })
    }
  }
}
</script>

<style lang="less" scoped>
  // /deep/.ant-page-header-heading-title{
  //   display: none;
  // }
  .userInfo{
    background: #fff;
    display: flex;
    &>div{
      width: 50%;
      p{
        display: flex;
        color: rgba(0,0,0,.85);
        font-weight: 400;
        font-size: 14px;
        line-height: 1.5;
        span:nth-of-type(1){
          width: 90px;
          padding-right:5px;
          text-align: right;

        }
      }
    }
  }
  .detail-layout {
    margin-left: 44px;
  }
  .text {
    color: rgba(0, 0, 0, .45);
  }

  .heading {
    color: rgba(0, 0, 0, .85);
    font-size: 20px;
  }

  .no-data {
    color: rgba(0, 0, 0, .25);
    text-align: center;
    line-height: 64px;
    font-size: 16px;

    i {
      font-size: 24px;
      margin-right: 16px;
      position: relative;
      top: 3px;
    }
  }

  .mobile {
    .detail-layout {
      margin-left: unset;
    }
    .status-list {
      text-align: left;
    }
  }
  .index_app{
    background:rgba(245,246,247,1);
    border-radius:4px;
    height: 100px;
    padding: 16px;
    h2{
      font-size:14px;
      font-family:Microsoft YaHei;
      font-weight:400;
      color:rgba(115,115,115,1);
      margin-bottom: 16px;
    }
    i{
      margin-left: 5px;
    }
    span{
      font-size:24px;
      font-family:DINOT;
      font-weight:bold;
      color:rgba(38,38,38,1);
    }
  }
  /deep/.ant-descriptions-small .ant-descriptions-row > td{
    vertical-align: top;
  }
  /deep/.ant-descriptions-item > span{
    vertical-align: top;
  }
  /deep/.ant-descriptions-item-content{
    width: 85%;
    word-break: break-all;
  }
</style>
