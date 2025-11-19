export default {
	data() {
		return {
			// 导航栏配置
			navBackground: '#F0F4F8', // 导航栏背景色 - 与页面背景色保持一致
			navTitleColor: '#004299', // 导航栏标题颜色 - 重财蓝，在浅色背景上使用深色文字
			
			// 用户信息
			userInfo: {
				name: '张三', // 用户姓名
				enrollmentYear: '2025', // 入学年份
				educationType: '本科', // 入学类型：本科、专升本等
				faculty: '会计学院', // 院系
				avatar: '', // 头像URL，为空则使用默认头像
			},
			
			// 二维码数据
			qrcodeValue: '', // 二维码内容
			qrcodeExpireTime: 0, // 二维码过期时间戳
			
			// 是否显示二维码
			showQRCode: false
		}
	},
	onLoad() {
		// 页面加载时生成二维码
		this.generateQRCode();
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
		 * 生成二维码
		 */
		generateQRCode() {
			// 模拟生成二维码，实际应用中应该从服务器获取
			// 二维码内容可以包含用户ID、时间戳等信息，并加密
			const timestamp = Date.now();
			const expireTime = timestamp + 30 * 60 * 1000; // 30分钟后过期
			
			// 二维码内容格式(示例)：userID_timestamp_expireTime_signature
			// 这里简化处理，实际应用中应该添加签名防篡改
			const qrcodeContent = `alumni_${this.userInfo.name}_${timestamp}_${expireTime}`;
			
			this.qrcodeValue = qrcodeContent;
			this.qrcodeExpireTime = expireTime;
			
			// 设置定时器，接近过期时提醒用户刷新
			this.setExpirationReminder();
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
		 * 切换二维码显示/隐藏
		 */
		toggleQRCode() {
			if (!this.showQRCode) {
				// 显示前刷新二维码
				this.generateQRCode();
			}
			this.showQRCode = !this.showQRCode;
		}
	}
}
