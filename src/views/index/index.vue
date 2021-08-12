<template>
  <div>
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <div class="index_app application">
          <h2>开发应用数</h2>
          <countTo :startVal="0" :endVal="lastTop.robotCnt" :duration="2000"></countTo>
          <a-tooltip>
            <template slot="title">
              企业开发累计应用总数
            </template>
            <img :src="icon1" alt="">
          </a-tooltip>
        </div>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <div class="index_app execution">
          <h2>累计执行时长(小时)</h2>
          <countTo :startVal="0" :endVal="lastTop.totalRunHours" :duration="2000"></countTo>
          <a-tooltip>
            <template slot="title">
              企业所有应用有效执行的总时长
            </template>
            <img :src="icon2" alt="">
          </a-tooltip>
        </div>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <div class="index_app Number">
          <h2>执行任务数</h2>
          <countTo :startVal="0" :endVal="lastTop.totalRunCount" :duration="2000"></countTo>
          <a-tooltip>
            <template slot="title">
              运行应用的有效总次数
            </template>
            <img :src="icon3" alt="">
          </a-tooltip>
        </div>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <div class="index_app manpower">
          <h2>相当于节省人力(天)</h2>
          <countTo :startVal="0" :endVal="lastTop.totalRunWorkDays" :duration="2000"></countTo>
          <a-tooltip placement="topRight">
            <template slot="title">
              累计执行时长(小时) / 8（小时）* 5倍人的效率
            </template>
            <img :src="icon4" alt="">
          </a-tooltip>
        </div>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '24px' }">
        <a-card
          class="antd-pro-pages-dashboard-analysis-salesCard"
          description="时长"
          :loading="loading"
          :bordered="false"
          title="应用运行时长(小时)"
          :style="{ height: '100%' }">
          <div slot="extra" class="analysis-salesTypeRadio">
            <a-radio-group defaultValue="week" @change="onChanger">
              <a-radio-button value="week">最近一周</a-radio-button>
              <a-radio-button value="month">最近一月</a-radio-button>
              <a-radio-button value="year">最近一年</a-radio-button>
            </a-radio-group>
          </div>
          <div id="container" :style="{ 'margin-top': '-20px' }"></div>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '24px' }">
        <div class="account">
          <div class="account_title">
            <h1 style="margin-right:10px">开发者统计</h1>
          </div>
          <div class="application_sear">
            <a-table
              :row-key="record => record.userUuid"
              :columns="columns"
              :data-source="listData"
              :pagination="pagination"
              :loading="loading"
              @change="handleTableChange"
            >
            </a-table>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import countTo from 'vue-count-to'
