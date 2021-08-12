<template>
  <div>
    <a-row :gutter="24">
      <a-col :sm="24" :md="24" :xl="24">
        <div class="account right_content">
          <a-tabs :activeKey="activekey" @change="callback">
            <a-tab-pane :key="1" tab="执行记录">
              <listleft :partInfo="infos" :key="lefttimer"></listleft>
            </a-tab-pane>
            <a-tab-pane :key="2" tab="计划列表" force-render>
              <listright @callBackInfo="handleInfo" :partInfo="page" :key="righttimer"></listright>
            </a-tab-pane>
            <a-button slot="tabBarExtraContent" style="margin:10px 10px 0 0" @click="refresh" icon="reload">刷新</a-button>
            <div slot="tabBarExtraContent" class="acconut_rightuser" @click="showModal('')"><a-icon type="plus" />新建计划</div>
          </a-tabs>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import listleft from './components/listLeft.vue'
import listright from './components/listRight.vue'
// 表格项
export default {
  components: {
    listright,
    listleft
  },
  data () {
    return {
      activekey: this.$route.query.key || 1,
      page: this.$route.query.page,
      infos: '',
      lefttimer: '',
      righttimer: ''
    }
  },
  mounted () {
    this.callback(parseInt(this.activekey))
  },
  methods: {
    // 刷新页面
    refresh () {
      this.$router.push({ query: {} })
      if (this.activekey === 1) {
        this.lefttimer = new Date().getTime()
      } else {
        this.righttimer = new Date().getTime()
      }
    },
    // 切换页面
    callback (key) {
      this.activekey = key
    },
    handleInfo (data) {
      this.infos = data
      this.activekey = 1
      this.callback(this.activekey)
    },
    // 添加成员
    showModal (last) {
      this.$router.push({
        path: '/plans/add',
        query: {
          uuid: last.uuid
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.ant-tabs-bar{
  margin: 0;
}
/deep/ .ant-tabs-nav .ant-tabs-tab{
  padding: 16px 16px;
}
.acconut_rightuser{
  cursor: pointer;
  float: right;
  margin-top: 9px;
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
  margin-right: 24px;
  i{
    color: #fff;
    font-weight: bold;
    font-size: 16px;
  }
}
</style>
