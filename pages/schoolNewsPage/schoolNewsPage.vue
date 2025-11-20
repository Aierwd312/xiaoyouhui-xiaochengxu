<template>
	<view class="news-page">
		<!-- 导航栏 -->
		<fui-nav-bar
			:statusBar="true"
			title="母校资讯"
			:background="'#004299'"
			:color="'#FFFFFF'"
			:size="18"
			:isFixed="true"
			:fontWeight="500"
			@init="navbarInit">
		</fui-nav-bar>
		
		<!-- 内容区域 -->
		<view class="content-area" :style="{ marginTop: navHeight + 'px' }">
			<!-- 搜索栏 -->
			<view class="search-section">
				<view class="search-bar">
					<input 
						class="search-input" 
						placeholder="搜索新闻标题..."
						v-model="searchTitle"
						@confirm="handleSearch"
					/>
					<view class="search-btn" @tap="handleSearch">
						<image src="/static/search-line.svg" class="search-icon svg-icon svg-white"></image>
					</view>
				</view>
			</view>
			
			<!-- 功能按钮区域 -->
			<view class="action-section">
				<view class="action-btn export-btn" @tap="handleExportNews">
					<image src="/static/download-line.svg" class="action-icon svg-icon svg-white"></image>
					<text class="action-text">导出列表</text>
				</view>
				<view class="action-btn refresh-btn" @tap="handleRefresh">
					<image src="/static/refresh-line.svg" class="action-icon svg-icon svg-white"></image>
					<text class="action-text">刷新</text>
				</view>
			</view>
			
			<!-- 新闻列表 -->
			<view class="news-list">
				<view 
					class="news-item" 
					v-for="(item, index) in newsList" 
					:key="item.id"
					@tap="handleNewsClick(item)"
				>
					<view class="news-image" v-if="item.backgroundImage">
						<image :src="getImageUrl(item.backgroundImage)" class="news-img" mode="aspectFill"></image>
					</view>
					<view class="news-content" :class="{'no-image': !item.backgroundImage}">
						<view class="news-title">{{ item.title }}</view>
						<view class="news-meta">
							<text class="news-time">{{ formatTime(item.createTime) }}</text>
							<text class="news-author" v-if="item.createBy">{{ item.createBy }}</text>
						</view>
						<view class="news-remark" v-if="item.remark">{{ item.remark }}</view>
					</view>
					<view class="news-action">
						<image src="/static/arrow-right-s-line.svg" class="action-arrow svg-icon svg-hint"></image>
					</view>
				</view>
			</view>
			
			<!-- 加载更多 -->
			<view class="load-more" v-if="hasMore && !loading">
				<view class="load-more-btn" @tap="loadMore">
					<text class="load-more-text">加载更多</text>
				</view>
			</view>
			
			<!-- 加载中 -->
			<view class="loading" v-if="loading">
				<text class="loading-text">加载中...</text>
			</view>
			
			<!-- 暂无数据 -->
			<view class="no-data" v-if="!loading && newsList.length === 0">
				<image src="/static/inbox-line.svg" class="no-data-icon svg-icon svg-gray"></image>
				<text class="no-data-text">暂无新闻数据</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { getNewsList, getNewsDetail, exportNewsList } from '@/api/news'
	
	export default {
		data() {
			return {
				navHeight: 44,
				searchTitle: '',
				newsList: [],
				loading: false,
				hasMore: true,
				pageNum: 1,
				pageSize: 10,
				total: 0
			}
		},
		onLoad() {
			this.loadNewsList()
		},
		onShow() {
			// 页面显示时刷新数据
			this.handleRefresh()
		},
		methods: {
			// 导航栏初始化
			navbarInit(e) {
				this.navHeight = e.height + e.statusBarHeight
			},
			
			// 加载新闻列表
			async loadNewsList(isLoadMore = false) {
				if (this.loading) return
				
				this.loading = true
				
				try {
					const params = {
						pageNum: isLoadMore ? this.pageNum : 1,
						pageSize: this.pageSize,
						title: this.searchTitle
					}
					
					const response = await getNewsList(params)
					console.log('API响应数据:', response)
					
					if (response.code === 200) {
						// 根据实际API响应结构处理数据
						let newsData = []
						let totalCount = 0
						
						if (response.rows) {
							// 新的API响应格式：数据直接在根级别
							newsData = response.rows
							totalCount = response.total || 0
						} else if (response.data) {
							// 兼容旧格式：数据在data字段下
							if (response.data.rows) {
								newsData = response.data.rows
								totalCount = response.data.total || 0
							} else if (Array.isArray(response.data)) {
								newsData = response.data
								totalCount = response.data.length
							} else {
								newsData = [response.data]
								totalCount = 1
							}
						}
						
						if (isLoadMore) {
							this.newsList = [...this.newsList, ...newsData]
						} else {
							this.newsList = newsData
							this.pageNum = 1
						}
						
						this.total = totalCount
						this.hasMore = this.newsList.length < totalCount
						
						if (isLoadMore) {
							this.pageNum++
						}
					} else {
						uni.showToast({
							title: response.msg || '获取新闻列表失败',
							icon: 'none'
						})
					}
				} catch (error) {
					console.error('加载新闻列表失败:', error)
					console.error('错误详情:', {
						message: error.message,
						stack: error.stack,
						params: {
							pageNum: isLoadMore ? this.pageNum : 1,
							pageSize: this.pageSize,
							title: this.searchTitle
						}
					})
					
					// 如果是网络错误，提供更具体的提示
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
			
			// 搜索新闻
			handleSearch() {
				this.pageNum = 1
				this.hasMore = true
				this.loadNewsList()
			},
			
			// 刷新数据
			handleRefresh() {
				this.pageNum = 1
				this.hasMore = true
				this.loadNewsList()
			},
			
			// 加载更多
			loadMore() {
				if (this.hasMore && !this.loading) {
					this.loadNewsList(true)
				}
			},
			
			// 点击新闻项
			handleNewsClick(newsItem) {
				console.log('点击新闻项:', newsItem)
				
				if (!newsItem || !newsItem.id) {
					console.error('新闻项数据无效:', newsItem)
					uni.showToast({
						title: '新闻数据无效',
						icon: 'none'
					})
					return
				}
				
				const detailUrl = `/pages/newsDetailPage/newsDetailPage?id=${newsItem.id}`
				console.log('跳转到新闻详情页面:', detailUrl)
				
				// 跳转到新闻详情页面
				uni.navigateTo({
					url: detailUrl,
					success: () => {
						console.log('页面跳转成功')
					},
					fail: (error) => {
						console.error('页面跳转失败:', error)
						uni.showToast({
							title: '页面跳转失败',
							icon: 'none'
						})
					}
				})
			},
			
			// 导出新闻列表
			async handleExportNews() {
				let params = null // 在函数顶层定义，避免作用域问题
				
				try {
					uni.showLoading({
						title: '正在导出...'
					})
					
					// 尝试不同的导出方式来避免路由冲突
					params = {}
					
					// 只在有搜索条件时才添加参数
					if (this.searchTitle && this.searchTitle.trim()) {
						params.title = this.searchTitle.trim()
					}
					
					console.log('导出参数:', params)
					console.log('完整导出URL:', `${this.$config?.baseUrl || 'http://10.155.10.148:8090/prod-api'}/core/news/export`)
					
					const response = await exportNewsList(params)
					console.log('导出API响应:', response)
					
					// 检查响应是否为文件数据
					if (typeof response === 'string' && (response.startsWith('PK') || response.includes('xlsx') || response.includes('xls'))) {
						// 响应是文件数据，表示导出成功
						uni.showToast({
							title: '导出成功，文件已生成',
							icon: 'success'
						})
						
						// 在小程序中，我们可以提示用户文件已生成
						setTimeout(() => {
							uni.showModal({
								title: '导出完成',
								content: '新闻列表已成功导出。由于小程序限制，请联系管理员获取导出文件。',
								showCancel: false,
								confirmText: '知道了'
							})
						}, 1500)
						
						console.log('导出文件数据长度:', response.length)
					} else if (response && response.code === 200) {
						uni.showToast({
							title: '导出成功',
							icon: 'success'
						})
						console.log('导出数据:', response.data)
					} else {
						console.error('导出失败，响应:', response)
						uni.showToast({
							title: response?.msg || '导出失败',
							icon: 'none'
						})
					}
				} catch (error) {
					console.error('导出新闻列表异常:', error)
					console.error('错误详情:', {
						message: error.message,
						stack: error.stack,
						params: params,
						apiUrl: '/core/news/export'
					})
					
					let errorMessage = '导出失败，请稍后重试'
					if (error === '500' || (error.message && error.message.includes('500'))) {
						errorMessage = '服务器内部错误，可能是路由配置问题'
					} else if (error.message && error.message.includes('timeout')) {
						errorMessage = '导出超时，请稍后重试'
					} else if (error.message && error.message.includes('Long')) {
						errorMessage = '后端接口参数类型错误，请联系管理员'
					}
					
					uni.showToast({
						title: errorMessage,
						icon: 'none',
						duration: 3000
					})
				} finally {
					uni.hideLoading()
				}
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
	.news-page {
		background-color: #f5f5f5;
		min-height: 100vh;
	}
	
	.content-area {
		padding: 0 15px;
	}
	
	/* 搜索栏样式 */
	.search-section {
		margin: 15px 0;
	}
	
	.search-bar {
		display: flex;
		align-items: center;
		background-color: #ffffff;
		border-radius: 8px;
		padding: 0 15px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}
	
	.search-input {
		flex: 1;
		height: 44px;
		font-size: 14px;
		color: #333333;
	}
	
	.search-btn {
		width: 32px;
		height: 32px;
		background-color: #004299;
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 10px;
	}
	
	.search-icon {
		width: 18px;
		height: 18px;
	}
	
	/* 功能按钮区域 */
	.action-section {
		display: flex;
		gap: 10px;
		margin-bottom: 15px;
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
	
	.export-btn {
		background-color: #52c41a;
	}
	
	.refresh-btn {
		background-color: #1890ff;
	}
	
	.action-icon {
		width: 18px;
		height: 18px;
	}
	
	.action-text {
		color: #ffffff;
		font-size: 14px;
		font-weight: 500;
	}
	
	/* 新闻列表样式 */
	.news-list {
		margin-bottom: 20px;
	}
	
	.news-item {
		background-color: #ffffff;
		border-radius: 8px;
		margin-bottom: 10px;
		padding: 15px;
		display: flex;
		align-items: flex-start;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}
	
	.news-image {
		width: 80px;
		height: 60px;
		border-radius: 6px;
		overflow: hidden;
		margin-right: 12px;
		flex-shrink: 0;
	}
	
	.news-img {
		width: 100%;
		height: 100%;
	}
	
	.news-content {
		flex: 1;
		min-width: 0;
	}
	
	.news-content.no-image {
		margin-right: 12px;
	}
	
	.news-title {
		font-size: 16px;
		font-weight: 500;
		color: #333333;
		line-height: 1.4;
		margin-bottom: 8px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	
	.news-meta {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 6px;
	}
	
	.news-time {
		font-size: 12px;
		color: #999999;
	}
	
	.news-author {
		font-size: 12px;
		color: #666666;
	}
	
	.news-remark {
		font-size: 14px;
		color: #666666;
		line-height: 1.4;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	
	.news-action {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
	}
	
	.action-arrow {
		width: 16px;
		height: 16px;
	}
	
	/* 加载更多样式 */
	.load-more {
		display: flex;
		justify-content: center;
		margin: 20px 0;
	}
	
	.load-more-btn {
		padding: 10px 20px;
		background-color: #ffffff;
		border-radius: 20px;
		border: 1px solid #d9d9d9;
	}
	
	.load-more-text {
		font-size: 14px;
		color: #666666;
	}
	
	/* 加载中样式 */
	.loading {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20px;
	}
	
	.loading-text {
		font-size: 14px;
		color: #999999;
	}
	
	/* 暂无数据样式 */
	.no-data {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60px 20px;
	}
	
	.no-data-icon {
		width: 64px;
		height: 64px;
		margin-bottom: 16px;
	}
	
	.no-data-text {
		font-size: 14px;
		color: #999999;
	}
	
	/* SVG图标颜色类 */
	.svg-icon.svg-white {
		filter: brightness(0) saturate(100%) invert(100%);
	}
	
	.svg-icon.svg-hint {
		filter: brightness(0) saturate(100%) invert(60%);
	}
	
	.svg-icon.svg-gray {
		filter: brightness(0) saturate(100%) invert(60%);
	}
</style>
