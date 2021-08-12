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
          <a-result status="success" :title="inviteLinklist" :sub-title="sub"></a-result>
          <div class="enterprise_process">
            <h1>使用提示:</h1>
            <ul>
              <li>
                <div class="enterprise_process1"><span>1</span></div>
                <div class="enterprise_process2"></div>
                <div class="enterprise_process3">下载并安装<a @click="Console_share">影刀客户端</a></div>
                <div class="enterprise_process4">安装影刀PC客户端<br />下载地址<a>www.winrobot360.com</a></div>
              </li>
              <li>
                <div class="enterprise_process1"><span>2</span></div>
                <div class="enterprise_process5">使用账号<span>【{{ user }}】</span>登录影刀企业版</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { queryApplyEnterpriseInfo, recordLog } from '@/api/user'
export default {
  data () {
    return {
      inviteLinkCode: this.$route.query.inviteKey,
      user: this.$route.query.user,
      registerStatus: this.$route.query.registerStatus,
      inviteLinklist: '',
      name: '',
      sub: ''
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
        inviteLinkCode: this.inviteLinkCode
      }
      queryApplyEnterpriseInfo(data).then(res => {
        if (res.code === 200) {
          if (this.registerStatus === 'r') {
            this.inviteLinklist = '注册成功'
            this.sub = '快去下载客户端，体验影刀自动化办公吧！'
          } else {
            this.inviteLinklist = '申请成功'
            this.sub = '待管理员审批通过'
          }
          this.name = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
::selection{
  background: #389eff;
}
input{
  height: 40px;
}
.enterprise{
  height: 100%;
  background: #fff;
  overflow: hidden;
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
  .enterprise_com{
    max-width: 1200px;
    background: url("../../../assets/img/blue_bg.png") no-repeat #FFFFFF;
    box-shadow: 0px 10px 28px 0px rgba(13, 14, 40, 0.06);
    border-radius: 4px;
    margin: 0 auto;
    margin-top: 24px;
    background-size: 100% 265px;
    padding-top: 75px;
    .enterprise_footer{
      margin-top: 160px;
      line-height: 80px;
      text-align: center;
      border-top: 1px solid #F0F0F0;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #A9B1BB;
      a{
        color: #409EFF;
      }
    }
  }
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
      .enterprise_process{
        width: 340px;
        margin: 0 auto;
        h1{
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 800;
          color: #262626;
        }
        ul{
          list-style-type:none;
          padding: 0;
          margin-top: 36px;
          li{
            position: relative;
            margin: 0;
            padding: 0 0 20px;
            font-size: 14px;
            list-style: none;
            .enterprise_process1{
              display: inline-block;
              width: 26px;
              height: 26px;
              background: rgba(255, 82, 91, 0.15);
              border-radius: 50%;
              position: absolute;
              z-index: 1;
              top: 0;
              span{
                width: 20px;
                height: 20px;
                background: #FF525B;
                border-radius: 50%;
                font-size: 13px;
                font-family: PingFang SC;
                font-weight: 800;
                color: #FFFFFF;
                line-height: 20px;
                text-align: center;
                display: block;
                margin: 0 auto;
                margin-top: 3px;
              }
            }
            .enterprise_process2{
              position: absolute;
              top: 10px;
              left: 12px;
              height: calc(100% - 10px);
              border-left: 1px solid #FF525B;
            }
            .enterprise_process3{
              display: inline-block;
              margin-left: 36px;
              a{
                color: #409EFF;
                margin-left: 6px;
              }
            }
            .enterprise_process5{
              display: inline-block;
              margin-left: 36px;
              a{
                color: #409EFF;
                margin-left: 6px;
              }
            }
            .enterprise_process4{
              display: none;
            }
          }
        }
      }
    }
  }
}
/deep/.ant-result-icon > .anticon{
  font-size: 35px;
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
        .enterprise_process ul li div.enterprise_process3{
          display: none;
        }
        .enterprise_process ul li div.enterprise_process4{
          display: inline-block;
          margin-left: 36px;
          a{
            color: #409EFF;
            margin-left: 6px;
          }
        }
      }
    }
    .share_banner{
      display: none;
    }
  }
  .enterprise{
    .share_nav{
      img{
        margin-left: 24px;
      }
      .Console_share{
        display: none;
      }
    }
    .share_banner{
      display: none;
    }
    .share_body{
      width: auto;
      margin-top: 0;
      .share_body_left{
        display: none;
      }
      .share_body_right{
        width: 90%;
        margin: 0 auto;
        margin-top: 48px;
        float: none;
        .enterprise_input{
          width: 100%;
        }
        .enterprise_process ul li div.enterprise_process3{
          display: none;
        }
        .enterprise_process ul li div.enterprise_process4{
          display: inline-block;
          margin-left: 36px;
          a{
            color: #409EFF;
            margin-left: 6px;
          }
        }
      }
    }
    .footer{
      display: none;
    }
  }
}
</style>
