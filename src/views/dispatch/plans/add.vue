<template>
  <div>
    <a-breadcrumb>
      <a-breadcrumb-item><a href="javascript:;" @click="showlist()">计划列表</a></a-breadcrumb-item>
      <a-breadcrumb-item>新建计划</a-breadcrumb-item>
    </a-breadcrumb>
    <h1 class="top_title">新建计划</h1>
    <a-row :gutter="24">
      <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '24px' }">
        <div class="account">
          <a-form-model
            ref="ruleForm"
            :model="form"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :centered="true"
            style="width:500px;"
          >
            <a-form-model-item ref="name" label="计划名称" prop="name">
              <a-input v-model="form.name" placeholder="请输入计划名称"/>
            </a-form-model-item>
            <a-form-model-item ref="account" label="包含应用" prop="account">
              <div style="float: right;margin-top: -40px;" v-show="showdelivery">
                <a-tooltip>
                  出错后继续执行
                  <a-switch size="small" @change="errorProcessChange" v-model="form.delivery" />
                </a-tooltip>
              </div>
              <div class="addlist">
                <ul>
                  <draggable class="wrapper" v-model="gedlist">
                    <transition-group type="transition" :name="'flip-list'">
                      <li
                        class="list-group-item"
                        v-for="item in gedlist"
                        :key="item.address">
                        <div class="icons"><a-icon type="more" /><a-icon type="more" style="margin-left: -8px;" /></div>
                        <div class="coms">
                          <img v-if="item.robotIcon" :src="item.robotIcon">
                          <span v-else :style="{background: item.rgb}">{{ item.robotName.substring(0,1) }}</span>
                          {{ item.robotName }}
                        </div>
                        <a-icon class="close" type="close" @click="handleControlDelete(item, item.address)" />
                      </li>
                    </transition-group>
                  </draggable>
                </ul>
              </div>
              <div class="add_app">
                <div class="appbot" @click="appshowplus"><a-icon type="plus" />添加应用</div>
                <div class="applist" v-if="appshow">
                  <div style="padding: 10px 16px;">
                    <a-input-search placeholder="搜索" @search="onSearch" />
                  </div>
                  <div class="appcom">
                    <a-list
                      class="demo-loadmore-list"
                      :loading="loading"
                      :data-source="dataSource">
                      <a-list-item slot="renderItem" @click="listadd(item)" slot-scope="item">
                        <img v-if="item.robotIcon" :src="item.robotIcon" alt="">
                        <span v-else :style="{background: item.rgb}">{{ item.robotName.substring(0,1) }}</span>
                        {{ item.robotName }}
                      </a-list-item>
                    </a-list>
                  </div>
                </div>
              </div>
            </a-form-model-item>
            <!-- <a-form-model-item label="优先级" prop="role">
              <a-tooltip placement="right" title="多个计划，在同一个机器人中，执行时间相同，高优先级的计划优先执行">
                <a-icon type="question-circle-o" style="float: left;position: absolute;top: -30px;left: 59px;" />
              </a-tooltip>
              <a-select v-model="form.role" placeholder="请选择优先级">
                <a-select-option value="high">
                  高
                </a-select-option>
                <a-select-option value="middle">
                  中
                </a-select-option>
                <a-select-option value="low">
                  低
                </a-select-option>
              </a-select>
            </a-form-model-item> -->
            <a-form-model-item ref="robotClientUuids" label="执行计划机器人" prop="robotClientUuids">
              <div class="acconut_right" @click="acconutYo"><img :src="icon1" width="16" height="16" alt="图标">选择机器人</div><span class="acconut_span">已选(<em>{{ `${checkedList.length}` }}</em>/{{ clientPage.total }})</span>
              <a-modal
                v-model="choicerobot"
                width="740px"
                :maskClosable="false"
                :closable="false"
                ok-text="确认"
                cancel-text="取消"
                @cancel="robotcan"
                @ok="robotQue">
                <div class="title">执行计划机器人<h1><em>!</em>机器上安装的影刀客户端要事先设置成【机器人模式】，才会在此显示</h1></div>
                <div class="modelConsts">
                  <div class="account_bottom">
                    <a-input-search placeholder="输入机器人账号" v-model="handleInputVal" class="account_input" @search="handleInputsearch"/>
                    <a-table
                      :row-key="record => record.uuid"
                      :row-selection="{ selectedRowKeys: robotListName, onChange: onSelectItemChange }"
                      :columns="addcolumns"
                      :data-source="clientListn"
                      :pagination="false"
                      :loading="loading"
                      @change="handleTableChange"
                    >
                      <template slot="operation" slot-scope="text, record">
                        <a-tag color="blue" v-if="record.status === 'running' || record.status === 'allocated'">
                          {{ record.statusName }}
                        </a-tag>
                        <a-tag color="green" v-else-if="record.status === 'idle'">
                          {{ record.statusName }}
                        </a-tag>
                        <a-tag v-else-if="record.status === 'abnormal'">
                          {{ record.statusName }}
                        </a-tag>
                        <a-tag v-else-if="record.status === 'offline'">
                          {{ record.statusName }}
                        </a-tag>
                        <a-tag v-else>
                          {{ record.statusName }}
                        </a-tag>
                      </template>
                    </a-table>
                  </div>
                  <div class="account_right">
                    <div class="title">已选：{{ `${robotListName.length}` }}个</div>
                    <div>
                      <ul>
                        <li v-for="(item, index) in robotListhome" :key="index">
                          <span>{{ item.robotClientName }}</span>
                          <a-icon type="close" @click="robotdel(item, item.uuid)" />
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </a-modal>

            </a-form-model-item>
            <a-form-model-item label="执行方式" prop="operation">
              <a-radio-group v-model="form.operation">
                <a-radio value="any">随机一台执行</a-radio>
                <a-radio value="all">全部机器人执行</a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="执行时间" prop="timename">
              <a-radio-group v-model="form.timename" @change="timenameChange">
                <a-radio value="period">重复执行</a-radio>
                <a-radio value="timer">定时执行</a-radio>
              </a-radio-group>
            </a-form-model-item>
            <div v-show="form.timename === 'period'">
              <a-form-model-item label="重复周期" prop="frequency">
                <a-radio-group v-model="form.frequency" @change="gronsChange">
                  <a-radio value="minute">每分</a-radio>
                  <a-radio value="hour">每时</a-radio>
                  <a-radio value="day">每天</a-radio>
                  <a-radio value="week">每周</a-radio>
                  <a-radio value="month">月份</a-radio>
                  <a-radio value="cron">高级</a-radio>
                </a-radio-group>
              </a-form-model-item>
              <a-form-model-item label="月份" v-show="form.frequency === 'month'">
                <a-input-number :min="1" :max="12" :value="form.month" @change="monthChange" style="width:200px" />
              </a-form-model-item>
              <a-form-model-item label="" v-show="form.frequency === 'week' || form.frequency === 'month'">
                <a-checkbox-group v-model="form.type" :options="options" :default-value="form.type" @change="checkboxChange" />
              </a-form-model-item>
              <a-form-model-item label="时间表达式" v-show="form.frequency === 'cron'">
                <a-input v-model="form.expression" placeholder="请输入时间表达式" :max-length="40" @blur="expressionChange"/>
                <p>提示：可通过Crontab表达式定制更高级的计划周期，查看<a style="color:#2488e5;" target="_blank" href="https://www.yuque.com/docs/share/5b3e508b-b357-4bb0-8898-fc93fe1fbd1d?#">教程</a></p>
              </a-form-model-item>
              <div class="tims hour" v-show="form.frequency === 'hour' || form.frequency === 'day' || form.frequency === 'week' || form.frequency === 'month'"><span>小时：</span><a-input-number :min="tims.hourMin" :max="tims.hourMax" :value="form.hour" @change="hourChange" style="margin-right:10px" /></div>
              <div class="tims minute" v-show="form.frequency === 'minute' || form.frequency === 'hour' || form.frequency === 'day' || form.frequency === 'week' || form.frequency === 'month'"><span>分钟：</span><a-input-number :min="tims.minuteMin" :max="tims.minuteMax" :value="form.minute" @change="minuteChange" /></div>
            </div>
            <div class="bt"></div>
            <div v-show="form.timename === 'timer'">
              <a-form-model-item label="选择时间" required>
                <a-date-picker
                  v-model="form.time"
                  format="YYYY-MM-DD HH:mm:ss"
                  :disabled-date="disabledDate"
                  show-time
                  type="time"
                  placeholder="请选择时间"
                  style="width: 100%;"
                />
              </a-form-model-item>
            </div>
          </a-form-model>
          <div class="form_bottom" v-show="form.frequency !== 'timer'">
            <a-icon type="history" />
            <a-popover title="提示" placement="bottom" trigger="click">
              <template slot="content">
                <p v-for="(item,index) in compopover" :key="index">{{ item }}</p>
              </template>
              <div @click="postinterfacePreview" style="float: left;height: 30px;">
                <p v-show="form.frequency === 'minute'">每隔{{ form.minute }}分钟执行</p>
                <p v-show="form.frequency === 'hour'">每间隔{{ form.hour }}个小时,在第{{ form.minute }}分钟执行</p>
                <p v-show="form.frequency === 'day'">每天的{{ form.hour }}时{{ form.minute }}分执行</p>
                <p v-show="form.frequency === 'week'">每<span v-show="form.type.length ==0">天</span>
                  <span v-show="form.type.length > 0" v-for="(item,index) in form.type" :key="index">
                    <span v-show="item === 2">周一</span>
                    <span v-show="item === 3">周二</span>
                    <span v-show="item === 4">周三</span>
                    <span v-show="item === 5">周四</span>
                    <span v-show="item === 6">周五</span>
                    <span v-show="item === 7">周六</span>
                    <span v-show="item === 1">周日</span>
                    、
                  </span>
                  <span v-show="form.type.length > 0" style="margin-left: -23px;background: #FAFAFA;">{{ form.hour }}时{{ form.minute }}分执行</span>
                  <span v-show="form.type.length < 1">{{ form.hour }}时{{ form.minute }}分执行</span>
                </p>
                <p v-show="form.frequency === 'month'">{{ form.month }}月的每<span v-show="form.type.length ==0">一天</span>
                  <span v-show="form.type.length > 0" v-for="(item,index) in form.type" :key="index">
                    <span v-show="item === 2">周一</span>
                    <span v-show="item === 3">周二</span>
                    <span v-show="item === 4">周三</span>
                    <span v-show="item === 5">周四</span>
                    <span v-show="item === 6">周五</span>
                    <span v-show="item === 7">周六</span>
                    <span v-show="item === 1">周日</span>
                    、
                  </span>
                  <span v-show="form.type.length > 0" style="margin-left: -23px;background: #FAFAFA;">的{{ form.hour }}时{{ form.minute }}分执行</span>
                  <span v-show="form.type.length < 1">的{{ form.hour }}时{{ form.minute }}分执行</span>
                </p>
                <p v-show="form.frequency === 'cron'">{{ cronfrequency }}</p>
              </div>
            </a-popover>
          </div>
        </div>
      </a-col>
    </a-row>
    <div class="footer">
      <a-button type="primary" :loading="loadings" @click="handleOk">
        确定
      </a-button>
      <a-button @click="handleCancel">
        取消
      </a-button>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import draggable from 'vuedraggable'
