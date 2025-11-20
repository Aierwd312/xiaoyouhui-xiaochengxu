<template>
	<view class="content-area">
		<!-- 使用FirstUI导航栏组件 -->
		<fui-nav-bar
			:statusBar="true"
			title="校友卡"
			:background="navBackground"
			:color="navTitleColor"
			:size="18"
			:isFixed="true"
			:fontWeight="500"
			@init="navbarInit"
			@leftClick="goBack"
			@longpress="toggleTestMode">
			<!-- 根据文档，左侧内容通过默认插槽实现 -->
			<fui-icon name="arrowleft" :size="48" :color="navTitleColor"></fui-icon>
		</fui-nav-bar>
		
		<!-- 卡片主体内容 -->
		<view class="card-container" :style="{ marginTop: navHeight + 'px' }">
			<!-- 校友卡信息卡片 -->
			<view class="alumni-card">
				<!-- 卡片顶部校徽和校名 -->
				<view class="card-header">
					<view class="school-title-image">
						<image src="/static/school-badge- belt.png" class="title-full-image"></image>
						<!-- <text class="school-alumni-text">校友卡</text> -->
					</view>
				</view>
				
				<!-- 卡片内容区域 -->
				<view class="card-content">
					<!-- 左侧信息区 -->
					<view class="user-info">
						<fui-row margin-bottom="16rpx">
							<fui-col :span="8">
								<view class="label-container">
									<text class="info-label">姓名</text>
								</view>
							</fui-col>
							<fui-col :span="16">
								<text class="info-value">{{ userInfo.name }}</text>
							</fui-col>
						</fui-row>
						<fui-row margin-bottom="16rpx">
							<fui-col :span="8">
								<view class="label-container">
									<text class="info-label">入校年份</text>
								</view>
							</fui-col>
							<fui-col :span="16">
								<text class="info-value">{{ userInfo.enrollmentYear }}</text>
							</fui-col>
						</fui-row>
						<fui-row margin-bottom="16rpx">
							<fui-col :span="8">
								<view class="label-container">
									<text class="info-label">入校类型</text>
								</view>
							</fui-col>
							<fui-col :span="16">
								<text class="info-value">{{ userInfo.educationType }}</text>
							</fui-col>
						</fui-row>
						<fui-row>
							<fui-col :span="8">
								<view class="label-container">
									<text class="info-label">院系</text>
								</view>
							</fui-col>
							<fui-col :span="16">
								<text class="info-value">{{ userInfo.faculty }}</text>
							</fui-col>
						</fui-row>
					</view>
					
					<!-- 右侧照片区 -->
					<view class="user-photo">
						<image :src="userInfo.avatar || '/static/user-fill.svg'" class="photo-image"></image>
					</view>
				</view>
			</view>
			
			<!-- 内嵌二维码区域 -->
			<view class="qrcode-area" v-if="showQRCode">
				<view class="inline-qrcode-container">
					<view class="qrcode-title-area">
						<text class="qrcode-title">校友身份二维码</text>
					</view>
					<view class="qrcode-content">
						<view v-if="loading" class="qrcode-loading">
							<uni-load-more status="loading" :content-text="{contentdown: '生成中...', contentrefresh: '生成中...', contentnomore: '生成中...'}"></uni-load-more>
						</view>
						<fui-qrcode 
							v-else-if="qrcodeValue"
							:value="qrcodeValue" 
							:width="240" 
							:height="240"
							foreground="#004299"
							background="#ffffff"
							@ready="onQRCodeReady">
						</fui-qrcode>
						<view v-else class="qrcode-error">
							<text class="error-text">二维码生成失败</text>
							<view class="refresh-btn" @tap="generateQRCode">
								<text class="refresh-text">重新生成</text>
							</view>
						</view>
					</view>
					<view class="qrcode-footer">
						<text class="qrcode-desc">扫码验证校友身份</text>
						<text class="qrcode-tip">二维码有效期30分钟，请勿外传</text>
						<view class="qrcode-actions">
							<view class="refresh-qrcode-btn" @tap="generateQRCode" :class="{disabled: loading}">
								<image src="/static/refresh-line.svg" class="refresh-icon"></image>
								<text class="refresh-btn-text">{{ loading ? '生成中...' : '刷新' }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 调试按钮区域 -->
		<view class="debug-buttons" v-if="testMode">
			<view class="debug-btn" @tap="testAPIConnection">
				<text class="debug-btn-text">测试API</text>
			</view>
			<view class="debug-btn" @tap="toggleTestMode">
				<text class="debug-btn-text">关闭测试</text>
			</view>
		</view>
		
		<!-- 底部固定按钮 -->
		<view class="bottom-button" @tap="toggleQRCode">
			<view class="button-content">
				<image src="/static/qr-code-line.svg" class="qrcode-icon"></image>
				<text class="button-text">二维码</text>
			</view>
		</view>
		
		<!-- 测试模式开关（长按导航栏标题激活） -->
		<view class="test-mode-indicator" v-if="testMode">
			<text class="test-mode-text">测试模式</text>
		</view>
	</view>
</template>

<script>
	import alumniCardPageJs from './alumniCardPage.js'
	import { ref, computed, onMounted } from 'vue';
	// import fuiQrcode from '@/components/firstui/fui-qrcode/fui-qrcode.vue'; // 使用easycom后，不再需要手动引入
	
	export default {
		components: {
			// fuiQrcode // 使用easycom后，不再需要手动注册
		},
		...alumniCardPageJs,
		setup() {
			// 导航栏高度
			const navHeight = ref(44);
			const statusBarHeight = ref(0);
			
			// 初始化导航栏
			const navbarInit = (e) => {
				statusBarHeight.value = e.statusBarHeight;
				navHeight.value = e.height + e.statusBarHeight;
			}
			
			return {
				navHeight,
				statusBarHeight,
				navbarInit
			};
		},
		methods: {
			...alumniCardPageJs.methods,
			onQRCodeReady(e) {
				console.log('QR Code ready:', e);
			}
		}
	}
</script>

<style>
	@import './alumniCardPage.css';
</style>
