<template>
  <view class="mine-container">
    <!-- 顶部背景区域 -->
    <view class="header-bg">
      <view class="header-content">
        <!-- 用户头像和信息 -->
        <view class="user-card">
          <view class="avatar-wrapper" @click="avatar ? handleToAvatar() : handleToLogin()">
            <image v-if="avatar" :src="avatar" class="user-avatar" mode="aspectFill"></image>
            <view v-else class="avatar-placeholder">
              <view class="iconfont icon-people"></view>
            </view>
          </view>
          <view class="user-info-wrapper">
            <view v-if="!name" @click="handleToLogin" class="login-prompt">
              <text class="login-text">点击登录</text>
            </view>
            <view v-else class="user-details">
              <text class="user-name">{{ name }}</text>
              <view class="info-btn" @click="handleToInfo">
                <text class="info-text">个人信息</text>
                <view class="iconfont icon-right"></view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content-wrapper">
      <!-- 快捷操作卡片 -->
      <view class="action-card">
        <view class="action-grid">
          <view class="action-item" @click="handleJiaoLiuQun">
            <view class="action-icon-wrapper bg-gradient-pink">
              <view class="iconfont icon-friendfill"></view>
            </view>
            <text class="action-text">交流群</text>
          </view>
          <view class="action-item" @click="handleBuilding">
            <view class="action-icon-wrapper bg-gradient-blue">
              <view class="iconfont icon-service"></view>
            </view>
            <text class="action-text">在线客服</text>
          </view>
          <view class="action-item" @click="handleBuilding">
            <view class="action-icon-wrapper bg-gradient-purple">
              <view class="iconfont icon-community"></view>
            </view>
            <text class="action-text">反馈社区</text>
          </view>
          <view class="action-item" @click="handleBuilding">
            <view class="action-icon-wrapper bg-gradient-green">
              <view class="iconfont icon-dianzan"></view>
            </view>
            <text class="action-text">点赞我们</text>
          </view>
        </view>
      </view>

      <!-- 功能菜单卡片 -->
      <view class="menu-card">
        <view class="menu-item" @click="handleToEditInfo">
          <view class="menu-left">
            <view class="menu-icon-wrapper bg-gradient-blue">
              <view class="iconfont icon-user"></view>
            </view>
            <text class="menu-title">编辑资料</text>
          </view>
          <view class="iconfont icon-right menu-arrow"></view>
        </view>
        <view class="menu-item" @click="handleHelp">
          <view class="menu-left">
            <view class="menu-icon-wrapper bg-gradient-orange">
              <view class="iconfont icon-help"></view>
            </view>
            <text class="menu-title">常见问题</text>
          </view>
          <view class="iconfont icon-right menu-arrow"></view>
        </view>
        <view class="menu-item" @click="handleAbout">
          <view class="menu-left">
            <view class="menu-icon-wrapper bg-gradient-red">
              <view class="iconfont icon-aixin"></view>
            </view>
            <text class="menu-title">关于我们</text>
          </view>
          <view class="iconfont icon-right menu-arrow"></view>
        </view>
        <view class="menu-item menu-item-last" @click="handleToSetting">
          <view class="menu-left">
            <view class="menu-icon-wrapper bg-gradient-gray">
              <view class="iconfont icon-setting"></view>
            </view>
            <text class="menu-title">应用设置</text>
          </view>
          <view class="iconfont icon-right menu-arrow"></view>
        </view>
      </view>

      <!-- 退出登录按钮 -->
      <view class="logout-card" @click="handleLogout">
        <text class="logout-text">退出登录</text>
      </view>
    </view>
  </view>
  
  <!-- 退出确认弹窗 -->
  <view>
    <uni-popup ref="popup" type="dialog">
      <uni-popup-dialog 
        type="info" 
        cancelText="关闭" 
        confirmText="退出"
        title="通知" 
        content="确定注销并退出系统吗" 
        @confirm="dialogConfirm"
        @close="dialogClose">
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script setup>
  import storage from '@/utils/storage'
  import store from '@/store'
  import { ref } from "vue";
  import config from '@/config.js'
  const name=store.state.user.nickName;
  const version= config.appInfo.version;
  const avatar=ref(store.state.user.avatar);
  const windowHeight=ref(uni.getSystemInfoSync().windowHeight - 50);
  const popup = ref(null);
  
  uni.$on('refresh', () => {
      avatar.value=store.state.user.avatar;
  }) 
  
  console.log(avatar.value)
  
  function handleToInfo() {
	  uni.navigateTo({
	  	url: '/pages/mine/info/index'
	  });
  };
  function handleToEditInfo() {
	  uni.navigateTo({
	  	url: '/pages/mine/info/edit'
	  });
  };
  function handleToSetting() {
	  uni.navigateTo({
	  	url: '/pages/mine/setting/index'
	  });
  };
  function handleToLogin() {
	  uni.reLaunch({
	  	url: '/pages/login'
	  });
  };
  function handleToAvatar() {
	  uni.navigateTo({
	  	url: '/pages/mine/avatar/index'
	  });
  };
  function handleLogout() {
	  popup.value.open();
  };
  function dialogConfirm() {
  	//console.log('----------------点击确认------------')
	store.dispatch('LogOut').then(() => {
			uni.reLaunch({
				url: '/pages/login'
			});
	})
  };
  function dialogClose() {
  	//console.log('点击关闭')
  };
  function handleHelp() {
	  uni.navigateTo({
	  	url: '/pages/mine/help/index'
	  });
  };
  function handleAbout() {
	  uni.navigateTo({
	  	url: '/pages/mine/about/index'
	  });
  };
  function handleJiaoLiuQun() {
	  uni.showToast({
	    title: 'QQ群：133713780',
	    mask: false,
		icon:"none",
	    duration: 1000
	  });
  };
  function handleBuilding() {
	  uni.showToast({
	    title: '模块建设中~',
	    mask: false,
		icon:"none",
	    duration: 1000
	  });
  }
  
