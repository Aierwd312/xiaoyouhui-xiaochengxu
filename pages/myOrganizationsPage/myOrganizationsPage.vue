<template>
	<view class="page-container">
		<!-- 自定义导航栏，参考校友卡页面实现 -->
		<view class="custom-nav-bar" :style="{ height: navHeight + 'px' }">
			<view class="nav-bar-content" :style="{ paddingTop: statusBarHeight + 'px' }">
				<view class="nav-back" @click="goBack">
					<text class="back-arrow">←</text>
				</view>
				<view class="nav-title">我的组织</view>
			</view>
		</view>
		
		<!-- 内容区域，添加上边距与导航栏高度相同 -->
		<view class="content-area" :style="{ paddingTop: navHeight + 'px' }">
			<!-- 自定义Tab切换栏 -->
			<view class="custom-tabs">
				<view 
					v-for="(tab, index) in tabs" 
					:key="index"
					:class="['custom-tab-item', currentTab === index ? 'custom-tab-active' : '']"
					@click="onTabChange({index})">
					<text>{{tab.text}}</text>
				</view>
				<view class="custom-tab-line" :style="{transform: `translateX(${currentTab * 100}%)`}"></view>
			</view>
			
			<!-- Tab内容区域 -->
			<view class="tab-content">
				<!-- Tab - 我的已加组织 -->
				<view v-if="currentTab === 0">
					<!-- 已加入组织列表 -->
					<view v-if="joinedOrganizations.length > 0" class="org-list">
						<view class="org-card">
							<view 
								class="org-item" 
								v-for="(org, index) in joinedOrganizations" 
								:key="org.id">
								
								<!-- 组织Logo -->
								<image 
									class="org-logo" 
									:src="org.logoUrl" 
									mode="aspectFill"
									@error="handleLogoError(index, 'joined')">
								</image>
								
								<!-- 组织信息 -->
								<view class="org-info">
									<view class="org-name">{{org.name}}</view>
									<view class="org-type">{{org.type}}</view>
								</view>
								
								<!-- 查看二维码按钮 -->
								<view class="view-qrcode" @click.stop="showQrCode(org)">
									<text>查看二维码</text>
									<text class="arrow-right">→</text>
								</view>
							</view>
						</view>
					</view>
					
					<!-- 加载中状态 -->
					<view v-else-if="loading" class="loading-container">
						<view class="custom-loading">
							<text>加载中...</text>
						</view>
					</view>
					
					<!-- 空状态 -->
					<view v-else class="empty-state">
						<view class="empty-text">您尚未加入任何组织，快去"发现组织"看看吧！</view>
						<view class="btn primary-btn empty-action" @click="switchToDiscover">去发现组织</view>
					</view>
				</view>
				
				<!-- Tab - 发现组织 -->
				<view v-else>
					<!-- 搜索栏 -->
					<view class="search-container">
						<view class="custom-search-bar">
							<input 
								type="text" 
								class="search-input" 
								:value="searchText" 
								placeholder="搜索组织名称或类型" 
								confirm-type="search"
								@confirm="onSearchConfirm"
							/>
							<text v-if="searchText" class="search-clear" @click="onSearchClear">×</text>
							<view class="search-btn" @click="onSearchConfirm">搜索</view>
						</view>
					</view>
					
					<!-- 分类筛选条 -->
					<scroll-view scroll-x class="category-filter" show-scrollbar="false">
						<view 
							v-for="(item, index) in categories" 
							:key="index" 
							:class="['filter-item', selectedCategory === item.value ? 'active' : '']"
							@click="selectCategory(item.value)">
							{{item.label}}
						</view>
					</scroll-view>
					
					<!-- 可发现组织列表 -->
					<view v-if="discoverableOrganizations.length > 0" class="org-list">
						<view class="org-card">
							<view 
								class="org-item" 
								v-for="(org, index) in discoverableOrganizations" 
								:key="org.id">
								
								<!-- 组织Logo -->
								<image 
									class="org-logo" 
									:src="org.logoUrl" 
									mode="aspectFill"
									@error="handleLogoError(index, 'discover')">
								</image>
								
								<!-- 组织信息 -->
								<view class="org-info">
									<view class="org-name">{{org.name}}</view>
									<view class="org-desc">{{org.description || org.type}}</view>
								</view>
								
								<!-- 根据状态显示不同按钮 -->
								<view 
									:class="['btn', getButtonClass(org)]"
									@click.stop="org.status === 'joinable' && joinOrganization(org)">
									{{getButtonText(org)}}
								</view>
							</view>
						</view>
						
						<!-- 加载更多/无更多数据 -->
						<view v-if="!loadingMore && hasMoreData" class="load-more-area" @click="loadMoreDiscoverable">
							<text class="load-more-text">点击加载更多</text>
						</view>
						<view v-else-if="loadingMore" class="load-more-area">
							<text class="load-more-text">加载中...</text>
						</view>
						<view v-else-if="!hasMoreData && discoverableOrganizations.length > 0" class="load-more-area">
							<text class="load-more-text">没有更多了</text>
						</view>
					</view>
					
					<!-- 加载中状态 -->
					<view v-else-if="loading" class="loading-container">
						<view class="custom-loading">
							<text>加载中...</text>
						</view>
					</view>
					
					<!-- 空状态 -->
					<view v-else class="empty-state">
						<view class="empty-text">
							{{searchText || selectedCategory ? '未找到相关组织，请尝试更换关键词或筛选条件' : '暂无可加入的校友组织'}}
						</view>
						<view v-if="searchText || selectedCategory" class="btn secondary-btn empty-action" @click="resetFilters">
							重置筛选
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 社群二维码弹窗 - 仿照校友卡页面实现 -->
		<view v-if="showQrModal" class="modal-mask" @click="handleCloseQrModal">
			<view class="qrcode-modal" @click.stop>
				<view class="qrcode-title">{{currentDisplayOrg.name}}</view>
				<view class="qrcode-subtitle">社群二维码</view>
				
				<view class="qrcode-container">
					<!-- 二维码图片 -->
					<view v-if="qrCodeLoading" class="qrcode-loading">
						<text class="loading-text">二维码加载中...</text>
					</view>
					<image 
						v-else
						:src="currentDisplayOrg.qrCodeUrl" 
						mode="aspectFit"
						class="qrcode-image"
						@error="handleQrCodeError">
					</image>
				</view>
				
				<view class="qrcode-footer">
					<text class="qrcode-desc">扫码加入社群</text>
					<text class="qrcode-tip">请勿将二维码分享给无关人员</text>
				</view>
				
				<view class="qrcode-buttons">
					<view class="qrcode-btn save-btn" @click="saveQrToAlbum">保存到相册</view>
					<view class="qrcode-btn close-btn" @click="handleCloseQrModal">关闭</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { 
	getMyJoinedOrganizations, 
	getDiscoverableOrganizations, 
	requestToJoinOrganization, 
	saveImageToPhotosAlbum 
} from './myOrganizationsPage.js'

