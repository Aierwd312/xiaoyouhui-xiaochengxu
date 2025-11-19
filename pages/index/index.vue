<template>
	<view class="content-area">
		<!-- 使用FirstUI导航栏组件 -->
		<fui-nav-bar
			:statusBar="true"
			title="重财校友会"
			:background="navBackground"
			:color="navTitleColor"
			:size="18"
			:isFixed="true"
			:fontWeight="500"
			@init="navbarInit">
		</fui-nav-bar>
		
		<!-- 通知栏卡片 -->
		<view class="card notification-card" @tap="handleNotificationClick" :style="{ marginTop: navHeight + 'px' }">
			<view class="notification-icon">
				<!-- <fui-icon name="notification-3-line" class="notification-icon-inner"></fui-icon> -->
				<image src="/static/notification-3-line.svg" class="notification-icon-inner svg-icon svg-orange"></image>
			</view>
			<view class="notification-text">{{ notificationText }}</view>
			<view class="notification-action">
				<!-- <fui-icon name="arrow-right-s-line" class="notification-action-icon"></fui-icon> -->
				<image src="/static/arrow-right-s-line.svg" class="notification-action-icon svg-icon svg-hint"></image>
			</view>
		</view>
		
		<!-- 个人信息总览卡片 -->
		<view class="card profile-card" @tap="handleProfileClick">
			<view class="profile-avatar">
				<image src="/static/school-badge.svg" class="avatar-image svg-icon svg-darkblue"></image>
			</view>
			<view class="profile-info">
				<view class="profile-name">{{ userName }}</view>
				<view class="profile-verified" v-if="isVerified">
					<!-- <fui-icon name="shield-check-fill" class="verified-icon"></fui-icon> -->
					<!-- <image src="/static/shield-check-fill.svg" class="verified-icon svg-icon svg-white"></image> -->
					<text class="verified-text">已认证</text>
				</view>
			</view>
			<view class="profile-action">
				<!-- <fui-icon name="arrow-right-s-line" class="profile-action-icon"></fui-icon> -->
				<image src="/static/arrow-right-s-line.svg" class="profile-action-icon svg-icon svg-hint"></image>
			</view>
		</view>
		
		<!-- 功能列表区块（个人区块） -->
		<view class="card function-card">
			<block v-for="(item, index) in functionsPersonal" :key="item.ID">
				<view class="function-item" @tap="handleFunctionClick(item.ID, item.name)">
					<view class="function-icon" :class="item.meta.iconClass">
						<!-- <fui-icon :name="item.icon" :class="item.iconClass + '-inner'" class="icon"></fui-icon> -->
						<image :src="'/static/' + item.icon + '.svg'" class="icon svg-icon" :class="getIconColorClass(item.meta.iconClass)"></image>
					</view>
					<view class="function-text">{{ item.name }}</view>
					<view class="function-action" :class="{'notification-dot': item.meta.hasNotification}">
						<!-- <fui-icon name="arrow-right-s-line" class="function-action-icon"></fui-icon> -->
						<image src="/static/arrow-right-s-line.svg" class="function-action-icon svg-icon svg-hint"></image>
					</view>
				</view>
				<view class="divider" v-if="index !== functionsPersonal.length - 1"></view>
			</block>
		</view>
		
		<!-- 功能列表区块（母校相关） -->
		<view class="card function-card">
			<block v-for="(item, index) in functionsSchool" :key="item.ID">
				<view class="function-item" @tap="handleFunctionClick(item.ID, item.name)">
					<view class="function-icon" :class="item.meta.iconClass">
						<!-- <fui-icon :name="item.icon" :class="item.iconClass + '-inner'" class="icon"></fui-icon> -->
						<image :src="'/static/' + item.icon + '.svg'" class="icon svg-icon" :class="getIconColorClass(item.meta.iconClass)"></image>
					</view>
					<view class="function-text">{{ item.name }}</view>
					<view class="function-action" :class="{'notification-dot': item.meta.hasNotification}">
						<!-- <fui-icon name="arrow-right-s-line" class="function-action-icon"></fui-icon> -->
						<image src="/static/arrow-right-s-line.svg" class="function-action-icon svg-icon svg-hint"></image>
					</view>
				</view>
				<view class="divider" v-if="index !== functionsSchool.length - 1"></view>
			</block>
		</view>
		
		<!-- 功能列表区块（账号与帮助） -->
		<view class="card function-card">
			<block v-for="(item, index) in functionsAccount" :key="item.ID">
				<view class="function-item" @tap="handleFunctionClick(item.ID, item.name)">
					<view class="function-icon" :class="item.meta.iconClass">
						<!-- <fui-icon :name="item.icon" :class="item.iconClass + '-inner'" class="icon"></fui-icon> -->
						<image :src="'/static/' + item.icon + '.svg'" class="icon svg-icon" :class="getIconColorClass(item.meta.iconClass)"></image>
					</view>
					<view class="function-text">{{ item.name }}</view>
					<view class="function-action" :class="{'notification-dot': item.meta.hasNotification}">
						<!-- <fui-icon name="arrow-right-s-line" class="function-action-icon"></fui-icon> -->
						<image src="/static/arrow-right-s-line.svg" class="function-action-icon svg-icon svg-hint"></image>
					</view>
				</view>
				<view class="divider" v-if="index !== functionsAccount.length - 1"></view>
			</block>
		</view>
	</view>
</template>

<script>
	import indexJs from './index.js'
	import { ref, computed, onMounted } from 'vue';
	// import fuiNavBar from '@/compoents/firstui/fui-nav-bar/fui-nav-bar.vue'; // 使用easycom后，不再需要手动引入
	
	export default {
		components: {
			// fuiNavBar // 使用easycom后，不再需要手动注册
		},
		...indexJs,
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
			...indexJs.methods,
			getIconColorClass(iconClassFromMeta) {
				// 将图标类名转换为对应的颜色类名
				const colorMap = {
					'blue-icon': 'svg-blue',
					'dark-blue-icon': 'svg-darkblue',
					'red-icon': 'svg-red',
					'green-icon': 'svg-green',
					'gray-icon': 'svg-gray',
					'light-blue-icon': 'svg-lightblue',
					'orange-icon': 'svg-orange'
				};
				
				return colorMap[iconClassFromMeta] || 'svg-darkblue'; // 确保有默认值
			}
		}
	}
</script>

<style>
	@import './index.css';
</style>
