<template>
	<view class="news-detail-page">
		<!-- 导航栏 -->
		<fui-nav-bar
			:statusBar="true"
			title="新闻详情"
			:background="'#004299'"
			:color="'#FFFFFF'"
			:size="18"
			:isFixed="true"
			:fontWeight="500"
			@init="navbarInit">
		</fui-nav-bar>
		
		<!-- 内容区域 -->
		<view class="content-area" :style="{ marginTop: navHeight + 'px' }">
			<!-- 加载中 -->
			<view class="loading" v-if="loading">
				<text class="loading-text">加载中...</text>
			</view>
			
			<!-- 新闻详情 -->
			<view class="news-detail" v-if="!loading && newsDetail">
				<!-- 新闻标题 -->
				<view class="news-title">{{ newsDetail.title }}</view>
				
				<!-- 新闻元信息 -->
				<view class="news-meta">
					<view class="meta-item">
						<text class="meta-label">发布时间：</text>
						<text class="meta-value">{{ formatTime(newsDetail.createTime) }}</text>
					</view>
					<view class="meta-item" v-if="newsDetail.createBy">
						<text class="meta-label">发布人：</text>
						<text class="meta-value">{{ newsDetail.createBy }}</text>
					</view>
					<view class="meta-item" v-if="newsDetail.updateTime && newsDetail.updateTime !== newsDetail.createTime">
						<text class="meta-label">更新时间：</text>
						<text class="meta-value">{{ formatTime(newsDetail.updateTime) }}</text>
					</view>
				</view>
				
				<!-- 新闻图片 -->
				<view class="news-image" v-if="newsDetail.backgroundImage">
					<image :src="getImageUrl(newsDetail.backgroundImage)" class="detail-img" mode="widthFix"></image>
				</view>
				
				<!-- 新闻内容 -->
				<view class="news-content">
					<view class="content-section" v-if="newsDetail.remark">
						<text class="section-title">内容摘要</text>
						<text class="section-content">{{ newsDetail.remark }}</text>
					</view>
					
					<view class="content-section" v-if="newsDetail.url">
						<text class="section-title">相关链接</text>
						<view class="link-item" @tap="openUrl(newsDetail.url)">
							<image src="/static/external-link-line.svg" class="link-icon svg-icon svg-blue"></image>
							<text class="link-text">
								{{ newsDetail.url.includes('mp.weixin.qq.com') ? '查看微信原文' : '查看原文' }}
							</text>
							<text class="link-hint" v-if="newsDetail.url.includes('mp.weixin.qq.com')">
								(点击复制链接)
							</text>
						</view>
					</view>
				</view>
				
				<!-- 操作按钮 -->
				<view class="action-buttons">
					<view class="action-btn share-btn" @tap="handleShare">
						<image src="/static/share-line.svg" class="btn-icon svg-icon svg-white"></image>
						<text class="btn-text">分享</text>
					</view>
					<view class="action-btn back-btn" @tap="handleBack">
						<image src="/static/arrow-left-line.svg" class="btn-icon svg-icon svg-white"></image>
						<text class="btn-text">返回</text>
					</view>
				</view>
			</view>
			
			<!-- 错误状态 -->
			<view class="error-state" v-if="!loading && !newsDetail">
				<image src="/static/error-warning-line.svg" class="error-icon svg-icon svg-gray"></image>
				<text class="error-text">加载失败，请稍后重试</text>
				<view class="retry-btn" @tap="loadNewsDetail">
					<text class="retry-text">重新加载</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getNewsDetail } from '@/api/news'
	
	export default {
		data() {
			return {
				navHeight: 44,
				newsId: '',
				newsDetail: null,
				loading: false
			}
		},
		onLoad(options) {
			if (options.id) {
				this.newsId = options.id
				this.loadNewsDetail()
			}
		},
		methods: {
			// 导航栏初始化
			navbarInit(e) {
				this.navHeight = e.height + e.statusBarHeight
			},
			
			// 加载新闻详情
			async loadNewsDetail() {
				if (!this.newsId) {
					console.error('新闻ID为空，无法加载详情')
					uni.showToast({
						title: '新闻ID无效',
						icon: 'none'
					})
					return
				}
				
				this.loading = true
				console.log('开始加载新闻详情，ID:', this.newsId)
				
				try {
					const response = await getNewsDetail(this.newsId)
					console.log('新闻详情API响应:', response)
					
					if (response && response.code === 200) {
						// 根据新的API响应格式处理数据
						this.newsDetail = response.data || response
						console.log('新闻详情加载成功:', this.newsDetail)
					} else {
						console.error('获取新闻详情失败，响应:', response)
						uni.showToast({
							title: response?.msg || '获取新闻详情失败',
							icon: 'none'
						})
					}
				} catch (error) {
					console.error('加载新闻详情异常:', error)
					console.error('错误详情:', {
						message: error.message,
						stack: error.stack,
						newsId: this.newsId
					})
					
					let errorMessage = '网络错误，请稍后重试'
					if (error.message && error.message.includes('timeout')) {
						errorMessage = '请求超时，请检查网络连接'
					} else if (error.message && error.message.includes('Network Error')) {
						errorMessage = '网络连接失败，请检查网络设置'
					}
					
					uni.showToast({
						title: errorMessage,
						icon: 'none',
						duration: 3000
					})
				} finally {
					this.loading = false
				}
			},
			
			// 打开链接
			openUrl(url) {
				if (!url) return
				
				console.log('打开链接:', url)
				
				// 检查是否是微信公众号链接
				if (url.includes('mp.weixin.qq.com')) {
					// 微信公众号文章无法在小程序webview中打开，提供复制链接选项
					uni.showModal({
						title: '查看原文',
						content: '由于微信限制，无法在小程序中直接打开公众号文章。是否复制链接，您可以在微信中打开？',
						confirmText: '复制链接',
						cancelText: '取消',
						success: (res) => {
							if (res.confirm) {
								uni.setClipboardData({
									data: url,
									success: () => {
										uni.showToast({
											title: '链接已复制到剪贴板',
											icon: 'success',
											duration: 2000
										})
										
										// 提示用户如何使用
										setTimeout(() => {
											uni.showModal({
												title: '使用提示',
												content: '请在微信聊天界面长按输入框，选择"粘贴"即可打开文章',
												showCancel: false,
												confirmText: '知道了'
											})
										}, 2500)
									},
									fail: () => {
										uni.showToast({
											title: '复制失败',
											icon: 'none'
										})
									}
								})
							}
						}
					})
				} else {
					// 其他链接尝试在webview中打开
					uni.navigateTo({
						url: `/pages/common/webview/index?url=${encodeURIComponent(url)}`,
						success: () => {
							console.log('webview页面跳转成功')
						},
						fail: (error) => {
							console.error('webview页面跳转失败:', error)
							// 如果跳转失败，提供复制链接的选项
							uni.showModal({
								title: '提示',
								content: '无法打开网页，是否复制链接到剪贴板？',
								success: (res) => {
									if (res.confirm) {
										uni.setClipboardData({
											data: url,
											success: () => {
												uni.showToast({
													title: '链接已复制',
													icon: 'success'
												})
											}
										})
									}
								}
							})
						}
					})
				}
			},
			
			// 分享新闻
			handleShare() {
				if (!this.newsDetail) return
				
				uni.share({
					provider: "weixin",
					scene: "WXSceneSession",
					type: 0,
					href: this.newsDetail.url || '',
					title: this.newsDetail.title || '',
					summary: this.newsDetail.remark || '',
					imageUrl: this.newsDetail.backgroundImage || '',
					success: function (res) {
						uni.showToast({
							title: '分享成功',
							icon: 'success'
						})
					},
					fail: function (err) {
						uni.showToast({
							title: '分享失败',
							icon: 'none'
						})
					}
				})
			},
			
			// 返回上一页
			handleBack() {
				uni.navigateBack()
			},
			
			// 格式化时间
			formatTime(timeString) {
				if (!timeString) return ''
				
				const date = new Date(timeString)
				const year = date.getFullYear()
				const month = String(date.getMonth() + 1).padStart(2, '0')
				const day = String(date.getDate()).padStart(2, '0')
				const hours = String(date.getHours()).padStart(2, '0')
				const minutes = String(date.getMinutes()).padStart(2, '0')
				
				return `${year}-${month}-${day} ${hours}:${minutes}`
			},
			
			// 处理图片URL
			getImageUrl(imagePath) {
				if (!imagePath) return ''
				
				// 如果已经是完整的URL，直接返回
				if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
					return imagePath
				}
				
				// 如果是相对路径，拼接服务器地址
				const baseUrl = 'http://10.155.10.148:8090'
				return baseUrl + imagePath
			}
		}
	}
