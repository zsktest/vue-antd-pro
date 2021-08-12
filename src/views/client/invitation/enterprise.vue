<template>
  <div class="enterprise">
    <div class="main">
      <img src="@/assets/img/bg_down.png" alt="" class="bg_down">
      <div class="left">
        <div class="left_blans">
          <a href="https://www.winrobot360.com/" target="_blank"><img src="https://winrobot-pub-a.oss-cn-hangzhou.aliyuncs.com/static/home/img/logo_fort.png" alt="RPA"></a>
        </div>
        <div class="title">影刀, 每一个人都能用的RPA</div>
        <div class="vides">
          <video autoplay loop muted>
            <source src="@/assets/img/new.mp4" type="video/mp4"/>
          </video>
          <img src="@/assets/img/bg_circle_big.png" alt="RPA" class="bg_circle_small">
          <img src="@/assets/img/bg_dot.png" alt="RPA" class="bg_dot">
          <img src="@/assets/img/cute2.png" alt="RPA" class="cute2">
          <img src="@/assets/img/cute1.png" alt="RPA" class="cute1">
          <img src="@/assets/img/bg_others.png" alt="RPA" class="bg_others">
        </div>
        <div class="footer1">
          <img src="@/assets/img/man.png" alt="RPA" class="man">
          <div>
            <img src="@/assets/img/erweima.png" alt="RPA" class="chare_erweima">
            <p>小助手微信</p>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="share_banner">
          <a @click="downClient('nav')" class="downClient">免费下载</a>
          <img src="@/assets/img/bg_circle_big2.png" alt="RPA" class="bg_circle_big2">
          <img src="@/assets/img/bg_circle_small.png" alt="RPA" class="bg_circle_small">
        </div>
        <div class="share_body_right">
          <div class="enterprise_top">
            <img :src="enterpriseIcon" alt="">
            <h1><span>{{ inviteLinklist.inviteUserName }}</span>邀请你加入</h1>
            <div>{{ inviteLinklist.enterpriseName }}</div>
          </div>
          <div class="enterprise_input">
            <a-form-model
              ref="ruleForm"
              :model="form"
              :rules="rules"
              :wrapper-col="wrapperCol">
              <a-form-model-item ref="name" prop="name">
                <a-input v-model="form.name" placeholder="请输入姓名"><a-icon slot="prefix" type="idcard" style="color:rgba(0,0,0,.25)" /></a-input>
              </a-form-model-item>
              <a-form-model-item ref="account" prop="account">
                <a-input v-model="form.account" placeholder="请输入登录账号"><a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" /></a-input>
              </a-form-model-item>
              <a-form-model-item ref="" prop="" class="useraccount" style="margin-bottom:5px;margin-top:-10px">
                <div style="height: 20px;line-height: 8px;">{{ form.account }}@{{ inviteLinklist.abbr }}</div>
              </a-form-model-item>
              <a-form-model-item ref="password" prop="password">
                <a-input type="password" v-model="form.password" placeholder="请设置密码"><a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" /></a-input>
              </a-form-model-item>
              <a-form-model-item ref="phone" prop="phone">
                <a-input v-model="form.phone" placeholder="用于找回密码"><a-icon slot="prefix" type="phone" style="color:rgba(0,0,0,.25)" /></a-input>
              </a-form-model-item>
              <a-form-model-item ref="verifyCode" prop="verifyCode">
                <a-input v-model="form.verifyCode" :maxLength="6" style="width:60%;height:40px;" placeholder="请输入短信验证码"><a-icon slot="prefix" type="carry-out" style="color:rgba(0,0,0,.25)" /></a-input>
                <a-button style="width:38%;margin-left: 2%;height:41px;" :disabled="totalTime <60" @click="code_iphone">{{ content }}</a-button>
              </a-form-model-item>
              <a-form-model-item class="primary">
                <a-button type="primary" style="margin-top:10px" @click="onSubmit">确认加入</a-button>
              </a-form-model-item>
            </a-form-model>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { applySendVerifyCode, approvalApplyAccount, queryApplyEnterpriseInfo, recordLog } from '@/api/user'
