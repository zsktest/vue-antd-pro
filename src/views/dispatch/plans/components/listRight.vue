<template>
  <div>
    <a-row :gutter="24">
      <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '24px' }">
        <div class="account">
          <div class="account_title">
            <a-input-search placeholder="输入计划名称" style="width: 200px;line-height:70px;" @search="handleInputsearch"/>
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
              <template slot="name" slot-scope="text, record">
                <a style="color: #2488e5;" @click="keyname(record)">{{ record.name }}</a>
              </template>
              <template slot="robot" slot-scope="text, record">
                <span>{{ record.robots[0].name }}</span>
                <a-popover placement="bottom" v-if="record.robots.length > 1">
                  <template slot="content">
                    <p v-for="(item, index) in record.robots" :key="index">{{ item.name }}</p>
                  </template>
                  <template slot="title">
                    <span>应用执行顺序</span>
                  </template>
                  <a-icon type="profile" style="margin-left:8px;"/>
                </a-popover>
              </template>
              <template slot="mode" slot-scope="text, record">
                {{ record.cronInterface.nextTime }}
                <a-popover trigger="click" placement="bottom">
                  <template slot="title">
                    <p class="pmode_title" v-if="record.cronInterface.type === 'minute'">每隔{{ record.cronInterface.minute }}分钟执行</p>
                    <p class="pmode_title" v-else-if="record.cronInterface.type === 'hour'">每间隔{{ record.cronInterface.hour }}个小时,在第{{ record.cronInterface.minute }}分钟执行</p>
                    <p class="pmode_title" v-else-if="record.cronInterface.type === 'day'">每天的{{ record.cronInterface.hour }}时{{ record.cronInterface.minute }}分执行</p>
                    <p class="pmode_title" v-else-if="record.cronInterface.type === 'week'">每<span v-if="record.cronInterface.dayOfWeeks !== 'undefind' && record.cronInterface.dayOfWeeks.length ==0">天</span>
                      <span v-if="record.cronInterface.dayOfWeeks !== 'undefind' && record.cronInterface.dayOfWeeks.length > 0">
                        <span v-for="(item,index) in record.cronInterface.dayOfWeeks" :key="index">
                          <span v-if="item === 2">周一</span>
                          <span v-if="item === 3">周二</span>
                          <span v-if="item === 4">周三</span>
                          <span v-if="item === 5">周四</span>
                          <span v-if="item === 6">周五</span>
                          <span v-if="item === 7">周六</span>
                          <span v-if="item === 1">周日</span>
                          、
                        </span>
                      </span>
                      <span class="backgrouns" v-if="record.cronInterface.dayOfWeeks !== 'undefind' && record.cronInterface.dayOfWeeks.length > 0">{{ record.cronInterface.hour }}时{{ record.cronInterface.minute }}分执行</span>
                      <span v-if="record.cronInterface.dayOfWeeks !== 'undefind' && record.cronInterface.dayOfWeeks.length < 1">{{ record.cronInterface.hour }}时{{ record.cronInterface.minute }}分执行</span>
                    </p>
                    <p class="pmode_title" v-else-if="record.cronInterface.type === 'month'">{{ record.cronInterface.month }}月的每<span v-if="record.cronInterface.dayOfWeeks !== 'undefind' && record.cronInterface.dayOfWeeks.length ==0">一天</span>
                      <span v-if="record.cronInterface.dayOfWeeks !== 'undefind' && record.cronInterface.dayOfWeeks.length > 0">
                        <span v-for="(item,index) in record.cronInterface.dayOfWeeks" :key="index">
                          <span v-if="item === 2">周一</span>
                          <span v-if="item === 3">周二</span>
                          <span v-if="item === 4">周三</span>
                          <span v-if="item === 5">周四</span>
                          <span v-if="item === 6">周五</span>
                          <span v-if="item === 7">周六</span>
                          <span v-if="item === 1">周日</span>
                          、
                        </span>
                      </span>
                      <span class="backgrouns" v-if="record.cronInterface.dayOfWeeks !== 'undefind' && record.cronInterface.dayOfWeeks.length > 0">{{ record.cronInterface.hour }}时{{ record.cronInterface.minute }}分执行</span>
                      <span v-if="record.cronInterface.dayOfWeeks !== 'undefind' && record.cronInterface.dayOfWeeks.length < 1">{{ record.cronInterface.hour }}时{{ record.cronInterface.minute }}分执行</span>
                    </p>
                    <p class="pmode_title" v-else-if="record.cronInterface.type === 'cron'">用户自定义，鼠标点击查看下次运行时间</p>
                    <p class="pmode_title" v-else-if="record.cronInterface.type === 'timer'">{{ record.cronInterface.time }}</p>
                  </template>
                  <template slot="content">
                    <p v-for="(item,index) in compopover" :key="index">{{ item }}</p>
                    <p>...</p>
                  </template>
                  <a-icon type="history" class="exclamation" @click="postinterfaceMode(record)"/>
                </a-popover>
              </template>
              <template slot="operation" slot-scope="text, record">
                {{ record.executeScopeName }}
                <a-popover title="机器人名称" trigger="click" placement="bottom">
                  <template slot="content">
                    <p v-for="(item,index) in robotListName" :key="index">
                      {{ item.robotClientName }}
                      <a-tag color="blue" v-if="item.status === 'running' || item.status === 'allocated'">
                        {{ item.statusName }}
                      </a-tag>
                      <a-tag color="green" v-else-if="item.status === 'idle'">
                        {{ item.statusName }}
                      </a-tag>
                      <a-tag v-else-if="item.status === 'abnormal'">
                        {{ item.statusName }}
                      </a-tag>
                      <a-tag v-else-if="item.status === 'offline'">
                        {{ item.statusName }}
                      </a-tag>
                      <a-tag v-else>
                        {{ item.statusName }}
                      </a-tag>
                    </p>
                  </template>
                  <a-icon type="exclamation-circle" class="exclamation" @click="executeScopeN(record)"/>
                </a-popover>
              </template>
              <template slot="action" slot-scope="text, record">
                <a-switch @change="onChange(record)" size="small" v-model="record.enabled" style="margin-right:10px;" />
                <span style="margin-right:10px;" @click="showModal(record)">
                  <a href="javascript:;">编辑</a>
                </span>
                <a-dropdown>
                  <a-icon type="ellipsis" style="margin-top:3px;color:#2488e5;font-size:16px;" />
                  <a-menu slot="overlay">
                    <a-menu-item @click="getmanualStart(record.uuid)">
                      <span style="margin-right:10px;"><a href="javascript:;">立即执行</a></span>
                    </a-menu-item>
                    <a-menu-item>
                      <a-popconfirm placement="top" ok-text="确定" cancel-text="取消" @confirm="getdelete(record)">
                        <template slot="title">
                          <p>提示</p>
                          <p>确认要删除计划'{{ record.name }}'?</p>
                        </template>
                        <a href="javascript:;">删除</a>
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </template>
            </a-table>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { scheduleList, interfacePreview, scheduleDelete, scheduleClientList, changeEnabledStatus, manualStart } from '@/api/user'
