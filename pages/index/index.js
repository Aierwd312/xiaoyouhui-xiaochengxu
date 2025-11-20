import store from '@/store'
import { getToken } from '@/utils/auth'

export default {
	data() {
		return {
			userName: store.state.user.name || '未登录', // 用户名
			isVerified: true, // 是否已认证
			notificationText: '最新福利通知：校友专享优惠活动开启', // 通知文本
			navBackground: '#004299', // 导航栏背景色 - 默认为主题色
			navTitleColor: '#000000', // 导航栏标题颜色 - 默认为黑色
			backgroundConfig: {
				backgroundType: 'solid', // solid(纯色) | gradient(渐变) | image(图片)
				solidColor: '#004299',      // 纯色背景的颜色 - 默认为主题色
				gradientFrom: '#004299',
				gradientTo: '#79A6DC',
				gradientMiddle: '#2A6DCF',
				gradientAngle: 135,
				imageUrl: '',
				blurAmount: 0, // 无模糊
				overlayOpacity: 0, // 无遮罩
				// 导航栏相关配置
				navBarConfig: {
					backgroundColor: '#004299', // 导航栏背景颜色 - 默认为主题色
					titleColor: '#000000',         // 标题颜色 - 默认为黑色
					useGradient: false,            // 不使用渐变背景
					gradientFrom: '#004299',
					gradientTo: '#2A6DCF',
					backgroundOpacity: 1.0
				}
			},
			// Helper to generate page URLs
			getPageUrl: (pageName) => `/pages/${pageName}/${pageName}`,
			functionsPersonal: [
				{ id: 1, icon: 'bank-card-2-line', text: '校友卡', pageName: 'alumniCardPage', iconClass: 'blue-icon', hasNotification: false },
				{ id: 2, icon: 'user-search-line', text: '发现校友', pageName: 'discoverAlumniPage', iconClass: 'dark-blue-icon', hasNotification: false },
				{ id: 3, icon: 'user-heart-line', text: '我的好友', pageName: 'myFriendsPage', iconClass: 'red-icon', hasNotification: true },
				{ id: 4, icon: 'team-line', text: '我的组织', pageName: 'myOrganizationsPage', iconClass: 'green-icon', hasNotification: false },
				{ id: 5, icon: 'profile-line', text: '学籍信息', pageName: 'studentInfoPage', iconClass: 'blue-icon', hasNotification: false },
				{ id: 6, icon: 'archive-line', text: '档案查询', pageName: 'archiveQueryPage', iconClass: 'light-blue-icon', hasNotification: false }
			].map((item, index) => ({
				ID: item.id,
				CreatedAt: "2023-01-01T12:00:00+08:00",
				UpdatedAt: "2023-01-01T12:00:00+08:00",
				DeletedAt: null,
				type: "personal_function",
				name: item.text,
				icon: item.icon,
				url: `/pages/${item.pageName}/${item.pageName}`,
				parentId: 0,
				sort: index,
				status: 0,
				children: [],
				meta: {
					iconClass: item.iconClass,
					hasNotification: item.hasNotification,
					pageName: item.pageName
				}
			})),
			functionsSchool: [
				{ id: 7, icon: 'calendar-event-line', text: '母校活动', pageName: 'schoolActivitiesPage', iconClass: 'orange-icon', hasNotification: false },
				{ id: 8, icon: 'newspaper-line', text: '母校资讯', pageName: 'schoolNewsPage', iconClass: 'blue-icon', hasNotification: false },
				{ id: 9, icon: 'building-4-line', text: '进校预约', pageName: 'campusAccessApplicationPage', iconClass: 'dark-blue-icon', hasNotification: false },
				{ id: 10, icon: 'hand-heart-line', text: '回馈母校', pageName: 'giveBackToSchoolPage', iconClass: 'red-icon', hasNotification: false },
				{ id: 11, icon: 'briefcase-4-line', text: '校友服务', pageName: 'alumniServicesPage', iconClass: 'green-icon', hasNotification: false }
			].map((item, index) => ({
				ID: item.id,
				CreatedAt: "2023-01-01T12:00:00+08:00",
				UpdatedAt: "2023-01-01T12:00:00+08:00",
				DeletedAt: null,
				type: "school_function",
				name: item.text,
				icon: item.icon,
				url: `/pages/${item.pageName}/${item.pageName}`,
				parentId: 0,
				sort: index,
				status: 0,
				children: [],
				meta: {
					iconClass: item.iconClass,
					hasNotification: item.hasNotification,
					pageName: item.pageName
				}
			})),
			functionsAccount: [
				{ id: 12, icon: 'user-settings-line', text: '账号管理', pageName: 'mine', iconClass: 'dark-blue-icon', hasNotification: false },
				{ id: 13, icon: 'feedback-line', text: '问题反馈', pageName: 'feedbackPage', iconClass: 'orange-icon', hasNotification: false },
				{ id: 14, icon: 'question-line', text: '系统帮助', pageName: 'systemHelpPage', iconClass: 'blue-icon', hasNotification: false }
			].map((item, index) => ({
				ID: item.id,
				CreatedAt: "2023-01-01T12:00:00+08:00",
				UpdatedAt: "2023-01-01T12:00:00+08:00",
				DeletedAt: null,
				type: "account_function",
				name: item.text,
				icon: item.icon,
				url: item.pageName === 'mine' ? `/pages/mine/index` : `/pages/${item.pageName}/${item.pageName}`,
				parentId: 0,
				sort: index,
				status: 0,
				children: [],
				meta: {
					iconClass: item.iconClass,
					hasNotification: item.hasNotification,
					pageName: item.pageName
				}
			}))
		}
	},
	onLoad() {
		// 页面加载时执行的逻辑
		this.checkLoginAndRedirect();
		this.applyBackgroundStyles();
		this.updateUserInfo();
	},
	onShow() {
		// 页面显示时更新用户信息
		this.updateUserInfo();
	},
	mounted() {
		// 在页面初始化时应用背景样式
		this.applyBackgroundStyles();
		
		// 模拟从后端获取背景配置
		// 实际使用时可通过API请求获取
		setTimeout(() => {
			// 这里是示例数据，实际应用中应从服务器获取
			this.updateBackgroundConfig({
				backgroundType: 'solid',
				solidColor: '#004299', // 与导航栏和内容区域背景一致
				blurAmount: 0,
				overlayOpacity: 0,
				navBarConfig: {
					backgroundColor: '#004299',
					titleColor: '#FFFFFF', // 导航栏标题黑色
					useGradient: false,
					backgroundOpacity: 1.0
				}
			});
		}, 2000);
	},
	methods: {
		/**
		 * 检查登录状态并重定向
		 */
		checkLoginAndRedirect() {
			// 从utils/auth获取token
			const token = getToken();
			
			if (!token) {
				console.log('首页检测到未登录，跳转到登录页');
				uni.reLaunch({
					url: '/pages/login'
				});
				return false;
			}
			return true;
		},
		
		/**
		 * 更新用户信息
		 */
		updateUserInfo() {
			// 从store中获取最新的用户信息
			this.userName = store.state.user.name || '未登录';
			console.log('更新用户名:', this.userName);
		},
		
		/**
		 * 点击通知栏
		 */
		handleNotificationClick() {
			const url = this.getPageUrl('notificationsPage');
			uni.navigateTo({ url });
			console.log(`Navigating to: ${url}`);
		},
		
		/**
		 * 点击个人资料
		 */
		handleProfileClick() {
			// 跳转到若依自带的账户管理页面
			const url = '/pages/mine/index';
			uni.navigateTo({ url });
			console.log(`Navigating to: ${url}`);
		},
		
		/**
		 * 点击功能项
		 * @param {Number} id 功能项ID
		 * @param {String} name 功能项名称 (已改为使用ID查找URL)
		 */
		handleFunctionClick(id, name) {
			let itemUrl = '';
			// Find the item in all lists to get its URL
			const allFunctions = [...this.functionsPersonal, ...this.functionsSchool, ...this.functionsAccount];
			const clickedItem = allFunctions.find(item => item.ID === id);
			
			if (clickedItem && clickedItem.url) {
				itemUrl = clickedItem.url;
				uni.navigateTo({ url: itemUrl });
				console.log(`Navigating to function: ${name}, URL: ${itemUrl}`);
			} else {
				console.warn(`No URL found for function ID: ${id}, Name: ${name}`);
				uni.showToast({
					title: `功能"${name}"暂未开放`,
					icon: 'none'
				});
			}
		},
		
		/**
		 * 更新背景配置
		 * @param {Object} config 背景配置
		 */
		updateBackgroundConfig(config) {
			// 合并配置
			this.backgroundConfig = {
				...this.backgroundConfig,
				...config
			};
			
			// 应用配置到CSS变量
			this.applyBackgroundStyles();
		},
		
		/**
		 * 应用背景样式
		 */
		applyBackgroundStyles() {
			const cfg = this.backgroundConfig;
			let cssBackgroundImageValue = '';
			let cssBackgroundColorValue = '';
			
			if (cfg.backgroundType === 'gradient') {
				cssBackgroundImageValue = `linear-gradient(${cfg.gradientAngle}deg, ${cfg.gradientFrom} 0%, ${cfg.gradientMiddle} 50%, ${cfg.gradientTo} 100%)`;
			} else if (cfg.backgroundType === 'image' && cfg.imageUrl) {
				cssBackgroundImageValue = `url('${cfg.imageUrl}')`;
			} else if (cfg.backgroundType === 'solid'){
				cssBackgroundColorValue = cfg.solidColor;
			}
			
			// 应用导航栏样式
			this.applyNavBarStyles();
			
			// 使用uni-app的方式设置CSS变量
			const sysInfo = uni.getSystemInfoSync();
			
			try {
				// #ifdef H5
				document.documentElement.style.setProperty('--background-image', cssBackgroundImageValue);
				document.documentElement.style.setProperty('--background-color-solid', cssBackgroundColorValue);
				document.documentElement.style.setProperty('--blur-amount', `${cfg.blurAmount}px`);
				document.documentElement.style.setProperty('--overlay-opacity', String(cfg.overlayOpacity));
				// #endif
				
				// #ifdef MP-WEIXIN
				// 小程序中，如果需要动态修改页面背景色，可能需要操作页面page的style
				// 但通常建议通过wxml绑定动态class或style来实现
				// 此处仅为示例，具体实现需要看项目结构和需求
				const pages = getCurrentPages();
				if (pages.length) {
					const currentPage = pages[pages.length - 1];
					// 注意: vue3中this.$scope 指向当前组件实例, vue2中是 this
					// 直接修改页面style可能不是最佳实践
					// if (currentPage && currentPage.$vm && cssBackgroundColorValue) {
					// 	currentPage.$vm.$el.style.backgroundColor = cssBackgroundColorValue;
					// }
				}
				// #endif
			} catch (error) {
				console.error('设置背景样式失败:', error);
			}
		},
		
		/**
		 * 应用导航栏样式
		 */
		applyNavBarStyles() {
			const navCfg = this.backgroundConfig.navBarConfig;
			
			// 设置导航栏背景色
			if (navCfg.useGradient) {
				// 使用渐变背景
				this.navBackground = `linear-gradient(90deg, ${navCfg.gradientFrom}, ${navCfg.gradientTo})`;
			} else {
				// 使用纯色背景，带透明度
				if (navCfg.backgroundColor === 'transparent') {
					this.navBackground = 'transparent';
				} else {
					// 处理带透明度的颜色
					const colorWithOpacity = this.hexToRgba(navCfg.backgroundColor, navCfg.backgroundOpacity);
					this.navBackground = colorWithOpacity;
				}
			}
			
			// 设置标题颜色
			this.navTitleColor = navCfg.titleColor;
		},
		
		/**
		 * 将HEX颜色转换为带透明度的RGBA
		 * @param {String} hex 16进制颜色值
		 * @param {Number} opacity 透明度 0-1
		 * @returns {String} RGBA颜色值
		 */
		hexToRgba(hex, opacity) {
			// 移除#号
			hex = hex.replace('#', '');
			
			// 如果是3位颜色，转为6位
			if (hex.length === 3) {
				hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
			}
			
			// 转为RGB
			const r = parseInt(hex.substring(0, 2), 16);
			const g = parseInt(hex.substring(2, 4), 16);
			const b = parseInt(hex.substring(4, 6), 16);
			
			// 返回rgba格式
			return `rgba(${r}, ${g}, ${b}, ${opacity})`;
		},
	}
}