import { robotSchedule, updateSchedule, enterpriseRobotList, clientList, interfacePreview, scheduleDetail } from '@/api/user'
const defaultCheckedList = []
const options = [
  { label: '周一', value: 2 },
  { label: '周二', value: 3 },
  { label: '周三', value: 4 },
  { label: '周四', value: 5 },
  { label: '周五', value: 6 },
  { label: '周六', value: 7 },
  { label: '周日', value: 1 }
]
const addcolumns = [
  {
    title: '账号名',
    dataIndex: 'robotClientName',
    width: '36%'
  },
  {
    title: '状态',
    dataIndex: 'createTime',
    key: 'createTime',
    scopedSlots: { customRender: 'operation' },
    slots: { title: 'createTime' },
    filters: [
      {
        text: '空闲',
        value: 'idle'
      },
      {
        text: '运行中',
        value: 'running'
      },
      {
        text: '离线',
        value: 'offline'
      }
    ],
    filterMultiple: false
  },
  {
    title: '主机IP',
    dataIndex: 'clientIp'
  }
]
// 表格项
const columns = [
  {
    title: '计划名称',
    dataIndex: 'name'
    // width: '20%'
  },
  {
    title: '应用',
    dataIndex: 'robotName'
  },
  {
    title: '执行方式',
    dataIndex: '',
    scopedSlots: { customRender: 'mode' }
  },
  {
    title: '运行模式',
    dataIndex: 'phone',
    scopedSlots: { customRender: 'operation' }
  },
  {
    title: '优先级',
    dataIndex: 'priorityName'
  },
  {
    title: '操作',
    dataIndex: '',
    width: '14%',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  components: { draggable },
  data () {
    return {
      rgbjson: ['#eb5757', '#f2994a', '#f2c94c', '#27ae60', '#219653', '#2f80ed', '#2d9cdb', '#56ccf2', '#bb6bd9'],
      rebhover: '',
      moment,
      options,
      appshow: false,
      gedlist: [],
      icon1: require('@/assets/img/robot.png'),
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      visible: false,
      enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
      loading: false,
      loadings: false,
      pagination: {
        showQuickJumper: true
      },
      userName: '',
      columns,
      addcolumns,
      action: 'create',
      showdelivery: false,
      form: {
        name: '',
        account: [],
        role: 'middle',
        delivery: false,
        errorProcess: 'stop',
        robotUuids: '',
        robotClientUuids: [],
        operation: 'any',
        timename: 'period',
        time: null,
        frequency: 'minute',
        hour: 1,
        minute: 1,
        month: 1,
        type: [],
        expression: ''
      },
      tims: {
        minuteMin: 1,
        minuteMax: 59,
        hourMin: 0,
        hourMax: 0
      },
      dataSource: [],
      clientListn: [],
      clientPage: '',
      handleInputVal: '',
      indeterminate: false,
      checkAll: false,
      plainOptions: [],
      checkedList: defaultCheckedList,
      choicerobot: false,
      clientListKey: {
        key: '',
        status: '',
        page: 1,
        simple: true,
        size: 100
      },
      cronfrequency: '无效的Crontab表达式',
      compopover: [],
      uuid: '',
      robotListName: [],
      robotListhome: [],
      rules: { // 判断
        name: [
          { required: true, message: '请输入计划名称', trigger: 'blur' },
          { max: 30, message: '计划名称不能超过30个字符', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请选择应用', trigger: 'blur' }
        ],
        robotClientUuids: [
          { required: true, message: '请最少选择一个机器人', trigger: 'blur' }
        ],
        // role: [
        //   { required: true, message: '请选择优先级', trigger: 'change' }
        // ],
        operation: [
          { required: true, message: '请选择运行模式', trigger: 'change' }
        ]
      },
      uuidDetail: this.$route.query.uuid,
      page: this.$route.query.page
    }
  },
  updated () {
    this.gedlist = this.gedlist
    if (this.gedlist.length >= 2) {
      this.showdelivery = true
    } else {
      this.showdelivery = false
    }
  },
  mounted () {
    this.getclientList(this.clientListKey)
    this.totalclientList()
    this.onSearch()
    this.showModal()
  },
  methods: {
    // 添加成员
    showModal () {
      if (this.uuidDetail === '' || this.uuidDetail === null || this.uuidDetail === undefined) {
        this.form = {
          name: '',
          account: [],
          role: 'middle',
          robotUuid: '',
          operation: 'any',
          robotClientUuids: [],
          timename: 'period',
          time: null,
          frequency: 'minute',
          hour: 1,
          minute: 1,
          month: 1,
          type: [],
          expression: ''
        }
        this.checkedList = []
        this.action = 'create'
      } else {
        const data = {
          scheduleUuid: this.uuidDetail
        }
        scheduleDetail(data).then(res => {
          if (res.code === 200) {
            const last = res.data
            this.action = 'edit'
            let tims = ''
            if (last.cronInterface.time === '' || last.cronInterface.time === undefined || last.cronInterface.time === null) {
              tims = null
            } else {
              tims = moment(last.cronInterface.time, 'YYYY-MM-DD HH:mm:ss')
            }
            this.checkedList = last.robotClients.map(item => {
              return item.uuid
            })
            this.robotListhome = last.robotClients
            this.robotListName = last.robotClients.map(item => {
              return item.uuid
            })
            this.tims = {
              minuteMin: 0,
              minuteMax: 59,
              hourMin: 0,
              hourMax: 23
            }
            if (last.errorProcess === 'continue') {
              this.form.delivery = true
            } else {
              this.form.delivery = false
            }
            this.form = {
              name: last.name,
              account: last.robotUuid,
              role: last.priority,
              errorProcess: last.errorProcess,
              robotUuids: last.robotUuid,
              operation: last.executeScope,
              timename: last.type,
              time: tims,
              delivery: this.form.delivery,
              robotClientUuids: last.robotClients,
              frequency: last.cronInterface.type,
              hour: last.cronInterface.hour,
              minute: last.cronInterface.minute,
              month: last.cronInterface.month,
              type: last.cronInterface.dayOfWeeks,
              expression: last.cronInterface.cronExpress
            }
            if (last.robots.length >= 2) {
              this.showdelivery = true
            } else {
            }
            this.gedlist = last.robots.map((item, index) => {
              const rgb = item.name.charCodeAt() % 9
              return { address: index, robotIcon: item.icon, robotName: item.name, robotUuid: item.uuid, rgb: this.rgbjson[rgb] }
            })
            this.uuid = last.uuid
          }
        })
      }
      this.visible = true
    },
    // 确定提交
    handleOk () {
      this.loadings = true
      this.form.account = this.gedlist.map((item, index) => {
        return item.robotUuid
      })
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const data = this.enterpriseUuid
          if (this.form.time === null) {
            this.form.time = null
          } else {
            this.form.time = moment(this.form.time).format('YYYY-MM-DD HH:mm:ss')
          }
          const forms = {
            cronInterface: {
              'cronExpress': this.form.expression,
              'dayOfWeeks': this.form.type,
              'hour': this.form.hour,
              'minute': this.form.minute,
              'month': this.form.month,
              'time': this.form.time,
              'type': this.form.frequency
            },
            description: '',
            enabled: true,
            errorProcess: this.form.errorProcess,
            enterpriseUuid: this.enterpriseUuid,
            executeScope: this.form.operation,
            name: this.form.name,
            priority: this.form.role,
            robotClientUuids: this.checkedList,
            robotUuids: this.form.account,
            scheduleType: this.form.timename,
            type: this.form.timename,
            scheduleUuid: this.uuid
          }
          // 注册提交接口
          if (this.action === 'create') {
            this.getrobotSchedule(data, forms) // 创建
          } else if (this.action === 'edit') {
            this.getupdateUser(data, forms) // 修改
          }
        } else {
          this.loadings = false
          return false
        }
      })
    },
    // 应用icons头像
    mapLast (res) {
      this.dataSource = res.map(item => {
        const rgb = item.robotName.charCodeAt() % 9
        item.rgb = this.rgbjson[rgb]
        return item
      })
    },
    // 取消创建
    handleCancel () {
      this.$router.push({
        path: '/plans/list',
        query: {
          page: this.page,
          key: 2
        }
      })
    },
    // 是否开启错误继续执行
    errorProcessChange (checked) {
      this.form.delivery = checked
      if (checked) {
        this.form.errorProcess = 'continue'
      } else {
        this.form.errorProcess = 'sotp'
      }
    },
    // 选择应用
    listadd (text) {
      if (this.gedlist.length > 49) {
        this.$message.warning('应用不能选择多于50个')
      } else {
        this.gedlist.push(text)
        this.gedlist = this.gedlist.map((item, index) => {
          return { address: index, robotIcon: item.robotIcon, robotName: item.robotName, robotUuid: item.robotUuid, rgb: item.rgb }
        })
      }
      this.appshow = false
    },
    // 删除已选择应用
    handleControlDelete (data, index) {
      this.deleteNode(this.gedlist, index)
    },
    deleteNode (data, id) {
      const newDatas = data.filter(el => el.address !== id)
      this.gedlist = newDatas
      return newDatas
    },
    // 搜索
    handleInputsearch (value) {
      this.clientListKey.key = value
      this.clientListKey.page = 1
      this.getclientList(this.clientListKey)
    },
    // 创建用户接口请求
    getrobotSchedule (data, form) {
      robotSchedule(data, form).then(res => {
        if (res.code === 200) {
          this.loadings = false
          this.visible = false
          this.$message.success('计划创建成功')
          this.$router.push({
            path: '/plans/list',
            query: {
              key: 2
            }
          })
        } else {
          this.loadings = false
          this.visible = false
          this.$message.warning(res.msg)
        }
      })
    },
    // 修改用户接口
    getupdateUser (data, form) {
      updateSchedule(data, form).then(res => {
        if (res.code === 200) {
          this.loadings = false
          this.visible = false
          this.$message.success('计划修改成功')
          this.$router.push({
            path: '/plans/list',
            query: {
              page: this.page,
              key: 2
            }
          })
        } else {
          this.loadings = false
          this.visible = false
          this.$message.warning(res.msg)
        }
      })
    },
    // 获取企业用户列表
    onSearch (val) {
      const data = {
        enterpriseUuid: this.enterpriseUuid,
        published: true,
        robotType: 'app',
        size: 50,
        robotName: val
      }
      enterpriseRobotList(data).then(res => {
        this.dataSource = res.data
        this.mapLast(res.data)
      })
    },
    // 时间加减
    hourChange (value) {
      this.number = {
        value
      }
      this.form.hour = value
    },
    minuteChange (value) {
      this.number = {
        value
      }
      this.form.minute = value
    },
    monthChange (value) {
      this.number = {
        value
      }
      this.form.month = value
    },
    // 执行时间
    timenameChange (e) {
      this.form.time = null
      if (e.target.value === 'timer') {
        this.form.frequency = 'timer'
      } else {
        this.form.frequency = 'minute'
      }
    },
    // 添加成员
    showlist () {
      this.$router.push({
        path: '/plans/list',
        query: {
          page: this.page
        }
      })
    },
    // 点击选择频率
    gronsChange (e) {
      switch (e.target.value) {
        case 'minute':
          this.form.minute = 1
          this.form.type = []
          this.tims = {
            minuteMin: 1,
            minuteMax: 59,
            hourMin: 0,
            hourMax: 0
          }
          break
        case 'hour':
          this.form.minute = 0
          this.form.hour = 1
          this.form.type = []
          this.tims = {
            minuteMin: 0,
            minuteMax: 59,
            hourMin: 1,
            hourMax: 23
          }
          break
        case 'day':
          this.form.minute = 0
          this.form.hour = 0
          this.form.type = []
          this.tims = {
            minuteMin: 0,
            minuteMax: 59,
            hourMin: 0,
            hourMax: 23
          }
          break
        case 'week':
          this.form.minute = 0
          this.form.hour = 0
          this.form.type = []
          this.tims = {
            minuteMin: 0,
            minuteMax: 59,
            hourMin: 0,
            hourMax: 23
          }
          break
        case 'month':
          this.form.minute = 0
          this.form.hour = 0
          this.form.type = []
          this.tims = {
            minuteMin: 0,
            minuteMax: 59,
            hourMin: 0,
            hourMax: 23
          }
          break
        case 'cron':
          this.form.minute = 0
          this.form.hour = 0
          this.tims = {
            minuteMin: 0,
            minuteMax: 0,
            hourMin: 0,
            hourMax: 0
          }
          break
        default:
          this.form.type = []
          this.tims = {
            minuteMin: 0,
            minuteMax: 0,
            hourMin: 0,
            hourMax: 0
          }
      }
    },
    checkboxChange (val) {
      this.form.type = val
    },
    // 获取机器人列表
    getclientList (data) {
      clientList(data).then(res => {
        if (res.code === 200) {
          this.clientListn = res.data
          // this.clientPage = res.page
          this.plainOptions = res.data.map(item => {
            this.plainOptions = item.uuid
            return item.uuid
          })
        }
      })
    },
    // 获取机器人总数
    totalclientList () {
      const data = {
        key: '',
        status: '',
        page: 1,
        simple: true,
        size: 1000
      }
      clientList(data).then(res => {
        if (res.code === 200) {
          this.clientPage = res.page
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
      if (!filters.createTime) {
        filters.createTime = []
      }
      this.clientListKey.status = filters.createTime[0] || filters.createTime
      this.getclientList(this.clientListKey)
      this.onSelectItemChange([], [])
    },
    // 选择机器人
    // onChange (checkedList, selectedRows) {
    //   console.log(checkedList)
    //   console.log(selectedRows)
    //   this.indeterminate = !!checkedList.length && checkedList.length < this.plainOptions.length
    //   this.checkAll = checkedList.length === this.plainOptions.length
    //   this.form.robotClientUuids = checkedList
    // },
    // onCheckAllChange (e) {
    //   Object.assign(this, {
    //     checkedList: e.target.checked ? this.plainOptions : [],
    //     indeterminate: false,
    //     checkAll: e.target.checked
    //   })
    //   this.form.robotClientUuids = this.checkedList
    // },
    // 删除已选择机器人
    robotdel (key, id) {
      const newDatas = this.robotListhome.filter(el => el.uuid !== id)
      const newkey = this.robotListName.filter(el => el !== id)
      this.robotListName = newkey
      this.robotListhome = newDatas
      return newDatas
    },
    // 默认列表&&全选
    onSelectItemChange (selectedRowKeys, selectedRows) {
      // this.checkedList = selectedRowKeys
      this.robotListName = selectedRowKeys
      this.robotListhome = selectedRows
    },
    robotQue () {
      this.checkedList = this.robotListName
      this.form.robotClientUuids = this.robotListName
      this.choicerobot = false
      this.totalclientList()
    },
    robotcan () {
      this.totalclientList()
      // this.checkedList = []
      // this.robotListhome = []
      this.choicerobot = false
    },
    acconutYo () {
      if (this.choicerobot) {
        this.choicerobot = false
      } else {
        this.choicerobot = true
        this.handleInputVal = ''
        this.handleInputsearch()
        this.getclientList(this.clientListKey)
      }
    },
    appshowplus () {
      if (this.appshow) {
        this.appshow = false
      } else {
        this.appshow = true
        this.robotName = ''
        this.onSearch()
      }
    },
    // 时间表达式
    expressionChange (e) {
      const data = {
        'cronExpress': this.form.expression,
        'dayOfWeeks': this.form.type,
        'hour': this.form.hour,
        'minute': this.form.minute,
        'month': this.form.month,
        'time': this.form.time,
        'type': this.form.frequency
      }
      interfacePreview(data).then(res => {
        if (res.code === 200) {
          this.cronfrequency = '开始运行时间：' + res.data[0]
        } else {
          this.cronfrequency = res.msg
        }
      })
    },
    // 点击查看corn表达式
    postinterfacePreview () {
      let timss = ''
      if (this.form.time === null) {
        this.form.time = null
      } else {
        timss = moment(this.form.time).format('YYYY-MM-DD HH:mm:ss')
      }
      const data = {
        'cronExpress': this.form.expression,
        'dayOfWeeks': this.form.type,
        'hour': this.form.hour,
        'minute': this.form.minute,
        'month': this.form.month,
        'time': timss,
        'type': this.form.frequency
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
    // 不可选择的时间
    disabledDate (current) {
      // Can not select days before today and today
      return current && current < moment().startOf('day')
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-form-item{
  margin-bottom: 16px;
}
/deep/ .ant-form-item-label{
  padding: 0 0 2px;
}
/deep/ .ant-table-thead > tr > th,/deep/ .ant-table-tbody > tr > td{
  padding: 4px 0;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}
/deep/ .ant-table-tbody > tr > td{
  padding: 4px 0;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  border: none;
}
/deep/ .ant-table-tbody > tr > td:first-child{
  padding: 4px 0;
  font-size: 12px;
  width: 20px;
  border: none;
}
/deep/ .ant-table-body{
  height: 378px;
  overflow-y: scroll;
  padding-right: 0;
  &::-webkit-scrollbar {display:none}
}
/deep/ .ant-table-placeholder{
  position: absolute;
  top: 50px;
  width: 100%;
  border: none;
}
// /deep/ .ant-table-thead > tr > th:first-child{
//   padding: 4px 0;
//   font-size: 12px;
//   width: 20px;
//   float: left;
//   border: none;
// }
.addlist{
  ul{
    list-style: none;
    margin: 0;
    padding: 0;
    li{
      height: 40px;
      background: rgba(0, 0, 0, 0.04);
      border-radius: 2px;
      .icons{
        float: left;
      }
      .coms{
        width: 86%;
        float: left;
        height: 32px;
        line-height: 30px;
        background: #FFFFFF;
        border-radius: 4px 2px 2px 4px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        margin: 4px 0 0 6px;
        padding-left: 10px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        img{
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }
        span{
          width: 18px;
          height: 18px;
          border-radius: 50%;
          float: left;
          background-color: #f87575;
          font-size: 12px;
          line-height: 18px;
          text-align: center;
          color: #fff;
          margin-right: 8px;
          margin-top: 6px;
        }
      }
      .close{
        float: right;
        margin: 13px;
        cursor: pointer;
      }
    }
  }
}
.add_app{
  position: relative;
  margin-top: 4px;
  .appbot{
    height: 32px;
    line-height: 32px;
    background: #FFFFFF;
    border-radius: 2px;
    opacity: 0.9;
    border: 1px dashed rgba(0, 0, 0, 0.15);
    color: rgba(0, 0, 0, 0.65);
    text-align: center;
    cursor: pointer;
    margin-bottom: 6px;
    i{
      color: #FF525B;
      margin-right: 4px;
    }
  }
  .applist{
    position: absolute;
    width: 100%;
    z-index: 12;
    max-height: 380px;
    background: #FFFFFF;
    box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  }
  .appcom{
    max-height: 320px;
    overflow: auto;
    padding-bottom: 10px;
    .ant-list-item{
      border: none;
      padding: 6px 0;
      cursor: pointer;
      padding-left: 32px;
      img{
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }
      span{
        width: 18px;
        height: 18px;
        border-radius: 50%;
        float: left;
        background-color: #f87575;
        font-size: 12px;
        line-height: 18px;
        text-align: center;
        color: #fff;
        margin-right: 8px;
      }
      &:hover{
        background: #F5F6F7;
      }
    }
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
  float: left;
  line-height: 32px;
  text-align: center;
  margin-top: 5px;
  transition: all .3s;
  img{
    float: left;
    margin: 7px 0px 0 10px;
  }
  &:hover{
    background: #FAFAFA;
  }
}
.acconut_span{
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #A6A6A6;
  line-height: 40px;
  float: left;
  margin-left: 17px;
  margin-top: 1px;
  em{
    color: #272727;
    font-style: normal;
  }
}
.tims{
  float: left;
  margin-bottom: 10px;
  span{
    float: left;
    text-align: right;
    color: rgba(0, 0, 0, 0.85);
    line-height: 40px;
  }
  .ant-input-number{
    width: 190px;
    margin-top: 5px;
  }
}
.minute{
  float: left;
}
.form_bottom{
  width: 500px;
  height: 60px;
  background: #FAFAFA;
  border-radius: 2px;
  i{
    float: left;
    margin: 22px 7px 22px 22px;
  }
  p{
    float: left;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #262626;
    line-height: 60px;
    margin: 0;
  }
}
.account_bottom{
  width: 428px;
  float: left;
  border-right: 1px solid #D9D9D9;
  .account_input{
    width: 396px;
    margin: 16px 0 10px 16px;
  }
  .robot_top{
    border-bottom: 1px solid #F0F0F0;
    display: flex;
    padding: 0 16px;
    label{
      fill: 0;
      width: 48%;
      line-height: 32px;
    }
    p{
      margin-bottom: 0;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #A6A6A6;
      flex: 1;
      line-height: 32px;
    }
  }
  .robot_con{
    height: 345px;
    overflow-y: scroll;
    padding-right: 8px;
    &::-webkit-scrollbar {display:none}
    .ant-checkbox-group{
      width: 100%;
    }
    ul{
      margin: 0;
      padding: 0;
      li{
        display: flex;
        line-height: 32px;
        padding: 0 0 0 16px;
        .svn_iv{
          fill: 0;
          width: 48%;
          span{
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #262626;
            margin-left: 8px;
          }
        }
        p{
          margin-bottom: 0;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #A6A6A6;
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        &:hover{
          background: #F8F8F8;
        }
      }
    }
  }
}
.account_right{
  margin-top: 20px;
  float: left;
  width: 262px;
  .title{
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    margin-left: 16px;
  }
  div{
    ul{
      margin: 0;
      padding: 0;
      margin-top: 10px;
      list-style: none;
      overflow-y: auto;
      height: 384px;
      li{
        line-height: 32px;
        padding: 0 0 0 16px;
        transition: all 0.3s;
        width: 100%;
        i{
          float: right;
          line-height: 32px;
          padding-top: 3px;
          box-sizing: border-box;
          height: 32px;
          overflow: hidden;
          margin-right: 15px;
          display: none;
          cursor: pointer;
        }
        &:hover{
          background: #F5F6F7;
          i{
            display: block;
          }
        }
      }
    }
  }
}
.robot_bottom{
  border-top: 1px solid #F0F0F0;
  padding: 0 16px;
  p{
    margin: 0;
    float: left;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #A6A6A6;
    cursor: pointer;
  }
  button{
    float: right;
    margin-left: 8px;
    margin-top: 8px;
  }
}
.top_title{
  font-size: 20px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-top: 8px;
}
.account{
  background: #fff;
  padding: 24px;
  margin-top: 12px;
  padding-bottom: 60px;
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
.title{
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  h1{
    font-size: 12px;
    font-weight: 400;
    color: #595959;
    line-height: 24px;
    display: inline-block;
    margin: 0;
    em{
      float: left;
      width: 14px;
      height: 14px;
      background: #FAAD14;
      border-radius: 50%;
      font-style: normal;
      text-align: center;
      font-size: 10px;
      line-height: 14px;
      color: #fff;
      margin: 5px 6px 0 13px;
    }
  }
}
.modelConsts{
  width: 692px;
  height: 438px;
  background: #FFFFFF;
  border-radius: 3px;
  border: 1px solid #D9D9D9;
  margin-top: 16px;
}
.ant-dropdown-menu-item:hover{
  background: #e6f7ff !important;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}
.footer{
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 64px;
  background: #FFFFFF;
  box-shadow: 0px -3px 6px -4px rgba(0, 0, 0, 0.12), 0px -6px 16px 0px rgba(0, 0, 0, 0.08), 0px -9px 28px 8px rgba(0, 0, 0, 0.05);
  border-radius: 0px 0px 0px 14px;
  left: 0;
  button{
    float: right;
    margin: 17px 8px 0 0;
    &.ant-btn-primary{
      margin-right: 24px;
    }
  }
}
</style>
