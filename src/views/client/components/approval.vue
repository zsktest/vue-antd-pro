<template>
  <div>
    <a-row :gutter="24">
      <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '24px' }">
        <div class="account">
          <div class="account_title">
            <h1>申请审批</h1>
            <!-- <span>提示：基础账号申请默认自动审批通过，如需修改请进入控制台设置调整</span> -->
            <div class="bt"></div>
          </div>
          <div style="padding:0 24px;">
            <a-table
              :row-key="record => record.enterpriseApprovalUuid"
              :columns="columns"
              :data-source="listData"
              :pagination="pagination"
              :loading="loading"
              @change="handleTableChange"
            >
              <template slot="imsl" slot-scope="text, record">
                {{ record.approvalStatusName }}
              </template>
              <template slot="action" slot-scope="text, record">
                <span v-if="record.approvalStatus === 'wait_approval'">
                  <a href="javascript:;" @click="postapprovalAccept(record)">通过</a>
                  <!-- <a href="javascript:;"  style="margin-left: 15px;"></a> -->
                  <a-popconfirm placement="top" ok-text="确定" cancel-text="取消" @confirm="postapprovalReject(record)">
                    <template slot="title">
                      <p>提示</p>
                      <p>确认驳回'{{ record.applyAccount }}'的申请?</p>
                    </template>
                    <a href="javascript:;" style="margin-left: 15px;">驳回</a>
                  </a-popconfirm>
                </span>
              </template>
            </a-table>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { approvalQueryApprovalList, approvalAccept, approvalReject } from '@/api/user'
// 表格项
const columns = [
  {
    title: '申请日期',
    dataIndex: 'applyTime'
  },
  {
    title: '申请账号',
    dataIndex: 'applyAccount'
  },
  {
    title: '申请人',
    dataIndex: 'applyUserName'
  },
  {
    title: '申请内容',
    dataIndex: 'applyContent'
  },
  {
    title: '申请备注',
    width: 200,
    dataIndex: 'applyRemark'
  },
  {
    title: '状态',
    dataIndex: 'approvalStatusName',
    key: 'approvalStatusName',
    slots: { title: 'customTime' },
    scopedSlots: { customRender: 'imsl' },
    filters: [
      {
        text: '待审批',
        value: 'wait_approval'
      },
      {
        text: '已通过',
        value: 'approval_accept'
      },
      {
        text: '未通过',
        value: 'approval_reject'
      },
      {
        text: '已过期',
        value: 'approval_expired'
      }
    ],
    filterMultiple: false
  },
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
      columns,
      listData: [],
      pagination: {
        showQuickJumper: true
      },
      loading: false,
      nameappro: false,
      postData: {
        enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
        approvalStatus: '',
        page: 1,
        size: 10
      }
    }
  },
  // eslint-disable-next-line vue/require-prop-types
  props: [ 'rovalCount' ],
  watch: {
    rovalCount (data) {
      if (data) {
        this.accountUsery(this.postData)
      }
    }
  },
  mounted () {
    this.accountUsery(this.postData)
  },
  methods: {
    // 通过
    postapprovalAccept (index) {
      this.nameappro = false
      const data = {
        enterpriseApprovalUuid: index.enterpriseApprovalUuid
      }
      approvalAccept(data).then(res => {
        if (res.code === 200) {
          this.accountUsery(this.postData)
          this.$emit('noApprovalCount', this.nameappro)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 驳回
    postapprovalReject (index) {
      this.nameappro = false
      const data = {
        enterpriseApprovalUuid: index.enterpriseApprovalUuid
      }
      approvalReject(data).then(res => {
        if (res.code === 200) {
          this.accountUsery(this.postData)
          this.$emit('noApprovalCount', this.nameappro)
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 获取列表
    accountUsery (data) {
      this.loading = true
      approvalQueryApprovalList(data).then(res => {
        if (res.code === 200) {
          const pagination = { ...this.pagination }
          pagination.total = res.page.total
          pagination.current = res.page.page
          this.loading = false
          this.listData = res.data
          this.pagination = pagination
          this.$emit('noApprovalCount', this.nameappro)
        } else {
          this.$emit('noApprovalCount', this.nameappro)
          this.loading = false
          this.listData = []
          if (res.code === 500) {
            this.$message.warning('系统异常！')
          } else {
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
      if (!filters.approvalStatusName) {
        filters.approvalStatusName = []
      }
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.postData.approvalStatus = filters.approvalStatusName[0] || filters.approvalStatusName
      this.postData.page = pager.current
      this.accountUsery(this.postData)
    }
  }
}
</script>
<style lang="less" scoped>
.account{
  background: #fff;
  .account_title{
    min-height: 70px;
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
    span{
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #979DA5;
      line-height: 34px;
      margin-top: 30px;
      margin-top: 18px;
      display: inline-block;
    }
  }
}
</style>