export default {
	data() {
		return {
			// 导航栏相关
			statusBarHeight: 20, // 默认状态栏高度
			navHeight: 64,      // 默认导航栏高度（状态栏 + 导航内容）
			
			// Tab配置
			tabs: [
				{ text: '我的已加组织' },
				{ text: '发现组织' }
			],
			currentTab: 0,
			
			// 状态标志
			loading: false,
			refreshing: false,
			loadingMore: false,
			qrCodeLoading: true,
			
			// 已加入组织数据
			joinedOrganizations: [],
			
			// 可发现组织数据
			discoverableOrganizations: [],
			searchText: '',
			selectedCategory: '',
			page: 1,
			limit: 10,
			hasMoreData: true,
			
			// 分类筛选
			categories: [
				{ label: '全部', value: '' },
				{ label: '校友总会', value: 'main' },
				{ label: '地方分会', value: 'local' },
				{ label: '院系分会', value: 'college' },
				{ label: '专业分会', value: 'major' }
			],
			
			// 二维码弹窗
			showQrModal: false,
			currentDisplayOrg: {}
		}
	},
	// 生命周期钩子
	onLoad() {
		// 获取系统状态栏高度
		this.getStatusBarHeight();
		// 初始化页面，加载数据
		this.loadData(true);
	},
	onShow() {
		// 若需要每次显示都刷新数据，可在此处调用loadData
	},
	onPullDownRefresh() {
		this.refreshing = true;
		this.loadData(false);
		setTimeout(() => {
			this.refreshing = false;
			uni.stopPullDownRefresh();
		}, 1000);
	},
	onReachBottom() {
		if (this.currentTab === 1 && this.hasMoreData && !this.loadingMore) {
			this.loadMoreDiscoverable();
		}
	},
	methods: {
		/**
		 * 获取系统状态栏高度
		 */
		getStatusBarHeight() {
			try {
				const systemInfo = uni.getSystemInfoSync();
				this.statusBarHeight = systemInfo.statusBarHeight || 20;
				this.navHeight = this.statusBarHeight + 44; // 44 是导航内容高度
			} catch (e) {
				console.error('获取系统信息失败', e);
			}
		},
		
		/**
		 * 加载页面数据
		 * @param {Boolean} showLoading 是否显示加载中提示
		 */
		async loadData(showLoading = true) {
			if (showLoading) {
				this.loading = true;
			}
			
			if (this.currentTab === 0) {
				await this.loadJoinedOrganizations();
			} else {
				this.resetDiscoverableParams();
				await this.loadDiscoverableOrganizations();
				
				// 预加载我的组织数据
				if (this.joinedOrganizations.length === 0) {
					this.loadJoinedOrganizations(false);
				}
			}
			
			if (showLoading) {
				this.loading = false;
			}
		},
		
		/**
		 * 加载已加入组织列表
		 * @param {Boolean} showToast 是否显示错误提示
		 */
		async loadJoinedOrganizations(showToast = true) {
			try {
				const result = await getMyJoinedOrganizations();
				this.joinedOrganizations = result || [];
			} catch (error) {
				console.error('加载已加入组织失败:', error);
				if (showToast) {
					this.showToast('获取组织列表失败');
				}
			}
		},
		
		/**
		 * 加载可发现组织列表
		 */
		async loadDiscoverableOrganizations() {
			try {
				const result = await getDiscoverableOrganizations({
					page: this.page,
					limit: this.limit,
					keyword: this.searchText,
					category: this.selectedCategory
				});
				
				if (this.page === 1) {
					this.discoverableOrganizations = result.data || [];
				} else {
					this.discoverableOrganizations = [
						...this.discoverableOrganizations, 
						...(result.data || [])
					];
				}
				
				// 判断是否还有更多数据
				this.hasMoreData = this.discoverableOrganizations.length < result.total;
			} catch (error) {
				console.error('加载可发现组织列表失败:', error);
				this.showToast('获取组织列表失败');
			}
		},
		
		/**
		 * 加载更多可发现组织
		 */
		async loadMoreDiscoverable() {
			if (this.loadingMore || !this.hasMoreData) return;
			
			this.loadingMore = true;
			this.page++;
			await this.loadDiscoverableOrganizations();
			this.loadingMore = false;
		},
		
		/**
		 * 重置发现组织参数
		 */
		resetDiscoverableParams() {
			this.page = 1;
			this.hasMoreData = true;
		},
		
		/**
		 * 重置所有筛选条件
		 */
		resetFilters() {
			this.searchText = '';
			this.selectedCategory = '';
			this.resetDiscoverableParams();
			this.loadDiscoverableOrganizations();
		},
		
		/**
		 * Tab切换处理函数
		 */
		onTabChange(e) {
			if (this.currentTab === e.index) return;
			
			this.currentTab = e.index;
			this.loadData(true);
		},
		
		/**
		 * 搜索处理函数
		 */
		onSearchConfirm(e) {
			const value = typeof e.detail === 'object' ? e.detail.value : this.searchText;
			if (this.searchText === value) return;
			
			this.searchText = value;
			this.resetDiscoverableParams();
			this.loadDiscoverableOrganizations();
		},
		
		/**
		 * 清空搜索关键词
		 */
		onSearchClear() {
			if (!this.searchText) return;
			
			this.searchText = '';
			this.resetDiscoverableParams();
			this.loadDiscoverableOrganizations();
		},
		
		/**
		 * 选择分类
		 */
		selectCategory(category) {
			if (this.selectedCategory === category) return;
			
			this.selectedCategory = category;
			this.resetDiscoverableParams();
			this.loadDiscoverableOrganizations();
		},
		
		/**
		 * 显示二维码
		 */
		showQrCode(org) {
			this.qrCodeLoading = true;
			this.currentDisplayOrg = org;
			this.showQrModal = true;
			
			// 模拟二维码加载
			setTimeout(() => {
				this.qrCodeLoading = false;
			}, 500);
		},
		
		/**
		 * 处理二维码图片加载错误
		 */
		handleQrCodeError() {
			this.showToast('二维码加载失败');
		},
		
		/**
		 * 关闭二维码弹窗
		 */
		handleCloseQrModal() {
			this.showQrModal = false;
			setTimeout(() => {
				this.currentDisplayOrg = {};
			}, 300);
		},
		
		/**
		 * 保存二维码到相册
		 */
		async saveQrToAlbum() {
			if (!this.currentDisplayOrg || !this.currentDisplayOrg.qrCodeUrl) {
				this.showToast('二维码获取失败');
				return;
			}
			
			const success = await saveImageToPhotosAlbum(this.currentDisplayOrg.qrCodeUrl);
			if (success) {
				// 保存成功，自动关闭弹窗
				setTimeout(() => {
					this.handleCloseQrModal();
				}, 1500);
			}
		},
		
		/**
		 * 申请加入组织
		 */
		async joinOrganization(org) {
			if (!org || org.status !== 'joinable') return;
			
			uni.showLoading({ title: '申请中...' });
			
			try {
				const result = await requestToJoinOrganization(org.id);
				
				if (result.success) {
					// 更新组织状态
					const index = this.discoverableOrganizations.findIndex(item => item.id === org.id);
					if (index !== -1) {
						this.$set(this.discoverableOrganizations[index], 'status', 'pending');
					}
					
					this.showToast('申请已提交', 'success');
				} else {
					this.showToast(result.message || '申请失败');
				}
			} catch (error) {
				console.error('申请加入组织失败:', error);
				this.showToast('申请失败，请稍后再试');
			} finally {
				uni.hideLoading();
			}
		},
		
		/**
		 * 根据组织状态获取按钮文本
		 */
		getButtonText(org) {
			switch(org.status) {
				case 'pending': return '审核中';
				case 'rejected': return '已拒绝';
				case 'joined': return '已加入';
				default: return '申请加入';
			}
		},
		
		/**
		 * 根据组织状态获取按钮样式
		 */
		getButtonClass(org) {
			switch(org.status) {
				case 'pending': return 'disabled-btn';
				case 'rejected': return 'disabled-btn';
				case 'joined': return 'secondary-btn';
				default: return 'primary-btn';
			}
		},
		
		/**
		 * 处理组织Logo加载错误
		 */
		handleLogoError(index, type) {
			const defaultLogo = '/static/images/org_logo_default.png';
			
			if (type === 'joined' && this.joinedOrganizations[index]) {
				this.$set(this.joinedOrganizations[index], 'logoUrl', defaultLogo);
			} else if (type === 'discover' && this.discoverableOrganizations[index]) {
				this.$set(this.discoverableOrganizations[index], 'logoUrl', defaultLogo);
			}
		},
		
		/**
		 * 切换到发现组织Tab
		 */
		switchToDiscover() {
			this.currentTab = 1;
			this.loadData(true);
		},
		
		/**
		 * 显示Toast消息
		 */
		showToast(title, icon = 'none') {
			uni.showToast({
				title,
				icon
			});
		},
		
		/**
		 * 返回上一页
		 */
		goBack() {
			uni.navigateBack();
		}
	}
}
</script>

