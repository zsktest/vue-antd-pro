<template>
  <div id="userLayout" :class="['user-layout-wrapper', isMobile && 'mobile']">
    <div class="container">
      <div class="top">
        <!-- <div class="header">
          <a href="/">
            <img src="~@/assets/logo.svg" class="logo" alt="logo">
            <span class="title">Ant Design</span>
          </a>
        </div> -->
        <img src="../assets/logo1.png" alt="">
      </div>
      <div class="layoust">
        <router-view />
      </div>
      <div class="footer">
        <div class="copyright">
          @版权所有 杭州分叉智能科技有限公司 浙ICP备：1947732
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { deviceMixin } from '@/store/device-mixin'

export default {
  name: 'UserLayout',
  mixins: [deviceMixin],
  mounted () {
    document.body.classList.add('userLayout')
  },
  beforeDestroy () {
    document.body.classList.remove('userLayout')
  }
}
</script>

<style lang="less" scoped>
.layoust{
  // max-width: 1200px;
  margin: 0 auto;
}
#userLayout.user-layout-wrapper {
    height: 100%;

    &.mobile {
      .container {
        .main {
          max-width: 368px;
          width: 98%;
        }
      }
    }

    .container {
      width: 100%;
      min-height: 100%;
      // background: #f0f2f5 url(~@/assets/console_banner.jpg) no-repeat center center/cover;
      background:url(../assets/pic.png) no-repeat 20% 55%, linear-gradient(180deg,#202030,#464658) ;
      // background:url(~@/assets/pic.png) no-repeat 20% 50%, linear-gradient(180deg,#202030,#464658) ;
      background-size: 50%;
      position: relative;
      a {
        text-decoration: none;
      }

      .top {
        img{
          width: 154.5px;
          margin:25px 0 0 43px
        }

        .header {
          height: 44px;
          line-height: 44px;

          .badge {
            position: absolute;
            display: inline-block;
            line-height: 1;
            vertical-align: middle;
            margin-left: -12px;
            margin-top: -10px;
            opacity: 0.8;
          }

          .logo {
            height: 44px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }

          .title {
            font-size: 33px;
            color: rgba(0, 0, 0, .85);
            font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }
        .desc {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }

      .main {
        min-width: 260px;
        width: 370px;
        background: #fff;
        height: 450px;
        padding: 0 32px;
        padding-top: 60px;
        border-radius: 4px;
        position: absolute;
        right: 17%;
        top: 20%;
      }

      .footer {
        position: absolute;
        width: 100%;
        bottom: 0;
        height: 50px;
        line-height: 50px;
        text-align: center;
        background: rgba(255, 255, 255, 0.1);
        .links {
          margin-bottom: 8px;
          font-size: 14px;
          a {
            color: rgba(0, 0, 0, 0.45);
            transition: all 0.3s;
            &:not(:last-child) {
              margin-right: 40px;
            }
          }
        }
        .copyright {
          color: #A8ABB3;
          font-size: 14px;
        }
      }
    }
  }
</style>
