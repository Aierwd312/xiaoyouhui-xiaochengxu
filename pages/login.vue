<template>
  <view class="login-container">
    <!-- Logo区域 -->
    <view class="logo-section">
      <view class="logo-content">
        <image src="/static/school-badge.svg" class="logo-image svg-icon svg-white"></image>
        <text class="app-title">重财校友会</text>
      </view>
    </view>
    
    <!-- 登录表单卡片 -->
    <view class="login-card">
      <view class="card-header">
        <text class="login-title">登录</text>
      </view>
      
      <view class="form-content">
        <view class="input-item">
          <view class="input-wrapper">
            <view class="iconfont icon-user input-icon"></view>
            <input v-model="loginForm.username" class="input-field" type="text" placeholder="请输入账号" maxlength="30" />
          </view>
        </view>
        
        <view class="input-item">
          <view class="input-wrapper">
            <view class="iconfont icon-password input-icon"></view>
            <input v-model="loginForm.password" type="password" class="input-field" placeholder="请输入密码" maxlength="20" />
          </view>
        </view>
        
        <view class="input-item captcha-item" v-if="captchaEnabled">
          <view class="input-wrapper">
            <view class="iconfont icon-code input-icon"></view>
            <input v-model="loginForm.code" type="number" class="input-field captcha-input" placeholder="请输入验证码" maxlength="4" />
            <view class="captcha-image-wrapper">
              <image :src="codeUrl" @click="getCode" class="captcha-image"></image>
            </view>
          </view>
        </view>
        
        <view class="login-btn-wrapper">
          <button @click="handleLogin" class="login-btn">登录</button>
        </view>
      </view>
    </view>

    <!-- 协议区域 -->
    <view class="agreement-section">
      <text class="agreement-text">登录即代表同意</text>
      <text @click="handleUserAgrement" class="agreement-link">《用户协议》</text>
      <text @click="handlePrivacy" class="agreement-link">《隐私协议》</text>
    </view>
  </view>
</template>

<script setup>
	import { getCodeImg } from '@/api/login'
	import { ref } from "vue";
	import user from '@/store/modules/user'
	import config from '@/config.js'
	import store from '@/store'
	const codeUrl=ref("");
	const captchaEnabled=ref(true);
	const globalConfig=ref(config);
	const loginForm=ref({
	        username: "",
	        password: "",
	        code: "",
	        uuid: ''
	      });
	// 隐私协议
	function handlePrivacy() {
	  let site = globalConfig.value.appInfo.agreements[0];
	  uni.navigateTo({
	  	url: `/pages/common/webview/index?title=${site.title}&url=${site.url}`
	  });
	};
	// 用户协议
	function handleUserAgrement() {
	  let site = globalConfig.value.appInfo.agreements[1]
	  uni.navigateTo({
	  	url: `/pages/common/webview/index?title=${site.title}&url=${site.url}`
	  });
	};
		  
	// 获取图形验证码
	function getCode() {
	  getCodeImg().then(res => {
	    captchaEnabled.value = res.captchaEnabled === undefined ? true : res.captchaEnabled
	    if (captchaEnabled.value) {
	      codeUrl.value = 'data:image/gif;base64,' + res.img
	      loginForm.value.uuid = res.uuid
	    }
	  })
	};
	
	async function handleLogin() {
		  if (loginForm.value.username === "") {
			  uni.showToast({
			    title: '请输入您的账号',
			    mask: false,
			    duration: 1000
			  });
		      //this.$modal.msgError("请输入您的账号")
		    } else if (loginForm.value.password === "") {
				uni.showToast({
				  title: '请输入您的密码',
				  mask: false,
				  duration: 1000
				});
		      //this.$modal.msgError("请输入您的密码")
		    } else if (loginForm.value.code === "" && captchaEnabled.value) {
				uni.showToast({
				  title: '请输入验证码',
				  mask: false,
				  duration: 1000
				});
		      //this.$modal.msgError("请输入验证码")
		    } else {
				uni.showToast({
				  title: '登录中，请耐心等待...',
				  mask: false,
				  duration: 1000
				});
		      //this.$modal.loading("登录中，请耐心等待...")
		      pwdLogin()
		    }
		};
	// 密码登录
	async function pwdLogin() {
		   /* this.$modal.closeLoading() */
		store.dispatch('Login', loginForm.value).then(() => {
			loginSuccess()
			}).catch(() => {
			  if (captchaEnabled.value) {
			    getCode()
			  }
			})
	};
	
	function loginSuccess(result) {
	  // 设置用户信息
	  store.dispatch('GetInfo').then(res => {

			  uni.navigateTo({
		  	url: '/pages/index/index'
		  });
	  })
	}
	
	getCode();
