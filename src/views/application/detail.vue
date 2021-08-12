<template>
  <page-header-wrapper
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    @tabChange="handleTabChange"
  >
    <template v-slot:title>
      <a-col :md="24" :sm="24">
        <div class="application_detail">
          <a-col :md="2" :sm="24" class="application_detailimg">
            <img :src="detail.icon" v-if="detail.icon" style="width:64px;height:64px;" />
            <div class="client_top_img" v-else-if="detail.name" :style="{background: rebhover}">{{ detail.name.substring(0,1) }}</div>
          </a-col>
          <a-col :md="21" :sm="24" class="application_detailright">
            <h2>{{ detail.name }}</h2>
            <span>{{ detail.description }}</span>
          </a-col>
          <div class="bt"></div>
        </div>
      </a-col>
    </template>
    <template v-slot:content>
      <a-descriptions size="small" :column="isMobile ? 1 : 3">
        <a-descriptions-item label="所有者">{{ detail.ownerName }}</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ detail.createTime }}</a-descriptions-item>
        <a-descriptions-item label="版本号">{{ detail.developVersion }}</a-descriptions-item>
        <a-descriptions-item label="自动化类型">{{ detail.uiaType }}</a-descriptions-item>
        <a-descriptions-item label="更新时间">{{ detail.modifyTime }}</a-descriptions-item>
        <a-descriptions-item label="应用授权">{{ detail.authorityName }}</a-descriptions-item>
      </a-descriptions>
    </template>
    <!-- actions -->
    <template v-slot:extra>
      <a-button-group style="margin-right: 4px;">
        <!-- <a-button @click="robot('View',detail.robotVersionUuid)">查看应用</a-button> -->
        <!-- <a-button @click="robot('Run',detail.robotVersionUuid)">运行应用</a-button> -->
        <!-- <a-button><a-icon type="ellipsis"/></a-button> -->
      </a-button-group>
    </template>
    <div v-show="tabActiveKey === 'detail'">
      <a-row :gutter="24">
        <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '24px' }">
          <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :bordered="false" title="积累数据" :style="{ height: '100%' }">
            <div slot="extra" class="analysis-salesTypeRadio">
              <a-radio-group defaultValue="week" @change="onChangers">
                <a-radio-button value="week">最近一周</a-radio-button>
                <a-radio-button value="month">最近一月</a-radio-button>
                <a-radio-button value="year">最近一年</a-radio-button>
              </a-radio-group>
            </div>
            <a-skeleton :loading="loadingindex" style="height:100px">
              <a-col
                :sm="24"
                :md="12"
                :xl="6"
                :style="{ marginBottom: '24px', paddingLeft: '0', paddingRight: '24px' }"
                v-for="(last, index) in robotSummaryDatalist"
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
                  <span v-if="last.type === 'string'">{{ last.value }}</span>
                  <countTo v-else :startVal="0" :endVal="last.value" :duration="2000"></countTo>
                </div>
              </a-col>
            </a-skeleton>
            <!-- <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px', paddingLeft: '0', paddingRight: '24px' }">
              <div class="index_app execution">
                <h2>运行次数<a-icon type="question-circle" /></h2>
                <countTo :startVal="0" :endVal="123" :duration="2000"></countTo>
              </div>
            </a-col>
            <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px', paddingLeft: '0', paddingRight: '24px' }">
              <div class="index_app Number">
                <h2>获取人数<a-icon type="question-circle" /></h2>
                <countTo :startVal="0" :endVal="7260" :duration="2000"></countTo>
              </div>
            </a-col>
            <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px', paddingLeft: '0', paddingRight: '0' }">
              <div class="index_app manpower">
                <h2>运行成功率<a-icon type="question-circle" /></h2>
                <countTo :startVal="0" :endVal="123" :duration="2000"></countTo>
              </div>
            </a-col> -->
            <div class="application">
              <div class="application_left">
                <div class="application_title">
                  <h1>{{ Changel }}</h1>
                  <a-radio-group defaultValue="runTime" @change="onChangel">
                    <a-radio-button value="runTime">时长</a-radio-button>
                    <a-radio-button value="cnt">次数</a-radio-button>
                  </a-radio-group>
                </div>
                <div v-show="indexbotDayre === true">
                  <div id="container"></div>
                </div>
                <div v-show="indexbotDayre === false">
                  <template>
                    <div class="bt"></div>
                    <a-empty />
                  </template>
                </div>
              </div>
              <!-- <div class="application_right">
                <div class="application_title">
                  <h1>{{ Changer }}</h1>
                  <a-radio-group defaultValue="runTime" @change="onChanger">
                    <a-radio-button value="runTime">时长</a-radio-button>
                    <a-radio-button value="cnt">次数</a-radio-button>
                  </a-radio-group>
                </div>
                <div v-show="indexrobotre">
                  <div id="contDonut"></div>
                </div>
                <div v-show="!indexrobotre">
                  <template>
                    <div class="bt"></div>
                    <a-empty />
                  </template>
                </div>
              </div> -->
            </div>
          </a-card>
        </a-col>
      </a-row>
      <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '24px' }">
        <div class="account">
          <div class="account_title">
            <h1>获取明细</h1>
          </div>
          <div style="padding:0 24px;">
            <a-table
              :row-key="record => record.uuid"
              :columns="columns"
              :data-source="UserList"
              :pagination="pagination"
              :loading="loading"
              @change="handleTableChange"
            >
            </a-table>
          </div>
        </div>
      </a-col>
      <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '24px' }">
        <div class="account">
          <div class="account_title">
            <h1>使用记录</h1>
          </div>
          <div style="padding:0 24px;">
            <a-table
              :row-key="record => record.uuid"
              :columns="columnss"
              :data-source="RecordList"
              :pagination="paginations"
              :loading="loadings"
              @change="handleTableChanges"
            >
              <template slot="action" slot-scope="text, record">
                <a class="ant-dropdown-link" v-if="record.remark" @click="showDrawer(record.remark)" style="color: #2488e5;">查看</a>
                <p v-else>-</p>
              </template>
            </a-table>
          </div>
        </div>
      </a-col>
    </div>
    <div class="detail_rule" v-show="tabActiveKey === 'rule'" v-html="detail.instruction">暂无内容</div>
    <!-- actions -->
    <a-drawer
      title="异常日志"
      placement="right"
      width="320"
      :closable="false"
      :visible="hovVisible"
      @close="onClose"
    >
      <p>{{ drawers }}</p>
    </a-drawer>
  </page-header-wrapper>
