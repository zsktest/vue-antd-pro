<template>
  <div>
    <a-row :gutter="24">
      <a-col :sm="24" :md="24" :xl="24">
        <div class="loadimg" v-if="loadimg"></div>
        <div class="account right_content" style="display: none;" :style="{ minHeight: `${backgroundheight - 140}px` }" v-show="account_user.total == 0">
          <div class="account_title">
            <h1>可被调度的机器人</h1>
            <span class="account_user"><a-icon type="desktop" />(0)</span>
          </div>
          <div class="top_cons">
            <div class="top_cons1">
              <h1>什么是调度？</h1>
              <p>调度是集中管理机器人与计划执行的能力中心，可统一对机器人查看与管理、统一对安排自动计划执行、监控管理计划的运行情况等。</p>
              <div class="top_cons2">
                <a-timeline>
                  <a-timeline-item>
                    <div slot="dot">1</div>
                    <p>配置机器人</p>
                    <span>在影刀客户端，将工作模式改为“机器人模式”</span>
                  </a-timeline-item>
                  <a-timeline-item>
                    <div slot="dot">2</div>
                    <p>新建计划</p>
                    <span>在“计划执行”中新建计划</span>
                  </a-timeline-item>
                  <a-timeline-item color="red">
                    <div slot="dot">3</div>
                    <p>查看和管理执行记录</p>
                    <span>在“执行记录”中，查看和管理计划的执行记录</span>
                  </a-timeline-item>
                </a-timeline>
                <img src="@/assets/img/bg_default.png" alt="">
              </div>
              <a href="https://www.winrobot360.com/doc/%E7%AE%A1%E7%90%86%E6%96%87%E6%A1%A3/%E8%B0%83%E5%BA%A6%E7%AE%A1%E7%90%86.html" target="_blank"><a-button icon="profile">了解更多</a-button></a>
              <div style="height:40px;"></div>
            </div>
          </div>
          <div class="bt"></div>
        </div>
        <div class="account right_content" v-show="account_user.total > 0">
          <div class="account_title">
            <h1>可被调度的机器人</h1>
            <a-tooltip placement="top">
              <template slot="title">
                <span>在线机器人 {{ account_user.usable }} 个</span>
              </template>
              <span class="account_user"><a-icon type="desktop" />(<em>{{ account_user.usable }}</em>/{{ account_user.total }})</span>
            </a-tooltip>
            <div class="right_shos1">
              <a href="https://www.winrobot360.com/doc/%E7%AE%A1%E7%90%86%E6%96%87%E6%A1%A3/%E8%B0%83%E5%BA%A6%E7%AE%A1%E7%90%86.html" target="_blank"><a-icon type="question-circle" style="margin-right:4px;" />帮助</a>
            </div>
          </div>
          <div class="titlelist">
            <div class="titlelist1">
              <span>状态</span>
              <a-select default-value="" style="width:80px" @change="handleChange">
                <a-select-option value="">
                  全部
                </a-select-option>
                <a-select-option value="idle">
                  空闲
                </a-select-option>
                <a-select-option value="running">
                  运行中
                </a-select-option>
                <a-select-option value="offline">
                  离线
                </a-select-option>
              </a-select>
            </div>
            <a-input-search placeholder="输入机器人账号" allow-clear style="width: 200px;margin-right:20px" @search="handleInputsearch"/>
            <a-radio-group defaultValue="1" @change="onChanger">
              <a-radio-button value="1">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>预览模式</span>
                  </template>
                  <a-icon type="appstore" />
                </a-tooltip>
              </a-radio-button>
              <a-radio-button value="2">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>列表模式</span>
                  </template>
                  <a-icon type="unordered-list" />
                </a-tooltip>
              </a-radio-button>
            </a-radio-group>
            <div class="right_shos">
              <div class="right_shos2">
                5s自动刷新 <a-switch size="small" @change="onChange" v-model="defaults" />
              </div>
              <a-button @click="websockreload" icon="reload">刷新</a-button>
            </div>
          </div>
          <div class="windows_list" :style="{ minHeight: `${backgroundheight - 280}px`, padding: '0 9px' }" v-if="listvis">
            <div v-if="listData.length > 0">
              <ul>
                <li v-for="(item, key) in listData" :key="key">
                  <div class="hover" v-if="item.img" @click="hoverimg(item)">
                    <a-icon style="margin-right:4px;" type="eye" />预览
                  </div>
                  <img v-if="item.img" :src="item.img" alt="">
                  <div class="icons" v-else><a-icon type="windows" theme="filled" /></div>
                  <p style="padding-left:3px;">
                    <span v-if="item.status === 'running' || item.status === 'allocated'">
                      <a-badge status="processing"/>
                    </span>
                    <span v-if="item.status === 'idle'">
                      <a-badge status="success"/>
                    </span>
                    <span v-if="item.status === 'abnormal'">
                      <a-badge status="error"/><a-icon type="exclamation-circle" cl ass="exclamation" @click="showDrawer(item)"/>
                    </span>
                    <span v-if="item.status === 'offline'">
                      <a-badge status="default" />
                    </span>
                    {{ item.robotClientName }}
                    <a-dropdown>
                      <a-icon type="ellipsis" style="float: right;margin-top:3px" />
                      <a-menu slot="overlay">
                        <a-menu-item v-for="items in item.actions" :key="items.name">
                          <span style="margin-right:10px" v-if="!items.confirm">
                            <a href="javascript:;" style="margin-right:10px" @click="butlick(items)">{{ items.name }}</a>
                          </span>
                          <a-popconfirm
                            v-else
                            placement="top"
                            width="100"
                            ok-text="确定"
                            cancel-text="取消"
                            @confirm="butlick(items)">
                            <template slot="title">
                              <p>提示</p>
                              <p>{{ items.remark }}</p>
                            </template>
                            <a href="javascript:;" style="margin-right:10px">{{ items.name }}</a>
                          </a-popconfirm>
                        </a-menu-item>
                      </a-menu>
                    </a-dropdown>
                  </p>
                  <p class="iconsname">
                    <a-icon type="desktop" />  &nbsp;{{ item.machineName }}
                  </p>
                </li>
              </ul>
              <a-pagination
                style="float: right;margin-right:15px"
                @change="handleTableChangeImg"
                :page-size="pagination.pageSize"
                v-model="postData.page"
                :total="pagination.total" />
              <div class="bt" style="margin-top:48px;"></div>
            </div>
            <a-empty style="padding-bottom:40px;margin-top:40px" v-else />
          </div>
          <div style="padding:0 24px;" v-else>
            <a-table
              :row-key="record => record.uuid"
              :columns="columns"
              :data-source="listData"
              :pagination="pagination"
              :loading="loading"
              @change="handleTableChange"
            >
              <template slot="img" slot-scope="text, record">
                <div class="bableList">
                  <div class="hover" v-if="record.img" @click="hoverimg(record)">
                    <a-icon type="eye" />
                  </div>
                  <img v-if="record.img" :src="record.img" alt="">
                  <div class="icons" v-else><a-icon type="windows" theme="filled" /></div>
                </div>
              </template>
              <template slot="state" slot-scope="text, record">
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
              <template slot="current" slot-scope="text, record">
                <span style="cursor: pointer;color: #2488e5;" @click="getprocessDetail(record.currentSceneInstUuid, record.uuid)" v-if="record.currentRobotName">{{ record.currentRobotName }}</span>
                <span v-else style="color: rgba(0, 0, 0, 0.65);">- -</span>
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
                      <p>{{ item.remark }}</p>
                    </template>
                    <a href="javascript:;" style="margin-right:10px">{{ item.name }}</a>
                  </a-popconfirm>
                </div>
              </template>
            </a-table>
          </div>
        </div>
      </a-col>
    </a-row>
    <div class="ant-image-preview-root" style="display: none;" v-show="imgshow">
      <div class="ant-image-preview-mask"></div>
      <div tabindex="-1" class="ant-image-preview-wrap" role="dialog" style="">
        <div role="document" class="ant-image-preview">
          <div class="ant-image-preview-content">
            <div class="ant-image-preview-body">
              <ul class="ant-image-preview-operations">
                <li class="ant-image-preview-operations-operation" style="margin-right:16px;" @click="onCloseimg">
                  <a-icon type="close" style="clear: both;"/>
                </li>
                <a-button size="small" ghost @click="onRefresh">刷新</a-button>
                <li style="margin-right:24px;">{{ timeoutitem }}s后刷新</li>
                <li style="margin-right:24px;">主机名：{{ proImgname.machineName }}</li>
                <li style="margin-right:24px;">机器人账号：{{ proImgname.robotClientName }}</li>
              </ul>
              <div class="ant-image-preview-img-wrapper">
                <img class="ant-image-preview-img" :src="imgindex">
                <div class="ant-spin-nested-loading" v-if="loadimgpro" style="position: absolute;width: 100%;height: 100%;top: 0;background: #d8d8d873;">
                  <div>
                    <div class="ant-spin ant-spin-spinning">
                      <span class="ant-spin-dot ant-spin-dot-spin">
                        <i class="ant-spin-dot-item"></i>
                        <i class="ant-spin-dot-item"></i>
                        <i class="ant-spin-dot-item"></i>
                        <i class="ant-spin-dot-item"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
          <a-button @click="drawebsockreload" icon="reload">刷新</a-button>
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
        </a-table>
      </a-drawer>
    </a-drawer>
  </div>
