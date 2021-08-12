<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <h2>控制台登录</h2>
      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="账户"
          v-decorator="[
            'username',
            {
              rules: [{ required: true, message: '请输入账号' }],
              validateTrigger: 'change',
              initialValue: username || undefined
            }
          ]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input-password
          size="large"
          placeholder="密码"
          v-decorator="[
            'password',
            {
              rules: [{ required: true, message: '请输入密码' }],
              validateTrigger: 'blur',
              initialValue: password || undefined
            }
          ]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input-password>
      </a-form-item>

      <a-form-item>
        <a-checkbox
          v-decorator="[
            'rememberMe',
            {
              valuePropName: 'checked',
              initialValue: checkboxname
            }
          ]">自动登录</a-checkbox>
        <p
          class="forge-password"
          style="float: right;"
          @click="warning"
        >忘记密码</p>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >确定</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getInfo } from '@/api/login'
import notification from 'ant-design-vue/es/notification'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
// import { timeFix } from '@/utils/util'

export default {
  components: {
  },
  data () {
    return {
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      username: '',
      password: '',
      enterpriseType: '',
      checkboxname: false,
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      }
    }
  },
  created () {
    // eslint-disable-next-line eqeqeq
    if (!localStorage.getItem('username') == '') {
      this.checkboxname = true
    }
    this.username = localStorage.getItem('username')
    this.password = localStorage.getItem('password')
  },
  mounted () {
    this.$spm('o.a')
  },
  methods: {
    warning () {
      let str = ''
      switch (process.env.NODE_ENV) {
        case 'production':
          str = 'https://content.winrobot360.com/#/user/password?sel=enterprise'
          break
        case 'staging':
          str = 'https://staging-content.winrobot360.com/#/user/password?sel=enterprise'
          break
        case 'dev':
          str = 'http://dev-content.winrobot360.com/#/user/password?sel=enterprise'
          break
        default:
          str = 'https://content.winrobot360.com/#/user/password?sel=enterprise'
      }
      window.open(str, '_blank')
    },
    ...mapActions(['Login']),
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        Login
      } = this

      state.loginBtn = true

      validateFields((err, values) => {
        if (!err) {
          const loginParams = { ...values }
          loginParams.username = values.username + '@@enterprise'
          loginParams.password = values.password
          loginParams.grant_type = 'password'
          loginParams.scope = 'all'
          Login(loginParams)
            .then((res) => {
              this.$spm('o.a.1')
              if (values.rememberMe === true) {
                localStorage.setItem('username', values.username)
                localStorage.setItem('password', values.password)
              }
              // this.loginSuccess()
              this.geygetInfo()
            })
            .catch(err => {
              this.requestFailed(err)
            })
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    geygetInfo () {
      getInfo().then(response => {
        this.enterpriseType = response.data.enterpriseType
        if (response.data.enterpriseRoleCode === 'e_owner' || response.data.enterpriseRoleCode === 'e_admin') {
          this.loginSuccess()
        } else {
          notification.error({
            message: '错误',
            description: '当前用户不具备登录控制台的权限'
          })
          storage.remove(ACCESS_TOKEN)
        }
      })
    },
    loginSuccess (res) {
      if (this.enterpriseType === 'integrate') {
        this.$router.push({ path: '/author/list' })
      } else if (this.enterpriseType === 'public') {
        this.$router.push({ path: '/home/index' })
      } else if (this.enterpriseType === 'private') {
          this.$router.push({ path: '/account/list' })
      }
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        // this.$notification.success({
        //   message: '欢迎',
        //   description: `${timeFix()}，欢迎回来`
        // })
      }, 1000)
      this.isLoginError = false
    },
    requestFailed (err) {
      this.isLoginError = true
      this.$notification['error']({
        message: '错误',
        description: err || '请求出现错误，请稍后再试',
        duration: 4
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-input-affix-wrapper:hover .ant-input:not(.ant-input-disabled){
  border-color: #ff7a7d;
}
/deep/.ant-input:focus{
  border-color: #ff7a7d;
  box-shadow: 0 0 0 2px rgba(255,82,91, 0.2);
}
/deep/.ant-input:hover{
  border-color: #ff7a7d;
}
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #626878;
    cursor: pointer;
  }
  h2{
    font-size: 22px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #192544;
    margin-bottom: 30px;
  }
  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
    background: #ff525b;
    border:1px solid #ff525b;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