// 表格项
const columns = [
  {
    title: '计划名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '包含应用',
    dataIndex: 'robotName',
    scopedSlots: { customRender: 'robot' }
  },
  {
    title: '执行时间',
    dataIndex: '',
    scopedSlots: { customRender: 'mode' }
  },
  {
    title: '执行方式',
    dataIndex: 'phone',
    scopedSlots: { customRender: 'operation' }
  },
  // {
  //   title: '优先级',
  //   dataIndex: 'priorityName'
  // },
  {
    title: '操作',
    dataIndex: '',
    width: '14%',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: [ 'partInfo' ],
  data () {
    return {
      visible: false,
      enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
      loading: false,
      pagination: {
        showQuickJumper: true
      },
      listData: [],
      columns,
      postData: {
        enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
        userUuid: '',
        groupInfoUuid: '',
        key: '',
        page: this.partInfo || 1,
        size: 10
      },
      compopover: [],
      uuid: '',
      robotListName: []
      // gage: this.$route.query.page
    }
  },
  mounted () {
    this.accountUsery(this.postData)
  },
  methods: {
    // 手动触发执行
    getmanualStart (uuid) {
      const data = {
        scheduleUuid: uuid
      }
      manualStart(data).then(res => {
        if (res.code === 200) {
          this.$message.success('该计划已添加到任务列表')
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 计划名称点击跳转
    keyname (key) {
      this.$emit('callBackInfo', key)
    },
    // 点击切换默认市场
    onChange (checked) {
      const data = {
        enabled: checked.enabled,
        scheduleUuid: checked.uuid
      }
      const _this = this
      if (checked.enabled) {
          _this.$confirm({
          title: '提示',
          content: '确认开启?',
          onOk () {
            changeEnabledStatus(data).then(res => {
              if (res.code === 200) {
                _this.defaults = false
                _this.accountUsery(_this.postData)
              } else {
                _this.$message.warning(res.msg)
              }
            })
          },
          onCancel () {
            _this.accountUsery(_this.postData)
          }
        })
      } else {
          _this.$confirm({
          title: '提示',
          content: '确认关闭?',
          onOk () {
            changeEnabledStatus(data).then(res => {
              if (res.code === 200) {
                _this.defaults = true
                _this.accountUsery(_this.postData)
              } else {
                _this.$message.warning(res.msg)
              }
            })
          },
          onCancel () {
            _this.accountUsery(_this.postData)
          }
        })
      }
    },
    // 搜索
    handleInputsearch (value, event) {
      this.postData.key = value
      this.postData.page = 1
      this.accountUsery(this.postData)
    },
    // 获取列表
    accountUsery (data) {
      this.loading = true
      scheduleList(data).then(res => {
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
      this.$router.push({ query: {} })
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.postData.page = pager.current
      this.accountUsery(this.postData)
    },
    // 添加成员
    showModal (last) {
      this.$router.push({
        path: '/plans/add',
        query: {
          uuid: last.uuid,
          page: this.postData.page
        }
      })
    },
    // 修改用户接口
    getupdateUser (data, form) {
    },
    postinterfaceMode (e) {
      const data = {
        'cronExpress': e.cronInterface.cronExpress,
        'dayOfWeeks': e.cronInterface.dayOfWeeks,
        'hour': e.cronInterface.hour,
        'minute': e.cronInterface.minute,
        'month': e.cronInterface.month,
        'time': e.cronInterface.time,
        'type': e.cronInterface.type
      }
      interfacePreview(data).then(res => {
        if (res.code === 200) {
          this.compopover = res.data
        } else {
          this.compopover = []
          this.$message.warning(res.msg)
        }
      })
    },
    // 删除
    getdelete (list) {
      const data = {
        enterpriseUuid: this.enterpriseUuid,
        scheduleUuid: list.uuid
      }
      scheduleDelete(data).then(res => {
        if (res.code === 200) {
          this.delDelete = false
          this.visible = false
          this.$message.success('删除成功')
          this.accountUsery(this.postData)
        } else {
          this.delDelete = false
          this.visible = false
          this.$message.warning(res.msg)
        }
      })
    },
    executeScopeN (list) {
      const data = {
        enterpriseUuid: this.enterpriseUuid,
        scheduleUuid: list.uuid
      }
      scheduleClientList(data).then(res => {
        if (res.code === 200) {
          this.robotListName = res.data
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-dropdown-menu-item span a{
  color:rgba(0,0,0,0.65);
}
/deep/ .ant-form-item{
  margin-bottom: 10px;
}
p{
  margin: 0;
}
.exclamation{
  margin-left:4px;
  opacity: 0.55;
  transition: all .3s;
  &:hover{
    opacity: 1;
  }
}
.account{
  background: #fff;
  .account_title{
    height: 70px;
    position: relative;
    padding: 0 24px;
    &:before{
      content: none;
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
</style>