</template>
<script>
import { clientList, clientClientConfig, clientStatusCount, processDetail } from '@/api/user'
import request from '@/utils/request'
// 表格项
const columns = [
  {
    title: '机器人账号',
    dataIndex: 'robotClientName'
    // width: '20%'
  },
  {
    title: '主机名',
    dataIndex: 'machineName'
  },
  {
    title: '预览',
    detaIndex: 'img',
    scopedSlots: { customRender: 'img' }
  },
  {
    title: '状态',
    dataIndex: 'phone',
    scopedSlots: { customRender: 'state' }
    // key: 'createTime',
    // slots: { title: 'createTime' },
    // filters: [
    //   {
    //     text: '空闲',
    //     value: 'idle'
    //   },
    //   {
    //     text: '运行中',
    //     value: 'running'
    //   },
    //   {
    //     text: '离线',
    //     value: 'offline'
    //   }
    // ],
    // filterMultiple: false
  },
  {
    title: '当前执行任务',
    dataIndex: 'currentRobotName',
    scopedSlots: { customRender: 'current' }
  },
  {
    title: '操作',
    dataIndex: '',
    width: '18%',
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
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  data () {
    return {
      visible: false,
      loadimg: true,
      loadimgpro: false,
      defaults: false,
      scaleskey: 1,
      backgroundheight: document.documentElement.clientHeight,
      enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
      account_user: '',
      loading: false,
      pagination: {
        showQuickJumper: true,
        pageSize: 20
      },
      listData: [],
      proImgname: '',
      processNODE_ENV: process.env.NODE_ENV,
      columns,
      drawers: '',
      imgshow: false,
      imgindex: '',
      postData: {
        enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
        userUuid: '',
        groupInfoUuid: '',
        key: '',
        status: '',
        page: 1,
        size: 20
      },
      listvis: true,
      wsUrl: '',
      getwsUrl: '',
      websocket: null,
      websocketResult: '',
      timeoutObj: null,
      timeoutObjpro: null,
      interval: null,
      timeoutitem: 5,
      onChangetimeoutObjpro: null,
      timeout: 30000,
      token: this.$store.getters.token,
      consttime: 1000,
      listname: {
        'id': 1,
        'method': 'notifyRefreshScreenshot',
        'params': {
          'robotClientUuids': [],
        width: 100,
        height: 100
        }
      },
      keys: '',
      // 抽屉
      rizColumns,
      rizloading: false,
      detailData: [],
      rizhi: [],
      webpagination: {},
      listnametitle: '',
      childrenDrawer: false,
      listnamekey: {
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
    // this.getclientClientConfig()
    this.webSocketLink()
    this.getclientStatusCount()
    this.$nextTick(function () {
      document.addEventListener('keyup', (e) => {
        if (e.keyCode === 27) {
          if (this.imgshow) {
            this.onCloseimg()
          }
        }
      })
    })
  },
  methods: {
    // 机器人执行状态抽屉开始
    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    },
    callback (key) {
    },
    // 取消抽屉
    onChildrenDrawerClose () {
      this.childrenDrawer = false
    },
    // 长连接数据传输
    webjournal (key) {
      this.listnamekey.params.sceneInstJobUuid = key.uuid
      this.listnametitle = key.robotName
      this.start('1')
    },
    // 刷新列表
    drawebsockreload () {
      this.$message.success('日志刷新成功')
      this.start()
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
      // this.postData.page = pager.current
      // this.accountUsery(this.postData)
      this.listnamekey.params.page = this.webpagination.current
      this.start('1')
    },
    // 获取抽屉详情
    getprocessDetail (uuid, robotClientUuid) {
      const data = {
        sceneInstUuid: uuid,
        robotClientUuid: robotClientUuid
      }
      processDetail(data).then(res => {
        this.detailData = res.data
        this.visible = true
      })
    },
    // 机器人执行状态抽屉结束
    // 下拉切换机器人状态
    handleChange (e) {
      console.log(e)
      this.postData.status = e
      this.accountUsery(this.postData)
    },
    // 获取可被调度机器人数量
    getclientStatusCount () {
      clientStatusCount().then(res => {
        if (res.code === 200) {
          this.account_user = res.data
        }
      })
    },
    // 获取websocket地址
    getclientClientConfig () {
      clientClientConfig().then(res => {
        if (res.code === 200) {
          this.getwsUrl = res.data.webSocketHost
        } else {
        }
      })
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
    start: function (key) {
      const _this = this
      if (key) {
        _this.websocket.send(JSON.stringify(_this.listnamekey))
      } else {
        _this.websocket.send(JSON.stringify(_this.listname))
      }
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
          // if (_this.websocket.readyState !== this.websocket.OPEN) {
          //   // _this.webSocketLink()
          //   console.log(1)
          //   return false
          // }
          var heartCheck = {
            timeout: 30000, // 30秒
            timeoutObj: null,
            reset: function () {
              clearInterval(this.timeoutObj)
            },
            start: function () {
              _this.timeoutObj = setInterval(function () {
                _this.websocket.send('heartbeat')
              }, _this.timeout)
            }
          }
          _this.websocket.onopen = function () {
            console.log('websock连接成功')
            _this.accountUsery(_this.postData)
            // _this.start()
            heartCheck.start()
          }
          _this.websocket.onmessage = function (e) {
            const data = JSON.parse(e.data)
            heartCheck.reset()
            if (data.result) {
              _this.websocketResult = data.result.requestUuid
            }
            if (data.params) {
              if (data.params.logs) {
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
              } else {
                const params = data.params
                if (_this.listname.params.height === 2000) {
                  if (_this.websocketResult === params.requestUuid) {
                    _this.loadimgpro = false
                    _this.imgindex = params.url
                  }
                  return false
                }
                if (_this.websocketResult === params.requestUuid) {
                  _this.listData = _this.listData.map(item => {
                    if (item.uuid === params.robotClientUuid) {
                      item.img = params.url
                    } else {
                    }
                    return item
                  })
                }
              }
            }
          }
          _this.websocket.onerror = function (evnt) {
            console.log('与服务器链接失败')
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
    // 详情刷新图片
    onRefresh () {
      this.loadimgpro = true
      const _this = this
      _this.start()
    },
    // 图片放大
    // zoominpro () {
    //   this.scaleskey++
    // },
    // // 图片缩小
    // zoomout () {
    //   if (this.scaleskey === 1) {
    //   } else {
    //     this.scaleskey--
    //   }
    // },
    // 操作按钮跳转接口
    butlick (item) {
      var data = {}
      for (const items of item.params) {
          let code = ''
          code = items.key
          data[code] = items.value
        }
      return request({
        url: item.path,
        method: item.method,
        params: data
      }).then(res => {
        if (res.code === 200) {
          this.$message.success(item.name + '成功')
          if (item.refresh) {
            this.websockreload()
          }
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 关闭查看大图
    onCloseimg () {
      this.listname.params.width = 100
      this.listname.params.height = 100
      this.imgshow = false
      this.loadimgpro = false
      this.imgindex = ''
      clearInterval(this.timeoutObjpro)
      clearInterval(this.interval)
      this.timeoutitem = 5
    },
    // 查看大图
    hoverimg (key) {
      this.loadimgpro = true
      this.proImgname = key
      this.listname.params.width = 1800
      this.listname.params.height = 2000
      this.listname.params.robotClientUuids = key.uuid
      this.start()
      this.timeBack()
      const _this = this
      _this.timeoutObjpro = setInterval(function (e) {
        clearInterval(_this.interval)
        _this.timeoutitem = 5
        _this.timeBack()
        _this.start()
      }, 5000)
      _this.imgshow = true
    },
    // 查看大图倒计时
    timeBack () {
      const _this = this
      var item = _this.timeoutitem
      _this.interval = setInterval(function () {
        item--
        _this.timeoutitem = item
      }, 1000)
    },
    // 刷新列表
    websockreload () {
      this.accountUsery(this.postData, '1')
    },
    // 点击切换积累数据
    onChanger (e) {
      if (e.target.value === '2') {
        this.listvis = false
      } else {
        this.listvis = true
        this.listname.params.width = 194
        this.listname.params.height = 121
        this.listname.params.robotClientUuids = this.listData.map(ims => {
          return ims.uuid
        })
        this.start()
      }
    },
    // 搜索
    handleInputsearch (value, event) {
      this.postData.key = value
      this.postData.page = 1
      this.accountUsery(this.postData)
    },
    // 30秒自动刷新托
    onChange (checked) {
      const _this = this
      if (checked) {
        _this.onChangetimeoutObjpro = setInterval(function () {
          _this.start()
        }, 5000)
      } else {
        clearInterval(_this.onChangetimeoutObjpro)
      }
    },
    // 获取列表
    accountUsery (data, index) {
      const _this = this
      _this.loading = true
      clientList(data).then(res => {
        if (res.code === 200) {
          if (index) {
            this.$message.success('列表刷新成功')
          }
          const pagination = { ..._this.pagination }
          pagination.total = res.page.total
          pagination.current = res.page.page
          _this.loading = false
          _this.listData = res.data
          _this.loadimg = false
          _this.pagination = pagination
          _this.listname.params.width = 194
          _this.listname.params.height = 121
          _this.listname.params.robotClientUuids = _this.listData.map(ims => {
            return ims.uuid
          })
          _this.start()
        } else {
          _this.loading = false
          _this.listData = []
          if (res.code === 500) {
            _this.$message.warning('系统异常！')
          } else {
            _this.$message.warning(res.msg)
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
      if (!filters.createTime) {
        filters.createTime = []
      }
      this.postData.status = filters.createTime[0] || filters.createTime
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.postData.page = pager.current
      this.accountUsery(this.postData)
    },
    handleTableChangeImg (pagination) {
      this.postData.page = pagination
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
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-image-preview-wrap ::selection{background:none}
/deep/ .ant-dropdown-menu-item span a{
  color:rgba(0,0,0,0.65);
}
p{
  margin: 0;
}
.exclamation{
  margin-left:4px;
  opacity: 0.55;
  transition: all .3s;
  cursor: pointer;
  &:hover{
    opacity: 1;
  }
}
.ant-image-preview-img{
  width: 80%;
  vertical-align: middle;
}
.right_shos1{
  display: inline-block;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0,0,0,0.45);
  margin-right: 24px;
  line-height: 32px;
  a{
    font-size: 14px;
    font-weight: 400;
    color: #1890FF;
  }
}
.titlelist{
  padding: 0 24px;
  margin-bottom: 20px;
  margin-top: -8px;
  .titlelist1{
    float: left;
    width: 140px;
    height: 32px;
    border-radius: 2px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    margin-right: 12px;
    span{
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      line-height: 30px;
      margin-left: 12px;
      float: left;
    }
    /deep/ .ant-select{
      border: none;
      float: right;
      .ant-select-selection--single{
        border: none;
        height: 30px;
      }
      .ant-select-selection{
        border: none;
        box-shadow: none;
      }
      .ant-select-selection:active{
        border: none;
        box-shadow: none;
      }
    }
  }
}
.right_shos{
  float: right;
  // padding: 19px 0;
  .right_shos2{
    margin-right: 16px;
    // float: right;
    cursor: pointer;
    margin-top: 5px;
  }
  .right_homu{
    width: 1px;
    height: 16px;
    background: #D8D8D8;
    float: left;
    margin: 8px 16px 0 16px;
  }
  div{
    float: left;
  }
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
      margin: 0 20px 0 0;
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
  .top_cons{
    height: 520px;
    padding: 100px  111px;
    .top_cons1{
      // max-width: 470px;
      float: left;
      margin-top: 20px;
      h1{
        font-size: 36px;
        font-weight: 400;
        color: #000000;
        margin-bottom: 8px;
      }
      p{
        font-size: 14px;
        font-weight: 400;
        color:rgba(0,0,0,0.65);
      }
    }
    .top_cons2{
      margin-top: 28px;
      height: 257px;
      border-radius: 4px;
      border: 1px solid rgba(0, 0, 0, 0.15);
      padding: 42px 0 0 32px;
      position: relative;
      margin-bottom: 32px;
      img{
        position: absolute;
        right: 0;
        top: 0;
        width: 786/2px;
      }
      div{
        width: 24px;
        height: 24px;
        background: #FFFFFF;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.15);
        line-height: 24px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
      }
      p{
        font-size: 14px;
        font-weight: 400;
        color: #000000;
        line-height: 24px;
        margin-left: 8px;
      }
      span{
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
        margin-left: 8px;
      }
    }
  }
}
.bableList{
  position: relative;
  .icons{
    width: 55px;
    height: 34px;
    background: #EDEFF2;
    border-radius: 4px;
    text-align: center;
    line-height: 34px;
    i{
      font-size: 16px;
      color: #3692F9;
    }
  }
  img{
    width: 55px;
    height: 34px;
    background: #EDEFF2;
    border-radius: 4px;
  }
  .hover{
    width: 55px;
    height: 34px;
    background: rgba(0, 0, 0, 0.65);
    position: absolute;
    top: 0;
    left: 0;
    display: none;
    color: #fff;
    text-align: center;
    line-height: 34px;
    cursor: pointer;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    border-radius: 4px;
  }
  &:hover{
    .hover{
      display: block;
    }
  }
}
.windows_list{
  // min-height: 600px;
  ul{
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    li{
      flex: 0;
      padding: 0 15px;
      position: relative;
      transition: all 0.3s;
      p{
        font-size: 14px;
        font-weight: 400;
        color: #000000;
        line-height: 20px;
        margin: 10px 0 0 0;
        span{
          width: 10px;
          display: inline-block;
          margin-right: 4px;
        }
      }
      p.iconsname{
        margin-top: 0;
        margin-bottom: 20px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(0,0,0,0.35);
        i{
          margin-right: 2px;
        }
      }
      .icons{
        width: 194px;
        height: 121px;
        background: #EDEFF2;
        border-radius: 4px;
        text-align: center;
        line-height: 120px;
        i{
          font-size: 40px;
          width: 48px;
          height: 48px;
          color: #3692F9;
          line-height: 124px;
        }
      }
      .hover{
        width: 194px;
        height: 121px;
        background: rgba(0,0,0,0.65);
        position: absolute;
        top: 0;
        left: 15px;
        display: none;
        color: #fff;
        text-align: center;
        line-height: 120px;
        cursor: pointer;
        transition: all 0.3s;
        border-radius: 4px;
        div{
          width: 40px;
          height: 40px;
          float: left;
          text-align: center;
          line-height: 50px;
          margin-top: 40px;
          margin-left: 10px;
          transition: all 0.3s;
          &:hover{
            transition: all 0.3s;
            background: rgba(255,255,255,0.1);
          }
          i{
            font-size: 26px;
            color: #fff;
          }
        }
      }
      img{
        width: 194px;
        height: 121px;
        background: #EDEFF2;
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.05);
      }
      &:hover{
        .hover{
          display: block;
        }
      }
    }
  }
}
.ant-dropdown-menu-item:hover{
  background: #e6f7ff !important;
}
/deep/ .ant-radio-button-wrapper{
  width: 32px;
  height: 32px;
  padding: 0;
  text-align: center;
  line-height: 32px;
  i{
    font-size: 16px;
  }
}
/deep/ .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):first-child{
  background: #EFF0F1;
  border-radius: 3px;
}
/deep/ .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled){
  background: #EFF0F1;
  border-radius: 3px;
}
/deep/ .ant-radio-button-wrapper:hover{
  color: rgba(0,0,0,0.65);
}
/deep/ .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled){
  color: rgba(0,0,0,0.65);
}
/deep/ .ant-radio-button-wrapper{
  border:none
}
/deep/ .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):focus-within{
  box-shadow: none
}
/deep/ .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before{
  background-color: #fff;
}
/deep/ .ant-radio-button-wrapper:not(:first-child)::before{
 content: none;
}
.ant-image-preview-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  height: 100%;
  background-color: #00000073;
}
.ant-image-preview-wrap{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  outline: 0;
  z-index: 1080;
  -webkit-overflow-scrolling: touch;
  .ant-image-preview {
    pointer-events: none;
    height: 100%;
    text-align: center;
    .ant-image-preview-body {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      overflow: hidden;
      .ant-image-preview-img-wrapper{
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transition: transform .3s cubic-bezier(.215,.61,.355,1) 0s;
        &::before{
          display: inline-block;
          width: 1px;
          height: 50%;
          margin-right: -1px;
          content: '';
        }
      }
      .ant-image-preview-operations {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        color: #000000d9;
        font-size: 14px;
        font-variant: tabular-nums;
        line-height: 1.5715;
        font-feature-settings: "tnum";
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        width: 100%;
        color: #ffffffd9;
        list-style: none;
        background: rgba(0,0,0,.65);
        pointer-events: auto;
        .ant-image-preview-operations-operation {
          margin-left: 12px;
          padding: 12px;
          cursor: pointer;
          i{
            font-size: 18px;
          }
        }
      }
    }
  }
}
.loadimg{
  background: #f0f2f5;
  width: 100%;
  height: 800px;
  display: block;
  position: absolute;
  z-index: 100;
}
// 抽屉
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
</style>