export default {
  data () {
    return {
      wrapperCol: { span: 24 },
      inviteKey: this.$route.query.inviteKey,
      form: {
        name: '',
        account: '',
        password: '',
        phone: '',
        inviteLinkCode: this.$route.query.inviteKey,
        verifyCode: '',
        verifyCodeUuid: ''
      },
      totalTime: 60,
      content: '发送验证码',
      inviteLinklist: '',
      enterpriseIcon: '',
      rules: {}
    }
  },
  mounted () {
    this.getqueryApplyEnterpriseInfo()
  },
  methods: {
    // 下载埋点
    Console_share () {
      window.location.href = 'https://winrobot-pub-a.oss-cn-hangzhou.aliyuncs.com/client/ShadowBotSetup.exe'
      const data = {
        spm: 'w.a',
        tags: 'src:console'
      }
      recordLog(data).then(res => {
      })
    },
    // 获取分享信息
    getqueryApplyEnterpriseInfo () {
      const data = {
        inviteLinkCode: this.form.inviteLinkCode
      }
      queryApplyEnterpriseInfo(data).then(res => {
        if (res.code === 200) {
          this.inviteLinklist = res.data
          this.enterpriseIcon = res.data.enterpriseIcon || 'https://winrobot-pub-a.oss-cn-hangzhou.aliyuncs.com/images/f7/05/ab1a364b117127f08fe0ba32cda7.jpg'
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 提交表单
    onSubmit () {
      if (this.form.name === '') {
        this.$message.error('姓名不能为空！')
        return false
      }
      if (this.form.account === '') {
        this.$message.error('登录账号不能为空！')
        return false
      }
      if (/[`~!@#$%^&*()_+<>?:"{/;'[\]]/.test(this.form.account)) {
        this.$message.error('不能使用特殊字符！')
        return false
      }
      if (this.form.password === '') {
        this.$message.error('密码不能为空！')
        return false
      }
      if (this.form.phone === '') {
        this.$message.error('手机号不能为空！')
        return false
      }
      if (this.form.verifyCode === '') {
        this.$message.error('验证码不能为空！')
        return false
      }
      if (this.form.verifyCode.length < 6) {
        this.$message.error('验证码须6位数')
        return false
      }
      approvalApplyAccount(this.form).then(res => {
        if (res.code === 200) {
          this.$router.push({
            path: '/client/invitation/success',
            query: {
              inviteKey: this.inviteKey,
              user: this.form.account + '@' + this.inviteLinklist.abbr,
              registerStatus: res.data.registerStatus
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 60秒倒计时
    code () {
      const data = {
        enterpriseUuid: this.enterpriseUuid,
        phone: this.form.phone
      }
      applySendVerifyCode(data).then(res => {
        if (res.code === 200) {
          this.form.verifyCodeUuid = res.data.verifyCodeUuid
          const clock = window.setInterval(() => {
            this.content = this.totalTime + 's后重新发送'
            this.totalTime--
            if (this.totalTime < 0) {
                this.totalTime = 60
                this.content = '重新发送验证码'
                window.clearInterval(clock)
            }
          }, 1000)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 获取验证码
    code_iphone () {
      // eslint-disable-next-line no-unused-vars
      const sphone = this.form.phone
      if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(sphone))) {
        this.$message.error('请输入正确的手机号！')
        return false
      } else {
        this.code()
        this.phone_code = true
      }
    }
  }
}
</script>
<style lang="less" scoped>
::selection{
  background: #389eff;
}
/deep/ input.ant-input{
  height: 40px;
}
/deep/.ant-form-item{
  margin-bottom: 20px;
}
.enterprise{
  height: 100%;
  background: #fff;
  overflow: hidden;
}
.main{
  flex: 1 1;
  width: 100%;
  height: 100%;
  display: flex;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background-color: #fff;
  .bg_down{
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  .left{
    position: relative;
    flex: 6 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 2.7vw;
    .left_blans{
      width: 78.8vh;
      position: absolute;
      margin: 30px 0 0 50px;
      height: 36px;
      display: flex;
      align-items: center;
      z-index: 11;
      img{
        width: 85px;
        margin-left: 3vh;
      }
    }
    .title{
      font-size: 32px;
      font-weight: 400;
      color: #2B2F33;
      text-align: center;
      position: relative;
      z-index: 1;
      padding-top: 17vh;
    }
    .vides{
      position: relative;
      width: 78.7vh;
      max-width: 738px;
      margin: 0 auto 0;
      margin-top: 3vh;
      video{
        width: 100%;
        border-radius: 8px;
        outline: 0;
        box-shadow: 0px 20px 45px 0px rgba(0, 14, 36, 0.09);
        position: relative;
        z-index: 1;
      }
      img{
        position: absolute;
      }
      .bg_circle_small{
        width: 406/2px;
        left: -100px;
        top: -70px;
      }
      .bg_dot{
        width: 130/2px;
        left: -100px;
        top: 70px;
      }
      .cute2{
        width: 98/2px;
        right: -39px;
        top: 86px;
      }
      .cute1{
        width: 144/2px;
        right: -40px;
        top: 150px;
      }
      .bg_others{
        width: 224/2px;
        top: 450px;
        left: -130px;
      }
    }
    .footer1{
      position: relative;
      left: 50%;
      height: 27vh;
      top: 24px;
      padding: 0 40px;
      width: 100%;
      max-width: 824px;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
      .man{
        width: 238px;
        position: absolute;
        bottom: 20px;
        left: 170px;
      }
      div{
        position: absolute;
        left: 420px;
        bottom: 30px;
        .chare_erweima{
          width: 108px;
        }
        p{
          font-size: 14px;
          font-weight: 400;
          margin-top: 10px;
          color: #7F8792;
          text-align: center;
        }
      }
    }
  }
  .right{
    flex: 4 1;
    position: relative;
    .share_body_right{
      position: relative;
      z-index: 1;
      width: 100%;
      width: 600px;
      height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 21.3vh 10.2vw 0 2vw;
      .enterprise_input{
        width: 340px;
        margin: 0 auto;
        margin-top: 28px;
        .primary{
          button{
            width:100%;
            height:40px;
          }
        }
      }
      .enterprise_top{
        margin: 0 auto;
        width: 340px;
        position: relative;
        z-index: 1;
        img{
          width: 70px;
          height: 70px;
          border-radius: 50%;
          float: left;
          margin-right: 20px;
          border: 1px solid rgba(0, 0, 0, 0.12);
        }
        h1{
          font-size: 16px;
          color: #474F59;
          margin: 0;
          display: inline-block;
          margin-top: 6px;
          span{
            font-weight: bold;
            margin-right: 6px;
          }
        }
        div{
          font-size: 22px;
          font-weight: bold;
          color: #262626;
          span{
            width: 76px;
            height: 22px;
            background: #E0EDFF;
            border-radius: 3px;
            font-size: 12px;
            font-weight: 400;
            color: #176BE2;
            display: inline-block;
            line-height: 22px;
            text-align: center;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
.share_banner{
  position: absolute;
  right: 0;
  top: 0;
  .downClient{
    float: right;
    width: 88px;
    height: 30px;
    background: linear-gradient(270deg, #FF646C 0%, #F44E57 100%);
    border-radius: 20px;
    margin-top: 26px;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    text-align: center;
    line-height: 30px;
    position: absolute;
    z-index: 10;
    right: 16vh;
  }
  .bg_circle_big2{
    width: 926/2px;
  }
  .bg_circle_small{
    position: absolute;
    width: 140/2px;
    top: 130px;
    right: 240px;
  }
}
.share_body{
  width: 1280px;
  margin: 0 auto;
  margin-top: 90px;
  .share_body_right{
    float: right;
    margin-top: 40px;
    position: relative;
    z-index: 1;
    .enterprise_input{
      width: 340px;
      margin: 0 auto;
      margin-top: 28px;
      .primary{
        button{
          width:100%;
          height:40px;
        }
      }
    }
  }
}
@media screen and (max-width:640px) {
  .main{
    .bg_down{
      display: none;
    }
    .left{
      flex: 0;
      padding: 0;
      .left_blans{
        margin: 30px 0 0 0;
      }
      .title{
        display: none;
      }
      .vides{
        display: none;
      }
      .footer1{
        display: none;
      }
    }
    .right{
      .share_body_right{
        width: 90%;
        margin: 0 auto;
        margin-top: 108px;
        float: none;
        padding: 0;
        .enterprise_top{
          width: 100%;
        }
        .enterprise_input{
          width: 100%;
        }
      }
    }
    .share_banner{
      display: none;
    }
  }
}
</style>
