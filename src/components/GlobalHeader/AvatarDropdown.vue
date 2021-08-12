<template>
  <div>
    <a-dropdown placement="bottomRight">
      <span class="ant-pro-account-avatar">
        <span v-if="nickname" class="nickname">{{ nickname.substring(0,1) }}</span>
        <span>{{ nickname }}<a-icon style="padding-left:6px" type="down" /></span>
      </span>
      <a-menu slot="overlay">
        <a-menu-item>
          <a href="javascript:;" @click="handleLogout" style="color:#595959;text-align:center">退出</a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import { Modal } from 'ant-design-vue'
import { mapGetters } from 'vuex'
export default {
  name: 'AvatarDropdown',
  props: {
    currentUser: {
      type: Object,
      default: () => null
    },
    menu: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters(['nickname', 'avatar'])
  },
  methods: {
    handleToCenter () {
      this.$router.push({ path: '/account/center' })
    },
    handleToSettings () {
      this.$router.push({ path: '/account/settings' })
    },
    handleLogout (e) {
      Modal.confirm({
        title: this.$t('提示'),
        content: this.$t('确定退出吗？'),
        onOk: () => {
          return this.$store.dispatch('Logout').then(() => {
            setTimeout(() => {
              this.$router.push({ name: 'login' })
              window.location.reload()
            }, 16)
          })
        },
        onCancel () {}
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
.nickname{
  width: 24px;
  height: 24px;
  background: rgba(248,117,117,1);
  border-radius: 50%;
  float: left;
  line-height: 24px;
  text-align: center;
  margin-top: 13px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(255,255,255,1);
  margin-right: 15px;
}
</style>
