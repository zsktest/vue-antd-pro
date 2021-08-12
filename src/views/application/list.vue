<template>
  <div>
    <a-row :gutter="24">
      <a-col :sm="24" :md="24" :xl="24">
        <!-- <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :loading="loading" :bordered="false" title="开发者统计" :style="{ height: '100%' }">
          <div>asd</div>
        </a-card> -->
        <div class="account right_content">
          <div class="account_title">
            <h1>应用管理</h1>
          </div>
          <div class="table-page-search-wrapper" style="padding:0 24px">
            <a-form-model :model="form" layout="inline">
              <a-row :gutter="40">
                <a-col :md="8" :sm="24">
                  <a-form-model-item ref="robotName" label="应用名称" prop="robotName">
                    <a-input v-model="form.robotName" placeholder="请输入应用名称" allowClear/>
                  </a-form-model-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <a-form-model-item label="所有者">
                    <a-auto-complete
                      v-model="form.robotOwnerUuid"
                      :data-source="dataSource"
                      placeholder="员工的中文名称或昵称"
                      allowClear
                      @search="onSearch">
                      <template slot="dataSource">
                        <a-select-option v-for="(item,index) in dataSource" :key="index" :value="item.userUuid">账号：{{ item.account }}</a-select-option>
                      </template>
                    </a-auto-complete>
                  </a-form-model-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <a-form-model-item label="排序">
                    <a-select placeholder="选择时间" allowClear v-model="form.sortBy">
                      <a-select-option value="createTime">创建时间</a-select-option>
                      <a-select-option value="updateTime">更新时间</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :md="4" :sm="24" >
                  <a-form-model-item>
                    <a-button
                      class="search"
                      type="primary"
                      html-type="submit"
                      @click="setSearch(form)"
                    >查询</a-button>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-form-model>
            <div class="bt"></div>
          </div>
          <div class="application_sear">
            <a-table
              :row-key="record => record.robotUuid"
              :columns="columns"
              :data-source="listData"
              :pagination="pagination"
              :loading="loading"
              @change="handleTableChange"
            >
              <template slot="action" slot-scope="text, record">
                <span>
                  <!-- <a @click="handleRead(record.robotUuid)">查看</a> -->
                  <a :href="'../application/detail?robotUuid='+record.robotUuid">查看</a>
                  <!-- <a-divider type="vertical" /> -->
                  <a-dropdown>
                    <a class="ant-dropdown-link">
                      更多 <a-icon type="caret-down" />
                    </a>
                    <a-menu slot="overlay">
                      <!-- <a-menu-item @click="robot('View',record)">查看应用</a-menu-item>
                      <a-menu-item @click="robot('Run',record)">运行应用</a-menu-item>
                      <a-menu-item>
                        <a href="javascript:;" @click="robots(record)">修改应用名</a>
                      </a-menu-item> -->
                      <a-menu-item>
                        <a href="javascript:;" @click="confirm(record)">转交所有者</a>
                      </a-menu-item>
                      <a-menu-item>
                        <a href="javascript:;" @click="getdelete(record)">删除</a>
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </span>
              </template>
            </a-table>
          </div>
        </div>
      </a-col>
    </a-row>
    <!-- 转交应用 -->
    <a-modal v-model="delDelete" title="请指定接受员工" on-ok="modelDelete">
      <p>请选择要接受应用的用户</p>
      <a-auto-complete
        v-model="userName"
        :data-source="deldataSource"
        style="width: 350px"
        placeholder="员工的中文名称或昵称"
        @search="onSearchhov"
        @select="onSelect">
        <template slot="dataSource">
          <a-select-option v-for="(item,index) in deldataSource" :key="index" :value="item.userUuid">账号：{{ item.account }} &nbsp;&nbsp;&nbsp; 姓名：{{ item.name }}</a-select-option>
        </template>
      </a-auto-complete>
      <template slot="footer">
        <a-button @click="CancelmodelDelete">
          取消
        </a-button>
        <a-button type="primary" :loading="loadings" @click="modelDelete">
          确定
        </a-button>
      </template>
    </a-modal>
    <!-- 转交应用 -->
    <a-modal v-model="RobotInfo" title="提示" on-ok="modelDelete">
      <p>请输入新的应用名</p>
      <a-input v-model="robname.name" placeholder="请输入应用名" />
      <template slot="footer">
        <a-button @click="CancelRobotInfo">
          取消
        </a-button>
        <a-button type="primary" :loading="loadingRobt" @click="robotInfo">
          确定
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { applicaList, userList, deleteRobot, translateSpecifyRobotOwner, updateRobotInfo } from '@/api/user'
// 表格项
const columns = [
  {
    title: '应用名称',
    dataIndex: 'robotName'
    // width: '20%'
  },
  {
    title: '类型',
    dataIndex: 'robotTypeName'
  },
  {
    title: '归属账号',
    dataIndex: 'ownerName'
  },
  {
    title: '最近更新',
    dataIndex: 'updateTime'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime'
  },
  // {
  //   title: '获取人数',
  //   dataIndex: 'currentAcquireCount'
  // },
  {
    title: '操作',
    dataIndex: '',
    width: '14%',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  data () {
    return {
      form: {
        robotName: '',
        robotOwnerUuid: '',
        sortBy: 'createTime'
      },
      enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
      loading: false,
      columns,
      listData: [],
      dataSource: [],
      pagination: {
        showQuickJumper: true
      },
      postData: {
        enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
        robotName: '',
        robotOwnerUuid: '',
        sortBy: 'createTime',
        page: 1,
        size: 10
      },
      delDelete: false,
      loadings: false,
      deldataSource: [],
      userName: '',
      receiveUserUuid: '',
      RobotInfo: false,
      loadingRobt: false,
      robname: {
        name: '',
        robotUuid: ''
      }
    }
  },
  mounted () {
    this.accountUsery(this.postData)
    this.$spm('o.c')
  },
  methods: {
    // 获取列表
    accountUsery (data) {
      this.loading = true
      applicaList(data).then(res => {
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
    // 查看
    handleRead (key) {
      this.$router.push({
        path: '/application/detail',
        query: {
          robotUuid: key
        }
      })
    },
    // 获取企业用户列表
    onSearch (val) {
      const data = {
        enterpriseUuid: this.enterpriseUuid,
        key: val
      }
      userList(data).then(res => {
        this.dataSource = res.data
      })
    },
    // 点击搜索
    setSearch (val) {
      this.postData = {
        enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
        robotName: val.robotName,
        robotOwnerUuid: val.robotOwnerUuid,
        sortBy: val.sortBy,
        page: 1,
        size: 10
      }
      this.accountUsery(this.postData)
    },
    // 删除
    getdelete (val) {
      const data = {
        enterpriseUuid: this.enterpriseUuid,
        robotUuid: val.robotUuid
      }
      const _this = this
      _this.$confirm({
        title: '提示',
        content: h => <div>应用在此处删除后，开发应用列表、获取应用列表和企业市场中，都不再显示，且不可恢复。</div>,
        // content: h => <div>您即将删除应用【{val.robotName}】。此操作将从<span style="color: #ff525b; ">企业市场、开发应用列表和获取应用列表</span>中删除此应用，且<span style="color: #ff525b; ">且不可恢复</span>是否继续?</div>,
        okText: '确定',
        cancelText: '取消',
        okType: 'danger',
        onOk () {
          deleteRobot(data).then(res => {
            if (res.code === 200) {
              _this.deletes(1, '应用删除成功')
              _this.accountUsery(_this.postData)
            } else {
              _this.deletes(2, res.msg)
            }
          })
        },
        onCancel () {
        }
      })
    },
    // 删除提示
    deletes (index, test) {
      if (index === 1) {
        this.$message.success(test)
      } else if (index === 2) {
        this.$message.warning(test)
      }
    },
    // 转交用户弹窗
    confirm (val) {
      this.userName = ''
      this.deldataSource = []
      this.receiveUserUuid = val.robotUuid
      this.delDelete = true
    },
    // 转交用户提交
    modelDelete () {
      this.loadings = true
      const data = {
        enterpriseUuid: this.enterpriseUuid,
        robotUuid: this.receiveUserUuid,
        receiveUserUuid: this.userName
      }
      translateSpecifyRobotOwner(data).then(res => {
        if (res.code === 200) {
          this.delDelete = false
          this.loadings = false
          this.$message.success('转移应用owner完成')
          this.accountUsery(this.postData)
        } else {
          this.delDelete = false
          this.loadings = false
          this.$message.error(res.msg)
        }
      })
    },
    // 取消转交
    CancelmodelDelete () {
      this.delDelete = false
    },
    onSearchhov (val) {
      const data = {
        enterpriseUuid: this.enterpriseUuid,
        key: val
      }
      userList(data).then(res => {
        this.deldataSource = res.data
      })
    },
    onSelect (val) {
      this.userName = val
    },
    // 唤起客户端
    robot (test, robotUuid) {
      console.log('ShadowBot:' + test + '?robot-uuid=' + robotUuid.robotUuid + '&version-uuid=' + robotUuid.robotVersionUuid)
      window.location.href = 'ShadowBot:' + test + '?robot-uuid=' + robotUuid.robotUuid + '&version-uuid=' + robotUuid.robotVersionUuid
    },
    // 唤起修改应用名
    robots (val) {
      this.robname.name = val.robotName
      this.robname.robotUuid = val.robotUuid
      this.RobotInfo = true
    },
    // 修改应用名
    robotInfo (val) {
      this.loadingRobt = true
      const data = this.enterpriseUuid
      const form = {
        robotPackage: {
          name: this.robname.name
        },
        uuid: this.robname.robotUuid
      }
      updateRobotInfo(data, form).then(res => {
        if (res.code === 200) {
          this.loadingRobt = false
          this.RobotInfo = false
          this.deletes(1, '应用名修改成功')
          this.accountUsery(this.postData)
        } else {
          this.deletes(2, res.msg)
          this.loadingRobt = false
          this.RobotInfo = false
        }
      })
    },
    // 取消修改应用名
    CancelRobotInfo () {
      this.RobotInfo = false
    }
  }
}
</script>
<style lang="less" scoped>
</style>