</template>
<script>
import { baseMixin } from '@/store/app-mixin'
import countTo from 'vue-count-to'
import { Area, Donut } from '@antv/g2plot'
import { robotDetailBO, robotDay, robotTop, queryRobotUseUserList, queryRobotUseRecordList, robotSummaryData } from '@/api/user'
// 数据详情
const columns = [
  {
    title: '姓名',
    dataIndex: 'enterpriseUserName',
    width: '33%'
  },
  {
    title: '账号',
    dataIndex: 'userName',
    width: '33%'
  },
  {
    title: '获取时间',
    dataIndex: 'updateTime',
    width: '33%'
  }
]
// 使用记录
const columnss = [
  {
    title: '使用账号',
    dataIndex: 'userName'
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
    title: '运行时长(秒)',
    dataIndex: 'seconds'
  }
  // {
  //   title: '运行结果',
  //   dataIndex: 'statusName'
  // },
  // {
  //   title: '结束备注',
  //   dataIndex: 'remark',
  //   scopedSlots: { customRender: 'action' }
  // }
]
const data = [
  {
    用户名: '7866',
    运行时长: 0
  },
  {
    用户名: '7867',
    运行时长: 0
  },
  {
    用户名: '7868',
    运行时长: 0
  },
  {
    用户名: '7869',
    运行时长: 0
  },
  {
    用户名: '7870',
    运行时长: 0
  }
]
export default {
  components: {
    countTo
  },
  name: 'Detail',
  mixins: [baseMixin],
  data () {
    return {
      tabList: [
        { key: 'detail', tab: '总览' },
        { key: 'rule', tab: '使用说明' }
      ],
      rgbjson: ['#eb5757', '#f2994a', '#f2c94c', '#27ae60', '#219653', '#2f80ed', '#2d9cdb', '#56ccf2', '#bb6bd9'],
      rebhover: '',
      loading: false,
      loadings: false,
      loadingindex: false,
      detail: [],
      hovVisible: false,
      drawers: '',
      Changel: '',
      Changer: '',
      cntData: [],
      runTimeData: [],
      tabActiveKey: 'detail',
      enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
      indexbotDay: 'runTime',
      indexbotDayre: true,
      indexrobotTop: 'runTime',
      indexrobotre: true,
      UserList: [],
      RecordList: [],
      postData: {
        enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
        robotUuid: this.$route.query.robotUuid,
        page: 1,
        size: 10
      },
      postDatas: {
        enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
        robotUuid: this.$route.query.robotUuid,
        page: 1,
        size: 10
      },
      columns,
      columnss,
      pagination: {
        showQuickJumper: true
      },
      paginations: {
        showQuickJumper: true
      },
      dayUser: {
        enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
        robotUuid: this.$route.query.robotUuid,
        days: '7'
      },
      robotSummaryDatalist: [],
      data,
      painquan: null,
      painTOP: null
    }
  },
  filters: {
  },
  mounted () {
    this.ans()
    // this.dons()
    this.getrobotDetailBO()
    this.getrobotDay('runTime')
    // this.getrobotTop('runTime')
    this.getqueryRobotUseUserList(this.postData)
    this.getqueryRobotUseRecordList(this.postDatas)
    this.getrobotSummaryData(this.dayUser)
    this.$spm('o.c.1')
  },
  methods: {
    // 抽屉
    showDrawer (e) {
      this.drawers = e
      this.hovVisible = true
    },
    onClose () {
      this.hovVisible = false
    },
    // 点击切换积累数据
    onChangers (e) {
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
      this.getrobotDay(this.indexrobotTop)
      // this.getrobotTop(this.indexrobotTop)
      this.getrobotSummaryData(this.dayUser)
    },
    // 积累数据
    getrobotSummaryData (data) {
      this.loadingindex = true
      robotSummaryData(data).then(res => {
        if (res.code === 200) {
          this.robotSummaryDatalist = res.data
          this.loadingindex = false
        }
      })
    },
    // 点击切换次数时长
    onChangel (e) {
      this.indextext = 1
      if (e.target.value === 'cnt') {
        this.indexbotDay = 'cnt'
      } else {
        this.indexbotDay = 'runTime'
      }
      this.getrobotDay(this.indexbotDay)
    },
    // onChanger (e) {
    //   if (e.target.value === 'cnt') {
    //     this.indexrobotTop = 'cnt'
    //   } else {
    //     this.indexrobotTop = 'runTime'
    //   }
    //   this.getrobotTop(this.indexrobotTop)
    // },
    // 面积图接口
    getrobotDay (text) {
      this.indexrobotTop = text
      const data = {
        days: this.dayUser.days,
        robotUuid: this.$route.query.robotUuid,
        enterpriseUuid: this.enterpriseUuid,
        field: text
      }
      robotDay(data).then(res => {
        if (res.code === 200) {
          this.Changel = res.data.chartTitle
          if (res.data.dataRows.length === 0) {
            this.indexbotDayre = false
          } else {
            this.indexbotDayre = true
            this.cntData = res.data.dataRows
            if (text === 'cnt') {
              this.painquan.updateConfig({
                data: res.data.dataRows,
                meta: {
                  时间: {
                    range: [0, 1]
                  },
                  运行次数: {
                    alias: '次数',
                    formatter: (v) => { return `${v}` }
                  }
                },
                lineDash: 'number',
                color: ['#FF7F86'],
                xField: '时间',
                yField: '运行次数'
              })
              this.painquan.render()
            } else {
              this.painquan.updateConfig({
                data: res.data.dataRows,
                meta: {
                  时间: {
                    range: [0, 1]
                  },
                  运行时长: {
                    alias: '时长(小时)',
                    formatter: (v) => { return `${v}` }
                  }
                },
                lineDash: 'number',
                color: ['#FF7F86'],
                xField: '时间',
                yField: '运行时长'
              })
              this.painquan.render()
            }
          }
        }
      })
    },
    // 饼图接口
    getrobotTop (text) {
      const data = {
        days: this.dayUser.days,
        robotUuid: this.$route.query.robotUuid,
        enterpriseUuid: this.enterpriseUuid,
        field: text
      }
      robotTop(data).then(res => {
        if (res.code === 200) {
          this.Changer = res.data.chartTitle
          if (res.data.dataRows.length === 0) {
            this.indexrobotre = false
          } else {
            this.indexrobotre = true
            this.runTimeData = res.data.dataRows
            if (text === 'cnt') {
              this.painTOP.updateConfig({
                data: res.data.dataRows,
                colorField: '用户名',
                angleField: '运行次数',
                statistic: {
                  visible: true,
                  totalLabel: '总次数'
                }
              })
              this.painTOP.render()
            } else {
              this.painTOP.updateConfig({
                data: res.data.dataRows,
                colorField: '用户名',
                angleField: '运行时长',
                meta: {
                  运行时长: {
                    alias: '数量',
                    formatter: (v) => { return `${v.toFixed(2)}` }
                  }
                },
                statistic: {
                  visible: true,
                  totalLabel: '总时长(小时)'
                }
              })
              this.painTOP.render()
            }
          }
        }
      })
    },
    // 面积图
    ans () {
      const areaPlot = new Area(document.getElementById('container'), {
        forceFit: true,
        height: 300,
        meta: {
          时间: {
            range: [0, 1]
          },
          运行次数: {
            alias: '数量',
            formatter: (v) => { return `${v}` }
          }
        },
        yAxis: {
          min: 0
        },
        lineDash: 'number',
        color: ['#FF7F86'],
        xField: '时间',
        yField: '运行次数',
        smooth: true,
        xAxis: {
          type: 'dateTime',
          tickCount: 5
        }
      })
      areaPlot.render()
      this.painquan = areaPlot
    },
    // 饼图
    dons () {
      const donutPlot = new Donut(document.getElementById('contDonut'), {
        data,
        forceFit: true,
        radius: 1,
        innerRadius: 0.75,
        padding: 'auto',
        height: 300,
        colorField: '用户名',
        angleField: '运行时长',
        label: {
          visible: false
        },
        legend: {
          visible: true,
          position: 'right-center',
          text: {
            style: {
              fontSize: 14
            }
          }
        },
        statistic: {
          visible: true,
          totalLabel: '总次数'
        }
      })
      donutPlot.render()
      this.painTOP = donutPlot
    },
    // tab切换
    handleTabChange (key) {
      this.tabActiveKey = key
    },
    // 获取基本信息
    getrobotDetailBO () {
      const data = {
        robotUuid: this.$route.query.robotUuid,
        enterpriseUuid: this.enterpriseUuid
      }
      robotDetailBO(data).then(res => {
        if (res.code === 200) {
          this.detail = res.data
          this.mapLast()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 获取明细列表
    getqueryRobotUseUserList (data) {
      this.loading = true
      queryRobotUseUserList(data).then(res => {
        if (res.code === 200) {
          const pagination = { ...this.pagination }
          pagination.total = res.page.total
          pagination.current = res.page.page
          this.loading = false
          this.UserList = res.data
          this.pagination = pagination
        } else {
          this.loading = false
          this.UserList = []
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
      this.getqueryRobotUseUserList(this.postData)
    },
    // 使用记录
    getqueryRobotUseRecordList (data) {
      this.loadings = true
      queryRobotUseRecordList(data).then(res => {
        if (res.code === 200) {
          const pagination = { ...this.paginations }
          pagination.total = res.page.total
          pagination.current = res.page.page
          this.loadings = false
          this.RecordList = res.data
          this.paginations = pagination
        } else {
          this.loading = false
          this.RecordList = []
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
    handleTableChanges (pagination, filters, sorter) {
      const pager = { ...this.paginations }
      pager.current = pagination.current
      this.paginations = pager
      this.postDatas.page = pager.current
      this.getqueryRobotUseRecordList(this.postDatas)
    },
    // 唤起客户端
    robot (test, robotUuid) {
      console.log('ShadowBot:' + test + '?robot-uuid=' + this.$route.query.robotUuid + '&version-uuid=' + robotUuid)
      window.location.href = 'ShadowBot:' + test + '?robot-uuid=' + this.$route.query.robotUuid + '&version-uuid=' + robotUuid
    },
    // 右侧头像
    mapLast (res) {
      const rgb = this.detail.name.charCodeAt() % 9
      this.rebhover = this.rgbjson[rgb]
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/.ant-page-header-heading-title{
    width:80%;
  }
  /deep/.ring-guide-name{
    color: rgba(0, 0, 0, 0.45);
  }
  /deep/.ring-guide-value{
    color: rgba(0, 0, 0, 0.85) !important;
    font-size: 20px !important;
    margin-top: 20px;
  }
  /deep/.ant-empty{
    margin-top: 50px;
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
  .application_detail{
    margin-top: 20px;
    .application_detailimg{
      float: left;
      img{
        width: 64px;
        height: 64px;
        border-radius: 50%;
      }
    }
    .application_detailright{
      float: left;
      margin-left: 20px;
      h2{
        font-size:20px;
        font-family:Microsoft YaHei;
        font-weight:bold;
        color:rgba(40,40,40,1);
        margin-bottom: 0;
      }
      span{
        font-size:14px;
        font-family:Microsoft YaHei;
        font-weight:400;
        color:rgba(38,38,38,1);
      }
    }
  }
  .client_top_img{
    width: 64px;
    height: 64px;
    line-height: 64px;
    text-align: center;
    color: #fff;
    border-radius: 50%;
  }
  .detail_rule{
    background: #fff;
    padding: 24px;
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
  .application{
    div{
      .application_title{
        height: 38px;
      h1{
        font-size:14px;
        font-family:Microsoft YaHei;
        font-weight:400;
        color:rgba(38,38,38,1);
        float: left;
        line-height: 32px;
        height: 32px;
        margin-right: 24px;
      }
      }
    }
    .application_left{
      width: 100%;
      float: left;
    }
    .application_right{
      width: 50%;
      float: left;
    }
  }
  #container, #contDonut{
    height: 300px;
  }
</style>