<style>
@import url("./myOrganizationsPage.css");

/* 自定义导航栏样式 */
.custom-nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #004299;
  z-index: 999;
}

.nav-bar-content {
  display: flex;
  align-items: center;
  height: 44px;
  position: relative;
}

.nav-back {
  width: 60rpx;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 12px;
  z-index: 2;
}

.back-arrow {
  font-size: 40rpx;
  font-weight: bold;
  color: #FFFFFF;
}

.nav-title {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 44px;
}

/* 内容区域调整 */
.content-area {
  min-height: 100vh;
  box-sizing: border-box;
}

/* 自定义Tab样式 */
.custom-tabs {
  display: flex;
  position: relative;
  background-color: #FFFFFF;
  height: 90rpx;
  border-bottom: 1px solid #EEEEEE;
}

.custom-tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  color: #666666;
  position: relative;
  transition: all 0.3s;
}

.custom-tab-active {
  color: #004299;
  font-weight: 600;
}

.custom-tab-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50%;
  height: 4rpx;
  background-color: #004299;
  transition: transform 0.3s;
}

/* 二维码样式升级 - 参考校友卡页面 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.qrcode-modal {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  width: 600rpx;
  padding: 40rpx 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 6rpx 30rpx rgba(0, 0, 0, 0.1);
}

.qrcode-title {
  font-size: 36rpx;
  color: #333333;
  font-weight: 600;
  text-align: center;
}

.qrcode-subtitle {
  font-size: 28rpx;
  color: #666666;
  margin-top: 4rpx;
  margin-bottom: 30rpx;
}

.qrcode-container {
  width: 440rpx;
  height: 440rpx;
  margin: 20rpx 0 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F6F6F6;
  border-radius: 8rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
}

.qrcode-image {
  width: 100%;
  height: 100%;
  background-color: #FFFFFF;
}

.qrcode-loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F5F5F5;
}

.loading-text {
  color: #666666;
  font-size: 28rpx;
}

.qrcode-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30rpx;
}

.qrcode-desc {
  font-size: 30rpx;
  color: #333333;
  font-weight: 500;
  margin-bottom: 10rpx;
}

.qrcode-tip {
  font-size: 24rpx;
  color: #999999;
}

.qrcode-buttons {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 10rpx;
}

.qrcode-btn {
  flex: 1;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8rpx;
  font-size: 30rpx;
}

.save-btn {
  background-color: #004299;
  color: #FFFFFF;
  margin-right: 20rpx;
}

.close-btn {
  background-color: #EEEEEE;
  color: #333333;
  margin-left: 20rpx;
}
</style>
