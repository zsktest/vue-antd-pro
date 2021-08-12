<template>
  <div>
    <a-row :gutter="24">
      <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '24px' }">
        <div class="constns">
          <div class="comleft" :style="{width: folding ? '0' : '260px'}">
            <div class="menufold" :class="folding ? 'foldalt' : ''" @click="comfold">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>{{ foldname }}</span>
                </template>
                <a-icon type="menu-fold" :class="folding ? 'menufoldrighs' : ''"/>
              </a-tooltip>
            </div>
            <a-input-search
              placeholder="请搜索计划名称"
              v-model="searchnval"
              allow-clear
              :style="{display: folding ? 'none' : 'block'}"
              style="width: 210px;line-height:70px;margin-left:24px;"
              @search="handleInputsearch"/>
            <div class="listUserycons">
              <ul>
                <li @click="lisyclis('')" :class="{alt:hover === ''}">
                  <img src="@/assets/img/icon_allplan.png" alt="">
                  <p>全部计划执行记录</p>
                </li>
                <li v-for="(item, index) in listUseryData" :key="index" @click="lisyclis(item, index)" :class="{alt:hover === index}">
                  <a-icon type="carry-out" />
                  <p>{{ item.name }}</p>
                </li>
              </ul>
              <div v-if="!loadmings">
                <a-spin v-if="loadingMore" style="margin-left: 120px;"/>
                <a-button style="margin-left:80px;" v-else @click="onLoadMore">加载更多</a-button>
              </div>
              <div v-else style="text-align: center;color: #c1c1c1;font-size: 12px;margin-top:8px;">——我也是有底线的——</div>
            </div>
          </div>
          <div class="comright">
            <div class="account">
              <div class="account_title">
                <h1>{{ titlename }}</h1>
                <!-- <div class="default_cha">
                  <a-radio-group defaultValue="1" @change="onChanger">
                    <a-radio-button value="1">全部</a-radio-button>
                    <a-radio-button value="running">运行中({{ instStatusCountnname.running }})</a-radio-button>
                    <a-radio-button value="waiting">等待中({{ instStatusCountnname.waiting }})</a-radio-button>
                    <a-radio-button value="finish">结束</a-radio-button>
                  </a-radio-group>
                </div> -->
              </div>
              <div style="padding:0 24px;">
                <a-table
                  :row-key="record => record.uuid"
                  :columns="columns"
                  :data-source="listData"
                  :pagination="pagination"
                  :loading="loading"
                  @change="handleTableChange">
                  <template slot="robot" slot-scope="text, record">
                    <span>{{ record.sceneName }}</span>
                    <a-popover placement="bottom">
                      <template slot="content">
                        <p v-for="(item, index) in record.robots" :key="index">{{ item.name }}</p>
                      </template>
                      <template slot="title">
                        <span>包含应用</span>
                      </template>
                      <a-icon type="profile" style="margin-left:8px;"/>
                    </a-popover>
                  </template>
                  <template slot="executeName" slot-scope="text, record">
                    {{ record.executeScopeName }}
                    <a-popover title="机器人名称" trigger="click" placement="bottom">
                      <template slot="content">
                        <p style="line-height:32px" v-for="(item,index) in robotListName" :key="index">
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
                  <template slot="time" slot-scope="text, record">
                    <span v-if="record.createTime">{{ record.createTime.substring(5,16) }}</span>
                    <span class="numbername" v-if="record.runTimes">第{{ record.runTimes }}次</span>
                  </template>
                  <template slot="state" slot-scope="text, record">
                    <a-tag color="green" v-if="record.status === 'waiting'">{{ record.statusName }}</a-tag>
                    <a-tag color="blue" v-else-if="record.status === 'running'">{{ record.statusName }}</a-tag>
                    <a-tag v-else-if="record.status === 'finish'">{{ record.statusName }}</a-tag>
                    <a-tag v-else-if="record.status === 'stopped'">{{ record.statusName }}</a-tag>
                    <a-tag color="red" v-else-if="record.status === 'error'">{{ record.statusName }}</a-tag>
                    <a-tag v-else>{{ record.statusName }}</a-tag>
                  </template>
                  <template slot="action" slot-scope="text, record">
                    <div v-for="item in record.actions" :key="item.name" style="float: left;">
                      <span style="margin-right:10px" v-if="!item.confirm">
                        <a href="javascript:;" style="margin-right:10px" @click="butlick(item)">{{ item.name }}</a>
                      </span>
                      <a-popconfirm
                        v-else
                        placement="top"
                        width="100"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="butlick(item)">
                        <template slot="title">
                          <p>提示</p>
                          <p>确认要{{ item.name }}{{ record.sceneName }}?</p>
                        </template>
                        <a href="javascript:;" style="margin-right:10px">{{ item.name }}</a>
                      </a-popconfirm>
                    </div>
                    <a href="javascript:;" v-if="processNODE_ENV !== 'production'" @click="fuzhiuuid(record.uuid)">复制uuid</a>
                  </template>
                  <a-table
                    slot="expandedRowRender"
                    slot-scope="record"
                    :row-key="record => record.robotClientUuid"
                    :columns="innerColumns"
                    :data-source="record.sceneInstClients"
                    :pagination="false">
                    <template slot="action" slot-scope="text, records">
                      <span style="margin-right:10px">
                        <a href="javascript:;" style="color:#2488e5" @click="getprocessDetail(record.uuid, records.robotClientUuid)">详情</a>
                      </span>
                      <a href="javascript:;" v-if="processNODE_ENV !== 'production'" @click="fuzhiuuid(record.uuid)">复制uuid</a>
                    </template>
                  </a-table>
                </a-table>
              </div>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
    <a-drawer
      title="计划执行详情"
      width="560"
      placement="right"
      :closable="false"
      :visible="visible"
      @close="onClose"
    >
      <a-col :span="12">
        <div class="drawername">
          <p>机器人账号：</p>
          <span class="drawernames">{{ detailData.robotClientName }}</span>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="drawername">
          <p>执行结果：</p>
          <a-tag color="blue" v-if="detailData.clientSceneInstStatus === 'running' || detailData.clientSceneInstStatus === 'allocated'">
            {{ detailData.clientSceneInstStatusName }}
          </a-tag>
          <a-tag color="green" v-else-if="detailData.clientSceneInstStatus === 'idle'">
            {{ detailData.clientSceneInstStatusName }}
          </a-tag>
          <a-tag v-else-if="detailData.clientSceneInstStatus === 'abnormal'">
            {{ detailData.clientSceneInstStatusName }}
          </a-tag>
          <a-tag v-else-if="detailData.clientSceneInstStatus === 'offline'">
            {{ detailData.clientSceneInstStatusName }}
          </a-tag>
          <a-tag v-else>
            {{ detailData.clientSceneInstStatusName }}
          </a-tag>
        </div>
      </a-col>
      <a-col :span="24">
        <a-tabs default-active-key="1" @change="callback">
          <a-button slot="tabBarExtraContent" style="margin:0 10px 0 0" @click="refresh" icon="reload">刷新</a-button>
          <a-tab-pane key="1" tab="应用运行记录">
            <a-timeline style="padding:10px 0 0 6px;">
              <a-timeline-item v-for="(item, index) in detailData.sceneInstJobs" :key="index" class="record" :color="item.status== 'finish' ? '#1890FF' : 'gray' && item.status == 'error' ? 'red' : 'gray'">
                <a-icon type="loading" slot="dot" v-if="item.status == 'running'" style="font-size: 16px;color: #1890ff" />
                <h1>
                  <a href="javascript:;" v-if="processNODE_ENV !== 'production'" @click="fuzhiuuid(item.uuid)">复制uuid</a>
                  {{ item.robotName }}
                  <div v-for="imgs in item.actions" :key="imgs.name" style="display: inline;">
                    <span style="margin-right:10px" v-if="!imgs.confirm">
                      <a href="javascript:;" style="margin-right:10px" @click="butlick(imgs)">{{ imgs.name }}</a>
                    </span>
                    <a-popconfirm
                      v-else
                      placement="top"
                      width="100"
                      ok-text="确定"
                      cancel-text="取消"
                      @confirm="butlick(imgs)">
                      <template slot="title">
                        <p>提示</p>
                        <p>确认要{{ imgs.name }}{{ item.robotClientName }}?</p>
                      </template>
                      <a href="javascript:;" style="margin-right:10px">{{ imgs.name }}</a>
                    </a-popconfirm>
                  </div>
                  <a href="javascript:;" @click="webjournal(item)">日志</a>
                </h1>
                <div class="timelist">
                  <p>运行时间：<span v-if="item.startTime">{{ item.startTime.substring(5,20) }}</span> <em v-if="item.startTime && item.endTime">~</em> <span v-if="item.endTime">{{ item.endTime.substring(5,20) }}</span> </p>
                  <div style="margin-top:30px">
                    <span class="complete" v-if="item.status == 'finish'">{{ item.statusName }}</span>
                    <span class="abnormal" v-else-if="item.status == 'error'">{{ item.statusName }}:&nbsp;&nbsp;{{ item.remark }}</span>
                    <span class="complete" v-else-if="item.status == 'running'">{{ item.statusName }}</span>
                    <span class="unexecuted" v-else-if="item.status == 'waiting'">{{ item.statusName }}</span>
                    <span class="unexecuted" v-else-if="item.status == 'paused'">{{ item.statusName }}</span>
                    <span class="unexecuted" v-else-if="item.status == 'stopped'">{{ item.statusName }}</span>
                    <span class="unexecuted" v-else>{{ item.statusName }}</span>
                  </div>
                </div>
              </a-timeline-item>
            </a-timeline>
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-drawer
        title="日志"
        width="700"
        :closable="true"
        :visible="childrenDrawer"
        @close="onChildrenDrawerClose"
      >
        <div class="drawertitle">
          <h1>{{ listnametitle }}</h1>
          <a-button @click="websockreload" icon="reload">刷新</a-button>
        </div>
        <a-table
          :row-key="record => record.id"
          :columns="rizColumns"
          :data-source="rizhi"
          :pagination="webpagination"
          :loading="rizloading"
          @change="webhandleTableChange">
          <template slot="level" slot-scope="text, record">
            <span v-if="record.level ==='错误'" style="color:red">{{ record.level }}</span>
            <span v-else>{{ record.level }}</span>
          </template>
          <template slot="action" slot-scope="text, record">
            <span style="word-break: break-all;width: 360px;display: block;">{{ record.text }}</span>
          </template>
        </a-table>
      </a-drawer>
    </a-drawer>
  </div>
