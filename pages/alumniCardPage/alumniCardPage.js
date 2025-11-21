import { generateQRCode, getAlumniInfo } from '@/api/alumniCard'
import { toast } from '@/utils/common'
import store from '@/store'

export default {
	data() {
		return {
			// 导航栏配置
			navBackground: '#F0F4F8', // 导航栏背景色 - 与页面背景色保持一致
			navTitleColor: '#004299', // 导航栏标题颜色 - 重财蓝，在浅色背景上使用深色文字
			
			// 用户信息
			userInfo: {
				name: '', // 用户姓名
				enrollmentYear: '', // 入学年份
				educationType: '', // 入学类型：本科、专升本等
				faculty: '', // 院系
				avatar: '', // 头像URL，为空则使用默认头像
			},
			
			// 二维码数据
			qrcodeValue: '', // 二维码内容
			qrcodeExpireTime: 0, // 二维码过期时间戳
			qrcodeRefreshTimer: null, // 二维码刷新定时器
			
			// 是否显示二维码
			showQRCode: false,
			
			// 加载状态
			loading: false,
			
			// 测试模式 - 用于调试，实际部署时应设为false
			testMode: true
		}
	},
	onLoad() {
		// 页面加载时获取用户信息和生成二维码
		this.loadUserInfo();
	},
	onUnload() {
		// 页面卸载时清除定时器
		if (this.qrcodeRefreshTimer) {
			clearTimeout(this.qrcodeRefreshTimer);
		}
		if (this.expirationTimer) {
			clearTimeout(this.expirationTimer);
		}
	},
	methods: {
		/**
		 * 返回上一页
		 */
		goBack() {
			uni.navigateBack({
				delta: 1
			});
		},
	
		/**
		 * 加载用户信息
		 */
		async loadUserInfo() {
			let loadingShown = false;
			try {
				uni.showLoading({
					title: '加载中...'
				});
				loadingShown = true;
				
				console.log('开始获取用户校友信息...');
				
				// 测试模式：使用模拟数据
				if (this.testMode) {
					console.log('测试模式：使用模拟用户信息');
					// 从store获取昵称
					const nickName = store.state.user.nickName || '校友';
					const mockUserInfo = {
						code: 200,
						data: {
							enrollmentYear: '2020',
							educationType: '本科',
							faculty: '计算机学院',
							avatar: ''
						},
						msg: '获取成功'
					};
					
					// 模拟网络延迟
					await new Promise(resolve => setTimeout(resolve, 500));
					
					console.log('模拟用户信息响应:', mockUserInfo);
					
					if (mockUserInfo.code === 200 && mockUserInfo.data) {
						this.userInfo = {
							name: nickName,
							enrollmentYear: mockUserInfo.data.enrollmentYear || '',
							educationType: mockUserInfo.data.educationType || '',
							faculty: mockUserInfo.data.faculty || '',
							avatar: mockUserInfo.data.avatar || ''
						};
						console.log('用户信息加载成功:', this.userInfo);
						return;
					}
				}
				
				// 从store获取昵称
				const nickName = store.state.user.nickName || '校友';
				
				// 获取用户校友信息
				const userInfoRes = await getAlumniInfo();
				
				console.log('用户信息API响应:', userInfoRes);
				
				if (userInfoRes && userInfoRes.code === 200 && userInfoRes.data) {
					this.userInfo = {
						name: nickName,
						enrollmentYear: userInfoRes.data.enrollmentYear || '',
						educationType: userInfoRes.data.educationType || '',
						faculty: userInfoRes.data.faculty || '',
						avatar: userInfoRes.data.avatar || ''
					};
					console.log('用户信息加载成功:', this.userInfo);
				} else {
					console.warn('用户信息API返回异常，使用默认值');
					// 如果获取用户信息失败，使用默认值
					this.userInfo = {
						name: nickName,
						enrollmentYear: '未知',
						educationType: '未知',
						faculty: '未知',
						avatar: ''
					};
				}
			} catch (error) {
				console.error('获取用户信息失败:', error);
				// 从store获取昵称作为默认值
				const nickName = store.state.user.nickName || '校友';
				// 如果获取用户信息失败，使用默认值
				this.userInfo = {
					name: nickName,
					enrollmentYear: '未知',
					educationType: '未知',
					faculty: '未知',
					avatar: ''
				};
			} finally {
				if (loadingShown) {
					uni.hideLoading();
				}
			}
		},
		
		/**
		 * 生成二维码
		 */
		async generateQRCode() {
			if (this.loading) return;
			
			this.loading = true;
			let loadingShown = false;
			
			try {
				uni.showLoading({
					title: '生成二维码中...'
				});
				loadingShown = true;
				
				console.log('开始调用二维码生成API...');
				
				// 测试模式：使用模拟数据
				if (this.testMode) {
					console.log('测试模式：使用模拟二维码数据');
					const mockResponse = {
						code: 200,
						data: {
							qrcode: `ALUMNI_CARD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
						},
						msg: '生成成功'
					};
					
					// 模拟网络延迟
					await new Promise(resolve => setTimeout(resolve, 1000));
					
					console.log('模拟API响应:', mockResponse);
					
					if (mockResponse.code === 200 && mockResponse.data && mockResponse.data.qrcode) {
						this.qrcodeValue = mockResponse.data.qrcode;
						
						// 设置过期时间（30分钟）
						const expireTime = Date.now() + 30 * 60 * 1000;
						this.qrcodeExpireTime = expireTime;
						
						// 设置定时器，接近过期时提醒用户刷新
						this.setExpirationReminder();
						
						// 设置自动刷新定时器（25分钟后自动刷新）
						this.setAutoRefresh();
						
						console.log('二维码生成成功:', this.qrcodeValue);
						toast('二维码生成成功');
						return;
					}
				}
				
				// 调用后端API生成二维码
				const response = await generateQRCode();
				
				console.log('API响应:', response);
				
				// 检查响应是否是HTML页面（RuoYi欢迎页面）
				if (typeof response === 'string' && response.includes('RuoYi')) {
					throw new Error('API返回了欢迎页面，请检查API地址和端口配置');
				}
				
				if (response && response.code === 200) {
					// 处理不同的响应数据结构
					let qrcodeData = '';
					if (response.data) {
						qrcodeData = response.data.qrcode || response.data.qrcodeValue || response.data;
					} else {
						qrcodeData = response.qrcode || response.qrcodeValue || '';
					}
					
					if (qrcodeData && typeof qrcodeData === 'string') {
						this.qrcodeValue = qrcodeData;
						
						// 设置过期时间（30分钟）
						const expireTime = Date.now() + 30 * 60 * 1000;
						this.qrcodeExpireTime = expireTime;
						
						// 设置定时器，接近过期时提醒用户刷新
						this.setExpirationReminder();
						
						// 设置自动刷新定时器（25分钟后自动刷新）
						this.setAutoRefresh();
						
						console.log('二维码生成成功:', qrcodeData);
						toast('二维码生成成功');
					} else {
						throw new Error('服务器返回的二维码数据格式不正确');
					}
				} else {
					const errorMsg = response ? (response.msg || response.message || '生成二维码失败') : '服务器无响应';
					throw new Error(errorMsg);
				}
			} catch (error) {
				console.error('生成二维码失败:', error);
				
				// 提供更详细的错误信息
				let errorMessage = '生成二维码失败';
				if (error.message) {
					if (error.message.includes('timeout')) {
						errorMessage = '请求超时，请检查网络连接';
					} else if (error.message.includes('Network Error')) {
						errorMessage = '网络连接失败，请检查网络设置';
					} else if (error.message.includes('500')) {
						errorMessage = '服务器内部错误，请稍后重试';
					} else if (error.message.includes('401')) {
						errorMessage = '身份验证失败，请重新登录';
					} else {
						errorMessage = error.message;
					}
				}
				
				toast(errorMessage);
				
				// 清空二维码值，显示错误状态
				this.qrcodeValue = '';
			} finally {
				this.loading = false;
				if (loadingShown) {
					uni.hideLoading();
				}
			}
		},
		
		/**
		 * 设置过期提醒
		 */
		setExpirationReminder() {
			// 清除之前的计时器
			if (this.expirationTimer) {
				clearTimeout(this.expirationTimer);
			}
			
			const now = Date.now();
			const timeToExpire = this.qrcodeExpireTime - now;
			
			// 如果已过期，立即刷新
			if (timeToExpire <= 0) {
				this.generateQRCode();
				return;
			}
			
			// 设置在二维码过期前5分钟提醒
			const reminderTime = timeToExpire - (5 * 60 * 1000);
			if (reminderTime > 0) {
				this.expirationTimer = setTimeout(() => {
					uni.showToast({
						title: '二维码即将过期，请刷新',
						icon: 'none',
						duration: 3000
					});
				}, reminderTime);
			}
		},
		
		/**
		 * 设置自动刷新
		 */
		setAutoRefresh() {
			// 清除之前的自动刷新定时器
			if (this.qrcodeRefreshTimer) {
				clearTimeout(this.qrcodeRefreshTimer);
			}
			
			// 25分钟后自动刷新二维码
			this.qrcodeRefreshTimer = setTimeout(() => {
				if (this.showQRCode) {
					this.generateQRCode();
				}
			}, 25 * 60 * 1000);
		},
		
		/**
		 * 切换二维码显示/隐藏
		 */
		toggleQRCode() {
			if (!this.showQRCode) {
				// 显示前刷新二维码
				this.generateQRCode();
			}
			this.showQRCode = !this.showQRCode;
		},
		
		/**
		 * 切换测试模式
		 */
		toggleTestMode() {
			this.testMode = !this.testMode;
			toast(`测试模式已${this.testMode ? '开启' : '关闭'}`);
			console.log('测试模式:', this.testMode ? '开启' : '关闭');
		},
		
		/**
		 * 测试API连接
		 */
		async testAPIConnection() {
			try {
				uni.showLoading({
					title: '测试API连接...'
				});
				
				console.log('开始测试API连接...');
				console.log('API地址: http://10.155.10.148:8082/core/studentInfo/QRCode');
				
				// 直接调用API进行测试
				const response = await generateQRCode();
				
				console.log('API测试响应:', response);
				
				if (response) {
					if (typeof response === 'string') {
						if (response.includes('RuoYi')) {
							toast('API返回了RuoYi欢迎页面，请检查API路径');
						} else {
							toast('API返回了字符串数据');
						}
					} else if (response.code === 200) {
						toast('API连接成功！');
					} else {
						toast(`API返回错误码: ${response.code}`);
					}
				} else {
					toast('API无响应');
				}
			} catch (error) {
				console.error('API测试失败:', error);
				toast(`API测试失败: ${error.message}`);
			} finally {
				uni.hideLoading();
			}
		}
	}
}
