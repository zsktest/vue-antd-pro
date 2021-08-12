<template>
  <div>
    <a-row :gutter="24">
      <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '24px' }">
        <!-- <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :loading="loading" :bordered="false" title="开发者统计" :style="{ height: '100%' }">
          <div>asd</div>
        </a-card> -->
        <div class="account">
          <div class="account_title">
            <h1>企业列表</h1>
          </div>
          <div class="table-page-search-wrapper" style="padding:0 24px">
            <a-form-model :model="form" layout="inline">
              <a-row :gutter="40">
                <a-col :md="8" :sm="24">
                  <a-form-model-item ref="robotName" label="企业名称" prop="robotName">
                    <a-input v-model="form.robotName" placeholder="企业名称" allowClear/>
                  </a-form-model-item>
                </a-col>
                <a-form-model-item>
                  <a-button
                    class="search"
                    type="primary"
                    html-type="submit"
                    @click="setSearch(form)"
                  >查询</a-button>
                </a-form-model-item>
              </a-row>
            </a-form-model>
            <div class="bt"></div>
          </div>
          <div class="application_sear">
            <a-table
              :row-key="record => record.uuid"
              :columns="columns"
              :data-source="listData"
              :pagination="pagination"
              :loading="loading"
              @change="handleTableChange"
            >
              <template slot="name" slot-scope="text, record">
                <editable-cell :uuid="record.uuid" :text="record.thirdName" @change="onCellChange(record, 'name', $event)" />
              </template>
              <template slot="robotQuota" slot-scope="text, record">
                <span>{{ record.robotLicenseCount }}/{{ record.robotQuota }}</span>
              </template>
              <template slot="studioQuota" slot-scope="text, record">
                <span>{{ record.studioLicenseCount }}/{{ record.studioQuota }}</span>
              </template>
            </a-table>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { thirdList, thirdUpdateName } from '@/api/user'
const EditableCell = {
  template: `
      <div class="editable-cell">
        <div v-if="editable" class="editable-cell-input-wrapper">
          <a-input :value="value" @change="handleChange" @pressEnter="check" /><a-icon
            type="check"
            class="editable-cell-icon-check"
            @click="check"
          />
        </div>
        <div v-else class="editable-cell-text-wrapper">
          {{ value || ' ' }}
          <a-icon type="edit" class="editable-cell-icon" @click="edit" />
        </div>
      </div>
    `,
  props: {
    text: String,
    uuid: String
  },
  data () {
    return {
      value: this.text,
      companyThirdUuid: this.uuid,
      editable: false
    }
  },
  methods: {
    handleChange (e) {
      const value = e.target.value
      this.value = value
    },
    check () {
      const data = {
        'companyThirdUuid': this.companyThirdUuid,
        'thirdName': this.value
      }
      thirdUpdateName(data).then(res => {
        if (res.code === 200) {
          this.editable = false
          this.$emit('change', this.value)
          this.$message.success('企业名称修改成功')
        } else {
          if (res.code === 500) {
            this.$message.warning('系统异常！')
          } else {
            this.$message.warning(res.msg)
          }
        }
      })
    },
    edit () {
      this.editable = true
    }
  }
}
// 表格项
const columns = [
  {
    title: '企业名称',
    dataIndex: '',
    scopedSlots: { customRender: 'name' }
    // width: '20%'
  },
  {
    title: '开始时间',
    dataIndex: 'startTime'
    // width: '20%'
  },
  {
    title: '结束时间',
    dataIndex: 'endTime'
  },
  {
    title: 'robot额度',
    dataIndex: 'robotQuota',
    scopedSlots: { customRender: 'robotQuota' }
  },
  {
    title: 'studio额度',
    dataIndex: 'studioQuota',
    scopedSlots: { customRender: 'studioQuota' }
  }
]
export default {
  components: {
    EditableCell
  },
  data () {
    return {
      form: {
        robotName: ''
      },
      enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
      loading: false,
      columns,
      listData: [],
      pagination: {
        showQuickJumper: true
      },
      visible: false,
      postData: {
        enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
        key: '',
        page: 1,
        size: 10
      },
      loadings: false
    }
  },
  mounted () {
    this.accountUsery(this.postData)
    // this.$spm('o.c')
  },
  methods: {
    onCellChange (key, dataIndex, value) {
      this.accountUsery(this.postData)
    },
    // 获取列表
    accountUsery (data) {
      this.loading = true
      thirdList(data).then(res => {
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
    // 点击搜索
    setSearch (val) {
      this.postData = {
        enterpriseUuid: this.$store.getters.userInfo.enterpriseUuid || '',
        key: val.robotName,
        page: 1,
        size: 10
      }
      this.accountUsery(this.postData)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .editable-cell {
  position: relative;
}
/deep/ .editable-cell-input-wrapper,
/deep/ .editable-cell-text-wrapper {
  padding-right: 24px;
  box-sizing: border-box;
}
/deep/ .editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}
/deep/ .editable-cell-icon{
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}
/deep/.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}
/deep/ .editable-cell-icon {
  line-height: 18px;
  display: none;
}
/deep/ .editable-cell-icon-check {
  line-height: 28px;
}
/deep/ .editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
/deep/ .editable-cell-icon:hover,
/deep/ .editable-cell-icon-check:hover {
  color: #108ee9;
}
/deep/ .editable-add-btn {
  margin-bottom: 8px;
}
.acconut_rightuser{
  cursor: pointer;
  float: right;
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
  margin-right: 37px;
  i{
    color: #fff;
    font-weight: bold;
    font-size: 16px;
  }
}
</style>