import { Area } from '@antv/g2plot'
import { summaryData, dayUser, summaryList } from '@/api/user'
// 表格项
const columns = [
  {
    title: '账号',
    dataIndex: 'userName'
  },
  {
    title: '姓名',
    dataIndex: 'employName'
  },
  {
    title: '开发者应用数',
    sorter: true,
    dataIndex: 'robotCount'
  },
  {
    title: '机器人运行时间(小时)',
    sorter: true,
    dataIndex: 'robotRunTime'
  }
]
const data = [
  {
    时间: '2020-01-01',
    运行时长: 0
  },
  {
    时间: '2020-01-01',
    运行时长: 0
  }
]
export default {
  components: {
    countTo
  },
  data () {
    return {
      loading: false,
      icon1: require('@/assets/img/icon1.png'),
      icon2: require('@/assets/img/icon2.png'),
      icon3: require('@/assets/img/icon3.png'),
      icon4: require('@/assets/img/icon4.png'),
      enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
      lastTop: '',
      columns,
      listData: [],
      pagination: {
        showQuickJumper: true
      },
      data,
      postData: {
        enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
        sortOrder: '',
        sortBy: '',
        page: 1,
        size: 10
      },
      dayUser: {
        enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
        field: 'runTime',
        days: '7'
      },
      painObj: null
    }
  },
  mounted () {
    this.getsummaryData()
    this.getsummaryList(this.postData)
    this.getdayUser(this.dayUser)
    this.ans('运行时长')
    this.$spm('o.f')
  },
  methods: {
    // 点击切换年月周
    onChanger (e) {
      switch (e.target.value) {
        case 'year':
          this.dayUser.days = '365'
          break
        case 'month':
          this.dayUser.days = '30'
          break
        case 'week':
          this.dayUser.days = '7'
          break
      }
      this.getdayUser(this.dayUser)
    },
    // 获取默认年份
    getdayUser (data) {
      dayUser(data).then(res => {
        if (res.code === 200) {
          this.painObj.changeData(res.data.dataRows)
        }
      })
    },
    // 饼图
    ans (test) {
      const areaPlot = new Area(document.getElementById('container'), {
        title: {
          visible: true,
          text: test
        },
        data,
        forceFit: true,
        height: 400,
        meta: {
          时间: {
            alias: '年份',
            range: [0, 1]
          }
        },
        xAxis: {
          type: 'dateTime',
          tickCount: 8
        },
        yAxis: {
          min: 0
        },
        lineDash: 'number',
        color: ['#FF7F86'],
        xField: '时间',
        yField: '运行时长',
        smooth: true
      })
      areaPlot.render()
      this.painObj = areaPlot
    },
    // 首页数据
    getsummaryData () {
      const data = {
        enterpriseUuid: this.enterpriseUuid
      }
      summaryData(data).then(res => {
        if (res.code === 200) {
          this.lastTop = res.data
        }
      })
    },
    // 开发者统计
    getsummaryList (data) {
      summaryList(data).then(res => {
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
      if (sorter.columnKey === 'robotCount') {
        this.postData.sortBy = 'currentDevelopCount'
      } else {
        this.postData.sortBy = 'accumulateRunTime'
      }
      if (sorter.order === 'ascend') {
        this.postData.sortOrder = 'desc'
      } else if (sorter.order === 'descend') {
        this.postData.sortOrder = 'asc'
      } else {
        this.postData.sortOrder = ''
        this.postData.sortBy = ''
      }
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.postData.page = pager.current
      this.postData.sorter = sorter.order
      this.getsummaryList(this.postData)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.ant-card-body{
  padding: 24px 0 0 0;
}
.index_app{
  padding: 20px 24px 24px 24px;
  border-radius: 3px;
  height:107px;
  position: relative;
  h2{
    font-size:14px;
    font-family:Microsoft YaHei;
    font-weight:400;
    color:rgba(255,255,255,1);
  }
  img{
    opacity:0.7;
    position: absolute;
    right: 24px;
    top: 24px;
    width:16px;
    height:16px;
    transition: all 0.3s;
    &:hover{
      opacity: 1;
    }
  }
  span{
    font-size:30px;
    font-family:DINOT;
    font-weight:bold;
    color:rgba(255,255,255,1);
    line-height:34px;
  }
}
.application{
  background:url('../../assets/img/pic.png') no-repeat right center/cover, linear-gradient(180deg,rgba(59,183,247,1),rgba(45,144,237,1));
  background-size: 162px 107px;
}
.execution{
  background:url('../../assets/img/pic.png') no-repeat right center/cover, linear-gradient(180deg,rgba(255,204,38,1),rgba(252,128,84,1));
  background-size: 162px 107px;
}
.Number{
  background:url('../../assets/img/pic.png') no-repeat right center/cover, linear-gradient(180deg,rgba(35,231,165,1),rgba(19,183,142,1));
  border-radius:3px;
  background-size: 162px 107px;
}
.manpower{
  background:url('../../assets/img/pic.png') no-repeat right center/cover, linear-gradient(180deg,rgba(138,139,154,1),rgba(88,90,106,1));
  background-size: 162px 107px;
}
.extra_title{
  font-size:14px;
  font-family:Microsoft YaHei;
  font-weight:400;
  color:rgba(38,38,38,1);
  line-height:34px;
  margin-bottom: 20px;
}
</style>