</script>

<style lang="scss">
page {
  background-color: #f5f7fa;
}

.mine-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 顶部背景渐变区域 */
.header-bg {
  background: linear-gradient(135deg, #004299 0%, #2A6DCF 100%);
  padding: 40rpx 32rpx 120rpx 32rpx;
  position: relative;
}

.header-content {
  position: relative;
  z-index: 2;
}

/* 用户信息卡片 */
.user-card {
  display: flex;
  align-items: center;
  padding: 40rpx 32rpx;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20rpx);
  border-radius: 24rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
}

.avatar-wrapper {
  flex-shrink: 0;
  margin-right: 32rpx;
}

.user-avatar {
  width: 140rpx;
  height: 140rpx;
  border-radius: 70rpx;
  border: 6rpx solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
}

.avatar-placeholder {
  width: 140rpx;
  height: 140rpx;
  border-radius: 70rpx;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 6rpx solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
  
  .iconfont {
    font-size: 70rpx;
    color: #999999;
  }
}

.user-info-wrapper {
  flex: 1;
  min-width: 0;
}

.login-prompt {
  .login-text {
    font-size: 36rpx;
    font-weight: 500;
    color: white;
  }
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.user-name {
  font-size: 40rpx;
  font-weight: 600;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 24rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 30rpx;
  align-self: flex-start;
  
  .info-text {
    font-size: 28rpx;
    color: white;
  }
  
  .iconfont {
    font-size: 24rpx;
    color: white;
  }
}

/* 内容区域 */
.content-wrapper {
  margin-top: -80rpx;
  padding: 0 32rpx 32rpx 32rpx;
  position: relative;
  z-index: 3;
}

/* 快捷操作卡片 */
.action-card {
  background: white;
  border-radius: 24rpx;
  padding: 48rpx 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32rpx;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.action-icon-wrapper {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  .iconfont {
    font-size: 48rpx;
    color: white;
  }
}

.action-item:active .action-icon-wrapper {
  transform: scale(0.95);
}

.action-text {
  font-size: 26rpx;
  color: #666666;
  text-align: center;
}

/* 渐变背景色 */
.bg-gradient-pink {
  background: linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%);
}

.bg-gradient-blue {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.bg-gradient-purple {
  background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
}

.bg-gradient-green {
  background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
}

.bg-gradient-orange {
  background: linear-gradient(135deg, #ff8008 0%, #ffc837 100%);
}

.bg-gradient-red {
  background: linear-gradient(135deg, #ff6a88 0%, #ff99ac 100%);
}

.bg-gradient-gray {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 功能菜单卡片 */
.menu-card {
  background: white;
  border-radius: 24rpx;
  padding: 0;
  margin-bottom: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 2rpx solid #f5f5f5;
  transition: background-color 0.3s ease;
}

.menu-item:active {
  background-color: #f8f9fa;
}

.menu-item-last {
  border-bottom: none;
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.menu-icon-wrapper {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .iconfont {
    font-size: 40rpx;
    color: white;
  }
}

.menu-title {
  font-size: 32rpx;
  color: #333333;
  font-weight: 500;
}

.menu-arrow {
  font-size: 28rpx;
  color: #cccccc;
}

/* 退出登录按钮 */
.logout-card {
  background: white;
  border-radius: 24rpx;
  padding: 32rpx;
  text-align: center;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.logout-card:active {
  transform: scale(0.98);
  background-color: #f8f9fa;
}

.logout-text {
  font-size: 32rpx;
  color: #e74c3c;
  font-weight: 600;
}
</style>