</template>
<script>
import { sceneinstlist, processDetail, clientClientConfig, instStatusCount, scheduleClientList, listSummary } from '@/api/user'
import request from '@/utils/request'
const columns = [
  {
    title: '计划名称',
    dataIndex: 'sceneName',
    scopedSlots: { customRender: 'robot' }
  },
  {
    title: '执行时间',
    dataIndex: 'createTime',
    scopedSlots: { customRender: 'time' }
  },
  {
    title: '执行方式',
    dataIndex: 'executeScopeName',
    scopedSlots: { customRender: 'executeName' }
  },
  {
    title: '执行结果',
    dataIndex: 'currentRobotName1',
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '错误备注',
    dataIndex: 'remark'
  },
  {
    title: '操作',
    dataIndex: '',
    width: '16%',
    scopedSlots: { customRender: 'action' }
  }
]
const innerColumns = [
  {
    title: '机器人账号',
    dataIndex: 'robotClientName'
  },
  // {
  //   title: '结束时间',
  //   dataIndex: 'sceneInstStartTime'
  // },
  {
    title: '执行结果',
    dataIndex: 'clientStatusName'
  },
  {
    title: '操作',
    dataIndex: 'clientStatus',
    scopedSlots: { customRender: 'action' }
  }
]
const rizColumns = [
  {
    title: '类型',
    dataIndex: 'level',
    width: '10%',
    scopedSlots: { customRender: 'level' }
  },
  {
    title: '时间',
    dataIndex: 'time',
    width: '30%'
  },
  {
    title: '内容',
    dataIndex: 'text',
    with: '60%',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: [ 'partInfo' ],
  data () {
    return {
      columns,
      innerColumns,
      rizColumns,
      enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
      loading: false,
      rizloading: false,
      visible: false,
      pagination: {
        showQuickJumper: true
      },
      processNODE_ENV: process.env.NODE_ENV,
      titlename: '计划执行记录',
      hover: '',
      foldname: '收起',
      loadingMore: false,
      folding: false,
      searchnval: '',
      listUseryData: [],
      webpagination: {},
      listData: [],
      detailData: [],
      rizhi: [],
      Detailuuid: '',
      ClientUuid: '',
      loadmings: false,
      postData: {
        sourceUuid: this.$route.query.uuid || '',
        sourceType: '',
        status: '',
        key: '',
        page: 1,
        size: 10
      },
      schedupostData: {
        enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
        userUuid: '',
        groupInfoUuid: '',
        key: '',
        page: this.$route.query.page || 1,
        size: 20
      },
      childrenDrawer: false,
      instStatusCountnname: '',
      wsUrl: '',
      getwsUrl: '',
      websocket: null,
      websocketResult: '',
      timeoutObj: null,
      timeout: 30000,
      consttime: 1000,
      token: this.$store.getters.token,
      listnametitle: '',
      robotListName: [],
      listname: {
        'id': 1,
        'method': 'notifyUploadJobLog',
        'params': {
          'sceneInstJobUuid': '',
          'page': 1,
          'size': 10
        }
      }
    }
  },
  mounted () {
    this.accountUsery(this.postData)
    this.listUsery(this.schedupostData)
    this.getinstStatusCount()
    // watch
    this.handleInputsearch(this.partInfo.name)
    this.searchnval = this.partInfo.name
    if (this.partInfo.name) {
      this.lisyclis(this.partInfo, 0)
    } else {
      this.lisyclis(this.partInfo, 'ted')
    }
  },
  watch: {
    partInfo () {
      this.handleInputsearch(this.partInfo.name)
      this.searchnval = this.partInfo.name
      this.lisyclis(this.partInfo, 0)
    }
  },
  methods: {
    // 收起展开
    comfold () {
      this.folding = !this.folding
      if (this.folding) {
        this.foldname = '展开'
      } else {
        this.foldname = '收起'
      }
    },
    // 计划列表点击加载
    onLoadMore () {
      this.loadingMore = true
      this.schedupostData.page = this.schedupostData.page + 1
      listSummary(this.schedupostData).then(res => {
        if (res.code === 200) {
          this.listUseryData = this.listUseryData.concat(res.data)
          this.loadingMore = false
          if (this.schedupostData.page === res.page.pages) {
            this.loadmings = true
          } else {
            this.loadmings = false
          }
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
    // 计划列表搜索
    handleInputsearch (value, event) {
      this.schedupostData.key = value
      this.schedupostData.page = 1
      this.listUsery(this.schedupostData)
    },
    // 计划列表获取列表
    listUsery (data) {
      // this.loading = true
      listSummary(data).then(res => {
        if (res.code === 200) {
          this.listUseryData = res.data
          if (this.schedupostData.page === res.page.pages) {
            this.loadmings = true
          } else {
            this.loadmings = false
          }
          if (res.data.length === 0) {
            this.loadmings = true
          }
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
    // 计划列表点击重置右侧数据
    lisyclis (key, index) {
      if (index >= 0 && index !== 'ted') {
        this.titlename = key.name
        this.hover = index
      } else {
          this.hover = ''
          this.titlename = '计划执行记录'
      }
      this.postData.sourceUuid = key.uuid
      this.postData.page = 1
      this.getinstStatusCount()
      this.accountUsery(this.postData)
    },
    // 临时复制uuid
    fuzhiuuid (index) {
      this.$copyText(index).then(message => {
        this.$message.success('已复制到剪切板')
      }).catch(err => {
        console.log('copy.err', err)
        this.$message.error('复制失败')
      })
    },
    // 取消抽屉
    onChildrenDrawerClose () {
      this.childrenDrawer = false
    },
    // websocket通讯
    updateUrl (urlPath) {
      const _this = this
      // eslint-disable-next-line eqeqeq
      if (urlPath.indexOf('sockjs') != -1) {
        _this.wsUrl = _this.getwsUrl + '/ws/console?accessToken=' + this.token
      } else {
        // eslint-disable-next-line eqeqeq
        if (window.location.protocol == 'http:') {
          _this.wsUrl = _this.getwsUrl + '/ws/console?accessToken=' + this.token
        } else {
          _this.wsUrl = _this.getwsUrl + '/ws/console?accessToken=' + this.token
        }
      }
    },
    start: function () {
      const _this = this
      _this.websocket.send(JSON.stringify(_this.listname))
      // this.timeoutObj = setInterval(function () {
      //   _this.websocket.send(JSON.stringify(_this.listname))
      //   // console.log(_this.listname)
      //   console.log(JSON.stringify(_this.listname))
      // }, this.timeout)
    },
    webSocketLink () {
      const _this = this
      clientClientConfig().then(res => {
        if (res.code === 200) {
          this.getwsUrl = res.data.webSocketHost
          var heartCheck = {
            timeout: 30000, // 30秒
            timeoutObj: null,
            start: function () {
              _this.timeoutObj = setInterval(function () {
                _this.websocket.send('heartbeat')
              }, _this.timeout)
            }
          }
          if ('WebSocket' in window) {
            _this.updateUrl('/webSocketServer')
            _this.websocket = new WebSocket(_this.wsUrl)
          } else if ('MozWebSocket' in window) {
            _this.updateUrl('/webSocketServer')
            // eslint-disable-next-line no-undef
            _this.websocket = new MozWebSocket(_this.wsUrl)
          } else {
            _this.updateUrl('/sockjs/webSocketServer')
            // eslint-disable-next-line no-undef
            _this.websocket = new SockJS(_this.wsUrl)
          }
          _this.websocket.onopen = function () {
            console.log('websock连接成功')
            heartCheck.start()
          }
          _this.websocket.onmessage = function (e) {
            const data = JSON.parse(e.data)
            if (data.result) {
              _this.websocketResult = data.result.requestUuid
            }
            if (data.code === 400) {
              _this.$message.warning(data.msg)
            } else {
            }
            if (data.params) {
              const webpagination = { ..._this.webpagination }
              webpagination.total = data.params.page.total
              webpagination.current = data.params.page.page
              _this.rizloading = false
              _this.webpagination = webpagination
              _this.rizhi = data.params.logs.map((key, index) => {
                key.id = index
                return key
              })
              if (data.params.logs.length === 0) {
                _this.$message.warning('暂无日志')
              } else {
                _this.childrenDrawer = true
              }
            }
          }
          _this.websocket.onerror = function (evnt) {
            console.log('与服务器链接失败')
            // console.log(evnt)
            // _this.webSocketLink()
          }
          _this.websocket.onclose = function (evnt) {
            console.log('与服务器断开了链接')
            if (evnt.code === 1005) {
            } else {
              setTimeout(() => {
                if (_this.consttime === 10000) {
                } else {
                  _this.consttime = _this.consttime + 200
                }
                _this.webSocketLink()
              }, _this.consttime)
            }
          }
        } else {
        }
      })
    },
    // 筛选数量
    getinstStatusCount () {
      const data = {
        sourceUuid: this.postData.sourceUuid || ''
      }
      instStatusCount(data).then(res => {
        if (res.code === 200) {
          this.instStatusCountnname = res.data
        }
      })
    },
    // 长连接数据传输
    webjournal (key) {
      this.listname.params.sceneInstJobUuid = key.uuid
      this.listnametitle = key.robotName
      this.start()
    },
    callback (key) {
    },
    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    },
    // 点击切换积累数据
    onChanger (e) {
      this.postData.page = 1
      if (e.target.value === '1') {
        this.postData.status = ''
      } else {
        this.postData.status = e.target.value
      }
      this.getinstStatusCount()
      this.accountUsery(this.postData)
    },
    refresh () {
      this.getprocessDetail(this.Detailuuid, this.ClientUuid)
    },
    // 获取抽屉详情
    getprocessDetail (uuid, robotClientUuid) {
      this.Detailuuid = uuid
      this.ClientUuid = robotClientUuid
      const data = {
        sceneInstUuid: uuid,
        robotClientUuid: robotClientUuid
      }
      processDetail(data).then(res => {
        this.detailData = res.data
        this.visible = true
      })
    },
    // 刷新列表
    websockreload () {
      this.$message.success('日志刷新成功')
      this.start()
    },
    // 操作按钮跳转接口
    butlick (item) {
      var data = {}
      // eslint-disable-next-line no-use-before-define
      for (const item of item.params) {
          let code = ''
          code = item.key
          data[code] = item.value
        }
      return request({
        url: item.path,
        method: item.method,
        params: data
      }).then(res => {
        if (res.code === 200) {
          this.$message.success(item.name + '成功')
          if (item.refresh) {
            this.accountUsery(this.postData)
          }
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // // 获取选择机器人
    executeScopeN (list) {
      const data = {
        enterpriseUuid: this.enterpriseUuid,
        scheduleUuid: list.sourceUuid
      }
      scheduleClientList(data).then(res => {
        if (res.code === 200) {
          this.robotListName = res.data
        }
      })
    },
    // 获取列表
    accountUsery (data) {
      this.loading = true
      sceneinstlist(data).then(res => {
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
    webhandleTableChange (pagination, filters, sorter) {
      const pager = { ...this.webpagination }
      pager.current = pagination.current
      this.webpagination = pager
      this.postData.page = pager.current
      // this.accountUsery(this.postData)
      this.listname.params.page = this.webpagination.current
      this.start()
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
  },
  destroyed () {
    if (this.websocket) {
      clearInterval(this.timeoutObj)
      this.websocket.close()
    }
  },
  created () {
    this.webSocketLink()
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-input-affix-wrapper .ant-input-suffix{
  right: 10px;
}
/deep/.ant-tabs-nav .ant-tabs-tab-active{
  color: #000;
}
.acconut_rightuser{
  cursor: pointer;
  width:210px;
  height:32px;
  background:rgba(255,82,91,1);
  border-radius:3px;
  font-size:14px;
  font-family:Microsoft YaHei;
  font-weight:400;
  color:rgba(255,255,255,1);
  line-height:34px;
  text-align: center;
  margin: 21px 6px 0 24px;
  i{
    color: #fff;
    font-weight: bold;
    font-size: 16px;
  }
}
.constns{
  display: flex;
  .comleft{
    width: 260px;
    flex: inherit;
    border-right: 1px solid #EBEBEB;
    position: relative;
    transition: all 0.1s;
    .menufold{
      position: absolute;
      right: -1px;
      top: 20px;
      width: 19px;
      height: 32px;
      line-height: 28px;
      text-align: center;
      background: #FFFFFF;
      border-radius: 4px 0px 0px 4px;
      border: 1px solid #EBEBEB;
      border-right: none;
      cursor: pointer;
      i{
        font-size: 12px;
        color: rgba(0, 0, 0, 0.65);
      }
      &.foldalt{
        border: 1px solid #EBEBEB;
        border-left: none;
        right: -20px;
        border-radius: 0px 4px 4px 0px;
        z-index: 1;
      }
    }
    .listUserycons{
      max-height: 660px;
      overflow-y: auto;
      ul{
        list-style-type: none;
        padding: 0;
        margin: 0;
        li{
          padding-left: 25px;
          height: 46px;
          line-height: 46px;
          cursor: pointer;
          position: relative;
          transition: all 0.3s;
          i{
            opacity: 0.8;
            float: left;
            margin: 16px 10px 0 2px;
          }
          p{
            display: inline-block;
            width: 190px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          img{
            float: left;
            width: 20px;
            margin: 10px 6px 0 0;
          }
          &:before{
            content: "";
            width: 2px;
            height: 46px;
            background: #FD535C;
            position: absolute;
            right: 0;
            opacity: 0;
            transition: all 0.3s;
          }
          &:hover{
            background: rgba(253, 83, 92, 0.08);
            &:before{
              opacity: 1;
            }
          }
          &.alt{
            background: rgba(253, 83, 92, 0.08);
            &:before{
              content: "";
              width: 2px;
              height: 46px;
              background: #FD535C;
              position: absolute;
              right: 0;
              opacity: 1;
              transition: all 0.3s;
            }
          }
        }
      }
    }
  }
  .comright{
    width: 100%;
    flex: 1;
  }
}
.numbername{
  background: #FAFAFA;
  border-radius: 3px;
  border: 1px solid #F0F0F0;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
  margin-left: 6px;
  padding: 1px 4px;
}
.account{
  background: #fff;
  .account_title{
    height: 70px;
    position: relative;
    padding: 0 24px;
    &:before{
      content: none;
      width:4px;
      height:16px;
      background:rgba(255,82,91,1);
      float: left;
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -7px;
    }
  }
}
p{
  margin: 0;
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
.record{
  h1{
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    padding-right: 16px;
    a{
      color: #1890FF;
      line-height: 22px;
      font-size: 14px;
      font-weight: 400;
      float: right;
      margin-right: 10px;
    }
  }
  .timelist{
    width: 470px;
    // height: 80px;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 2px;
    padding: 16px;
    p{
      float: left;
      margin: 0;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
      line-height: 22px;
    }
    .complete{
      clear: both;
      font-size: 14px;
      font-weight: 400;
      color: #52C41A;
      line-height: 22px;
    }
    .abnormal{
      clear: both;
      font-size: 14px;
      font-weight: 400;
      color: #E02020;
      line-height: 22px;
      i{
        font-size: 12px;
        margin-left: 4px;
        font-weight: normal;
      }
    }
    .unexecuted{
      clear: both;
      font-size: 14px;
      font-weight: 400;
      color: #898989;
      line-height: 22px;
    }
  }
}
.drawername{
  margin-bottom: 20px;
  p{
    color: #595959;
    margin: 0 0 6px 0;
  }
  .drawernames{
    color: rgba(0, 0, 0, 0.85);
    margin: 0;
    display: block;
    font-size: 14px;
  }
}
.drawertitle{
  height: 32px;
  margin-bottom: 20px;
  h1{
    float: left;
    margin: 0;
    font-size: 18px;
  }
  button{
    float: right;
  }
}
.menufoldrighs{
  transform: rotate(180deg)
}
/deep/ .ant-table-thead > tr > th, .ant-table-tbody > tr > td{
  background: rgba(0, 0, 0, 0);
}
/deep/  tr.ant-table-expanded-row, tr.ant-table-expanded-row:hover td{
  background: #FAFAFA;
}
/deep/ .ant-table-placeholder{
  background: none;
}
</style>