</script>

<style lang="scss">
/* 全局样式 */
page {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, sans-serif;
  background-color: #004299;
}

/* 登录容器 - 匹配index页面背景 */
.login-container {
  min-height: 100vh;
  background-color: #004299;
  background-image: linear-gradient(135deg, #004299 0%, #2A6DCF 100%);
  padding: 0 32rpx;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Logo区域 */
.logo-section {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 60rpx;
  padding-bottom: 80rpx;
}

.logo-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.logo-image {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 32rpx;
}

.app-title {
  font-size: 48rpx;
  font-weight: 600;
  color: white;
  margin-bottom: 16rpx;
}

/* 登录卡片 - 匹配index页面卡片样式 */
.login-card {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 24rpx;
  box-shadow: 0 8px 40rpx rgba(0, 0, 0, 0.15);
  overflow: hidden;
  margin-bottom: 60rpx;
  backdrop-filter: blur(10rpx);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-header {
  padding: 48rpx 48rpx 24rpx 48rpx;
  text-align: center;
}

.login-title {
  font-size: 48rpx;
  font-weight: 600;
  color: #333333;
}

/* 表单内容 */
.form-content {
  padding: 0 48rpx 48rpx 48rpx;
}

.input-item {
  margin-bottom: 32rpx;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 24rpx;
  padding: 24rpx 32rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
}

.input-wrapper:focus-within {
  border-color: #004299;
  background-color: #ffffff;
  box-shadow: 0 0 0 6rpx rgba(0, 66, 153, 0.1);
}

.input-icon {
  font-size: 40rpx;
  color: #666666;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.input-field {
  flex: 1;
  font-size: 32rpx;
  color: #333333;
  background: transparent;
  border: none;
  outline: none;
}

.input-field::placeholder {
  color: #999999;
}

/* 验证码特殊样式 - 修复对齐问题 */
.captcha-item .input-wrapper {
  position: relative;
}

.captcha-input {
  flex: 1;
  margin-right: 24rpx;
}

.captcha-image-wrapper {
  flex-shrink: 0;
  width: 200rpx;
  height: 80rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.captcha-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 登录按钮 */
.login-btn-wrapper {
  margin-top: 48rpx;
}

.login-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #004299 0%, #2A6DCF 100%);
  border: none;
  border-radius: 48rpx;
  font-size: 36rpx;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(0, 66, 153, 0.3);
  transition: all 0.3s ease;
}

.login-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 4rpx 12rpx rgba(0, 66, 153, 0.3);
}

/* 协议区域 */
.agreement-section {
  text-align: center;
  padding-bottom: 60rpx;
  margin-top: auto;
}

.agreement-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
}

.agreement-link {
  font-size: 28rpx;
  color: white;
  text-decoration: underline;
  margin: 0 8rpx;
}

/* SVG 图标样式 - 复用index页面的SVG样式 */
.svg-icon {
  display: block;
}

.svg-icon {
  filter: brightness(0) saturate(100%);
}

.svg-white {
  filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(207deg) brightness(105%) contrast(101%);
}

/* 响应式调整 */
@media (max-height: 667px) {
  .logo-section {
    padding-top: 40rpx;
    padding-bottom: 60rpx;
  }
  
  .logo-image {
    width: 120rpx;
    height: 120rpx;
  }
  
  .app-title {
    font-size: 40rpx;
  }
}
</style>