</script>

<style scoped>
	.news-detail-page {
		background-color: #f5f5f5;
		min-height: 100vh;
	}
	
	.content-area {
		padding: 15px;
	}
	
	/* 加载中样式 */
	.loading {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 60px 20px;
	}
	
	.loading-text {
		font-size: 14px;
		color: #999999;
	}
	
	/* 新闻详情样式 */
	.news-detail {
		background-color: #ffffff;
		border-radius: 8px;
		padding: 20px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}
	
	.news-title {
		font-size: 20px;
		font-weight: 600;
		color: #333333;
		line-height: 1.4;
		margin-bottom: 15px;
	}
	
	.news-meta {
		margin-bottom: 20px;
		padding-bottom: 15px;
		border-bottom: 1px solid #f0f0f0;
	}
	
	.meta-item {
		display: flex;
		align-items: center;
		margin-bottom: 8px;
	}
	
	.meta-item:last-child {
		margin-bottom: 0;
	}
	
	.meta-label {
		font-size: 14px;
		color: #666666;
		width: 80px;
		flex-shrink: 0;
	}
	
	.meta-value {
		font-size: 14px;
		color: #333333;
		flex: 1;
	}
	
	.news-image {
		margin-bottom: 20px;
		border-radius: 8px;
		overflow: hidden;
	}
	
	.detail-img {
		width: 100%;
		display: block;
	}
	
	.news-content {
		margin-bottom: 30px;
	}
	
	.content-section {
		margin-bottom: 20px;
	}
	
	.content-section:last-child {
		margin-bottom: 0;
	}
	
	.section-title {
		font-size: 16px;
		font-weight: 500;
		color: #333333;
		margin-bottom: 10px;
		display: block;
	}
	
	.section-content {
		font-size: 15px;
		color: #666666;
		line-height: 1.6;
		display: block;
	}
	
	.link-item {
		display: flex;
		align-items: center;
		padding: 12px;
		background-color: #f8f9fa;
		border-radius: 6px;
		gap: 8px;
	}
	
	.link-icon {
		width: 16px;
		height: 16px;
	}
	
	.link-text {
		font-size: 14px;
		color: #1890ff;
	}
	
	.link-hint {
		font-size: 12px;
		color: #999999;
		margin-left: 4px;
	}
	
	/* 操作按钮样式 */
	.action-buttons {
		display: flex;
		gap: 15px;
	}
	
	.action-btn {
		flex: 1;
		height: 44px;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}
	
	.share-btn {
		background-color: #52c41a;
	}
	
	.back-btn {
		background-color: #666666;
	}
	
	.btn-icon {
		width: 18px;
		height: 18px;
	}
	
	.btn-text {
		color: #ffffff;
		font-size: 14px;
		font-weight: 500;
	}
	
	/* 错误状态样式 */
	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60px 20px;
	}
	
	.error-icon {
		width: 64px;
		height: 64px;
		margin-bottom: 16px;
	}
	
	.error-text {
		font-size: 14px;
		color: #999999;
		margin-bottom: 20px;
	}
	
	.retry-btn {
		padding: 10px 20px;
		background-color: #1890ff;
		border-radius: 20px;
	}
	
	.retry-text {
		color: #ffffff;
		font-size: 14px;
	}
	
	/* SVG图标颜色类 */
	.svg-icon.svg-white {
		filter: brightness(0) saturate(100%) invert(100%);
	}
	
	.svg-icon.svg-blue {
		filter: brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%);
	}
	
	.svg-icon.svg-gray {
		filter: brightness(0) saturate(100%) invert(60%);
	}
</style>
