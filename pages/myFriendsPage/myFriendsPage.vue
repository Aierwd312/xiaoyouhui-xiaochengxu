<template>
	<view class="page-container">
		<!-- 自定义导航栏 -->
		<fui-nav-bar 
			title="我的好友" 
			background="#004299" 
			color="#FFFFFF" 
			fontWeight="bold" 
			:splitLine="true" 
			:isFixed="true"
			:isOccupy="true"
			@leftClick="goBack">
			<fui-icon name="arrowleft" :color="'#FFFFFF'" :size="36"></fui-icon>
			<template v-slot:right>
				<view class="nav-right">
					<!-- 只保留设置图标 -->
					<view @tap="openManage">
						<fui-icon name="settings-3" :color="'#FFFFFF'" :size="36"></fui-icon>
					</view>
				</view>
			</template>
		</fui-nav-bar>
		
		<!-- 内容区域 -->
		<view class="content-container">
			<!-- 页面Tab切换 -->
			<view class="tab-container">
				<view class="tab-item" :class="currentTab === 'friends' ? 'tab-active' : ''" @tap="switchTab('friends')">
					<text class="tab-text">好友列表</text>
				</view>
				<!-- 只保留一个徽章 -->
				<view class="tab-item" :class="currentTab === 'requests' ? 'tab-active' : ''" @tap="switchTab('requests')">
					<text class="tab-text">验证信息</text>
					<view class="tab-badge" v-if="pendingRequestsCount > 0">{{pendingRequestsCount}}</view>
				</view>
			</view>
			
			<!-- 好友列表内容 -->
			<block v-if="currentTab === 'friends'">
				<!-- 搜索区域 -->
				<view class="search-container">
					<view class="search-box">
						<fui-icon name="search" :color="'#999'" :size="36"></fui-icon>
						<input 
							class="search-input" 
							type="text" 
							placeholder="搜索已添加的好友姓名" 
							v-model="searchText"
							@input="searchFriends"
						/>
						<fui-icon v-if="searchText" name="clear" :color="'#999'" :size="36" @tap="clearSearch"></fui-icon>
					</view>
				</view>
				
				<!-- 分类入口区和好友列表区整合 -->
				<view class="category-container" v-if="!isSearchMode">
					<view class="category-card">
						<view v-for="(category, index) in categories" :key="index" class="category-section">
							<!-- 分类标题栏 -->
							<view class="category-item" :class="{'active': expandedCategory === category.code}" @tap="toggleCategory(category)">
								<view class="category-left">
									<fui-icon :name="category.icon" :color="category.color" :size="40"></fui-icon>
									<text class="category-name">{{category.name}}</text>
								</view>
								<view class="category-right">
									<text class="category-count">{{category.count}}</text>
									<!-- 根据展开状态改变箭头方向 -->
									<view class="rotate-icon" :class="{'down': expandedCategory === category.code}">
										<fui-icon name="right" :color="'#999'" :size="32"></fui-icon>
									</view>
								</view>
							</view>
							
							<!-- 该分类下的好友列表 -->
							<view class="category-friends" v-if="expandedCategory === category.code">
								<view class="friends-list">
									<view v-if="getCategoryFriends(category.code).length === 0" class="no-friends">
										<text class="no-friends-text">该分类下暂无好友</text>
									</view>
									<view v-else v-for="(friend, friendIndex) in getCategoryFriends(category.code)" 
										:key="friend.id" class="friend-item" 
										@tap="viewFriendDetail(friend)" 
										@longpress="showActionMenu(friend)">
										<image class="friend-avatar" :src="friend.avatar" mode="aspectFill"></image>
										<view class="friend-info">
											<view class="friend-name-row">
												<text class="friend-name">{{friend.name}}</text>
												<text v-if="friend.remark" class="friend-remark">({{friend.remark}})</text>
											</view>
											<view class="friend-detail">{{friend.department}} | {{friend.enrollYear}}级</view>
											<view class="friend-major" v-if="friend.major">{{friend.major}}</view>
										</view>
										<view class="friend-contact" @tap.stop="showContactInfo(friend)">
											<fui-icon name="contacts" :color="'#2A6DCF'" :size="40"></fui-icon>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 搜索结果好友列表区域 -->
				<view class="friends-container search-results" v-if="isSearchMode && currentFriends.length > 0">
					<view class="list-header">
						<text class="list-title">搜索结果</text>
						<text class="list-count">共{{currentFriends.length}}人</text>
					</view>
					<view class="friends-list">
						<view v-for="(friend, index) in currentFriends" :key="friend.id" 
							class="friend-item" @tap="viewFriendDetail(friend)" @longpress="showActionMenu(friend)">
							<image class="friend-avatar" :src="friend.avatar" mode="aspectFill"></image>
							<view class="friend-info">
								<view class="friend-name-row">
									<text class="friend-name">{{friend.name}}</text>
									<text v-if="friend.remark" class="friend-remark">({{friend.remark}})</text>
								</view>
								<view class="friend-detail">{{friend.department}} | {{friend.enrollYear}}级</view>
								<view class="friend-major" v-if="friend.major">{{friend.major}}</view>
							</view>
							<view class="friend-contact" @tap.stop="showContactInfo(friend)">
								<fui-icon name="contacts" :color="'#2A6DCF'" :size="40"></fui-icon>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 没有搜索结果时的提示 -->
				<view class="empty-container" v-if="isSearchMode && currentFriends.length === 0">
					<view class="empty-content">
						<fui-icon name="search" :color="'#cccccc'" :size="80"></fui-icon>
						<text class="empty-text">未找到匹配的好友</text>
					</view>
				</view>
				
				<!-- 空状态提示 -->
				<view class="empty-container" v-if="showEmpty">
					<view class="empty-content">
						<fui-icon name="user-search" :color="'#cccccc'" :size="100"></fui-icon>
						<text class="empty-text">您还没有添加好友，请前往'发现校友'页面添加</text>
						<view class="empty-btn" @tap="navigateToDiscover">去发现校友</view>
					</view>
				</view>
			</block>
			
			<!-- 好友验证信息内容 -->
			<block v-if="currentTab === 'requests'">
				<view class="requests-container">
					<!-- 调整验证信息标题与清空按钮样式 -->
					<view class="requests-header" v-if="friendRequests.length > 0">
						<text class="requests-title">验证消息 ({{friendRequests.length}})</text>
						<view class="clear-btn" @tap="clearFriendRequests">清空验证信息</view>
					</view>
					
					<view v-if="friendRequests.length === 0" class="empty-container">
						<view class="empty-content">
							<fui-icon name="mail" :color="'#cccccc'" :size="80"></fui-icon>
							<text class="empty-text">暂无好友验证信息</text>
						</view>
					</view>
					
					<view v-else>
						<view class="request-card" v-for="(request, index) in friendRequests" :key="request.id">
							<view class="request-header">
								<image class="request-avatar" :src="request.avatar" mode="aspectFill"></image>
								<view class="request-info">
									<view class="request-name-row">
										<text class="request-name">{{request.name}}</text>
										<text class="request-status" :class="'status-' + request.status">
											{{getStatusText(request.status)}}
										</text>
									</view>
									<view class="request-detail">{{request.department}} | {{request.enrollYear}}级 | {{request.major}}</view>
								</view>
							</view>
							
							<view class="request-message">
								<text class="message-label">验证信息：</text>
								<text class="message-content">{{request.message}}</text>
							</view>
							
							<view class="request-time">{{request.time}}</view>
							
							<view class="request-actions" v-if="request.status === 'pending'">
								<view class="action-btn btn-agree" @tap="handleRequest(request.id, 'accept')">同意</view>
								<view class="action-btn btn-reject" @tap="handleRequest(request.id, 'reject')">拒绝</view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>
		
		<!-- 联系方式弹窗 -->
		<fui-bottom-popup :show="showContactPopup" @close="closeContactPopup">
			<view class="contact-popup">
				<view class="contact-header">
					<text class="contact-title">联系方式</text>
					<fui-icon name="close" :size="32" :color="'#333'" @tap="closeContactPopup"></fui-icon>
				</view>
				<view class="contact-content">
					<view class="contact-info">
						<view class="contact-item" v-if="currentContact.phone">
							<view class="contact-item-left">
								<fui-icon name="phone" :color="'#2A6DCF'" :size="40"></fui-icon>
								<text class="contact-label">手机号：</text>
							</view>
							<text class="contact-value">{{currentContact.phone}}</text>
							<view class="contact-action" @tap="handlePhone(currentContact.phone)">
								<fui-icon name="phone-fill" :color="'#4CAF50'" :size="40"></fui-icon>
							</view>
						</view>
						<view class="contact-item" v-if="currentContact.wechat">
							<view class="contact-item-left">
								<fui-icon name="wechat" :color="'#2A6DCF'" :size="40"></fui-icon>
								<text class="contact-label">微信号：</text>
							</view>
							<text class="contact-value">{{currentContact.wechat}}</text>
							<view class="contact-action" @tap="copyWechat(currentContact.wechat)">
								<fui-icon name="copy" :color="'#4CAF50'" :size="40"></fui-icon>
							</view>
						</view>
						<view class="contact-item" v-if="currentContact.qq">
							<view class="contact-item-left">
								<fui-icon name="qq" :color="'#2A6DCF'" :size="40"></fui-icon>
								<text class="contact-label">QQ号：</text>
							</view>
							<text class="contact-value">{{currentContact.qq}}</text>
							<view class="contact-action" @tap="copyQQ(currentContact.qq)">
								<fui-icon name="copy" :color="'#4CAF50'" :size="40"></fui-icon>
							</view>
						</view>
						<view class="contact-item" v-if="currentContact.email">
							<view class="contact-item-left">
								<fui-icon name="mail" :color="'#2A6DCF'" :size="40"></fui-icon>
								<text class="contact-label">邮箱：</text>
							</view>
							<text class="contact-value">{{currentContact.email}}</text>
							<view class="contact-action" @tap="copyEmail(currentContact.email)">
								<fui-icon name="copy" :color="'#4CAF50'" :size="40"></fui-icon>
							</view>
						</view>
					</view>
					<view class="contact-privacy">
						<text class="privacy-text">联系方式仅对互为好友的用户可见</text>
						<text class="privacy-text">请尊重他人隐私，勿随意传播联系信息</text>
					</view>
				</view>
			</view>
		</fui-bottom-popup>
		
		<!-- 操作菜单 -->
		<fui-actionsheet :show="showActionSheet" :itemList="actionOptions"
			@click="handleActionClick" @cancel="closeActionSheet"></fui-actionsheet>
			
		<!-- 确认对话框 -->
		<fui-dialog :show="showConfirmDialog" title="删除好友" content="确定删除该好友吗？删除后将无法查看对方联系方式" 
			@cancel="closeConfirmDialog" @confirm="confirmDelete"></fui-dialog>
	</view>
</template>

<script>
	import { 
		getMyFriends, 
		getFriendCategories, 
		deleteFriend, 
		moveFriendToCategory,
		getFriendRequests,
		handleFriendRequest,
		clearFriendRequests
	} from './myFriendsPage.js';
	
	export default {
		data() {
			return {
				// 页面Tab
				currentTab: 'friends',
				
				// 搜索相关
				searchText: '',
				isSearchMode: false,
				
				// 分类相关
				categories: [],
				selectedCategory: null,
				expandedCategory: null,
				
				// 好友列表
				allFriends: [],
				currentFriends: [],
				
				// 好友申请
				friendRequests: [],
				
				// 联系方式弹窗
				showContactPopup: false,
				currentContact: {},
				
				// 操作菜单相关
				showActionSheet: false,
				actionOptions: [
					{text: '设置备注', color: '#333333'},
					{text: '移动至其他分组', color: '#333333'},
					{text: '删除好友', color: '#FF0000'}
				],
				currentFriend: null,
				
				// 确认对话框
				showConfirmDialog: false
			}
		},
		computed: {
			showEmpty() {
				return this.allFriends.length === 0 && !this.isSearchMode && this.currentTab === 'friends';
			},
			pendingRequestsCount() {
				return this.friendRequests.filter(req => req.status === 'pending').length;
			}
		},
		onLoad() {
			this.loadCategories();
			this.loadFriends();
			this.loadFriendRequests();
		},
		methods: {
			// 切换Tab
			switchTab(tab) {
				if (this.currentTab === tab) return;
				this.currentTab = tab;
				this.expandedCategory = null;
				this.searchText = '';
				this.isSearchMode = false;
			},
			
			// 加载好友申请
			loadFriendRequests() {
				getFriendRequests().then(res => {
					this.friendRequests = res;
				}).catch(err => {
					console.error('获取好友申请失败', err);
					uni.showToast({
						title: '获取好友申请失败',
						icon: 'none'
					});
				});
			},
			
			// 处理好友申请
			handleRequest(requestId, action) {
				uni.showLoading({
					title: action === 'accept' ? '正在接受...' : '正在拒绝...'
				});
				
				handleFriendRequest(requestId, action).then(res => {
					if (res.success) {
						// 更新本地状态
						const index = this.friendRequests.findIndex(req => req.id === requestId);
						if (index !== -1) {
							this.friendRequests[index].status = res.status;
						}
						
						// 如果接受了好友请求，需要重新加载好友列表
						if (action === 'accept') {
							this.loadFriends();
						}
						
						uni.showToast({
							title: action === 'accept' ? '已同意' : '已拒绝',
							icon: 'success'
						});
					} else {
						uni.showToast({
							title: '操作失败，请重试',
							icon: 'none'
						});
					}
				}).catch(err => {
					console.error('处理好友申请失败', err);
					uni.showToast({
						title: '操作失败，请重试',
						icon: 'none'
					});
				}).finally(() => {
					uni.hideLoading();
				});
			},
			
			// 获取状态文本
			getStatusText(status) {
				switch(status) {
					case 'pending': return '等待验证';
					case 'accepted': return '已同意';
					case 'rejected': return '已拒绝';
					default: return '';
				}
			},
			
			// 导航相关
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			openManage() {
				uni.showToast({
					title: '分组管理功能开发中',
					icon: 'none'
				});
				// 实际开发中跳转到管理页面
				// uni.navigateTo({
				//   url: '/pages/friendManagePage/friendManagePage'
				// });
			},
			navigateToDiscover() {
				uni.navigateTo({
					url: '/pages/discoverAlumniPage/discoverAlumniPage'
				});
			},
			
			// 数据加载
			loadCategories() {
				getFriendCategories().then(res => {
					this.categories = res;
					// 默认选中"全部好友"
					this.selectedCategory = this.categories.find(item => item.code === 'all');
				}).catch(err => {
					console.error('获取好友分类失败', err);
					uni.showToast({
						title: '获取好友分类失败',
						icon: 'none'
					});
				});
			},
			loadFriends() {
				getMyFriends().then(res => {
					this.allFriends = res;
					this.filterFriends();
				}).catch(err => {
					console.error('获取好友列表失败', err);
					uni.showToast({
						title: '获取好友列表失败',
						icon: 'none'
					});
				});
			},
			
			// 分类与筛选
			toggleCategory(category) {
				// 如果点击已展开的分类，则折叠
				if (this.expandedCategory === category.code) {
					this.expandedCategory = null;
				} else {
					// 否则展开当前分类，折叠其他分类
					this.expandedCategory = category.code;
				}
				this.selectedCategory = category;
			},
			
			// 获取指定分类下的好友
			getCategoryFriends(categoryCode) {
				return this.allFriends.filter(
					friend => friend.categories && friend.categories.includes(categoryCode)
				);
			},
			
			// 搜索功能
			searchFriends() {
				if (!this.searchText.trim()) {
					this.isSearchMode = false;
					return;
				}
				
				this.isSearchMode = true;
				// 搜索时关闭所有展开的分类
				this.expandedCategory = null;
				
				const keyword = this.searchText.toLowerCase().trim();
				this.currentFriends = this.allFriends.filter(friend => {
					return friend.name.toLowerCase().includes(keyword) || 
						   (friend.department && friend.department.toLowerCase().includes(keyword)) ||
						   (friend.remark && friend.remark.toLowerCase().includes(keyword)) ||
						   (friend.enrollYear && friend.enrollYear.toString().includes(keyword));
				});
			},
			clearSearch() {
				this.searchText = '';
				this.isSearchMode = false;
			},
			
			// 好友操作
			viewFriendDetail(friend) {
				// 查看好友详情，可以跳转到详情页面
				uni.showToast({
					title: '好友详情功能开发中',
					icon: 'none'
				});
				// 实际开发中跳转到好友详情页
				// uni.navigateTo({
				//   url: `/pages/friendDetailPage/friendDetailPage?id=${friend.id}`
				// });
			},
			showContactInfo(friend) {
				// 显示联系方式
				this.currentContact = {
					phone: friend.phone || '',
					wechat: friend.wechat || '',
					qq: friend.qq || '',
					email: friend.email || ''
				};
				this.showContactPopup = true;
			},
			closeContactPopup() {
				this.showContactPopup = false;
			},
			
			// 联系方式操作
			handlePhone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone,
					fail: () => {
						uni.showToast({
							title: '拨打电话失败',
							icon: 'none'
						});
					}
				});
			},
			copyWechat(wechat) {
				uni.setClipboardData({
					data: wechat,
					success: () => {
						uni.showModal({
							title: '微信号已复制',
							content: '是否打开微信？',
							success: (res) => {
								if (res.confirm) {
									// 尝试打开微信
									plus.runtime.openURL('weixin://');
								}
							}
						});
					}
				});
			},
			copyQQ(qq) {
				uni.setClipboardData({
					data: qq,
					success: () => {
						uni.showToast({
							title: 'QQ号已复制',
							icon: 'success'
						});
					}
				});
			},
			copyEmail(email) {
				uni.setClipboardData({
					data: email,
					success: () => {
						uni.showToast({
							title: '邮箱已复制',
							icon: 'success'
						});
					}
				});
			},
			
			// 操作菜单
			showActionMenu(friend) {
				this.currentFriend = friend;
				this.showActionSheet = true;
			},
			closeActionSheet() {
				this.showActionSheet = false;
			},
			handleActionClick(e) {
				const index = e.index;
				if (index === 0) {
					// 设置备注
					uni.showToast({
						title: '设置备注功能开发中',
						icon: 'none'
					});
				} else if (index === 1) {
					// 移动至其他分组
					uni.showToast({
						title: '移动分组功能开发中',
						icon: 'none'
					});
				} else if (index === 2) {
					// 删除好友
					this.showConfirmDialog = true;
				}
				this.closeActionSheet();
			},
			
			// 确认对话框
			closeConfirmDialog() {
				this.showConfirmDialog = false;
			},
			confirmDelete() {
				if (!this.currentFriend) {
					this.closeConfirmDialog();
					return;
				}
				
				deleteFriend(this.currentFriend.id).then(() => {
					// 删除成功后刷新列表
					this.allFriends = this.allFriends.filter(f => f.id !== this.currentFriend.id);
					this.filterFriends();
					uni.showToast({
						title: '删除成功',
						icon: 'success'
					});
				}).catch(err => {
					console.error('删除好友失败', err);
					uni.showToast({
						title: '删除好友失败',
						icon: 'none'
					});
				}).finally(() => {
					this.closeConfirmDialog();
				});
			},
			
			// 清空好友验证信息
			clearFriendRequests() {
				uni.showModal({
					title: '确认清空',
					content: '确定要清空所有验证信息吗？',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '正在清空...'
							});
							
							clearFriendRequests().then(res => {
								if (res.success) {
									this.friendRequests = [];
									uni.showToast({
										title: '已清空验证信息',
										icon: 'success'
									});
								} else {
									uni.showToast({
										title: '清空失败，请重试',
										icon: 'none'
									});
								}
							}).catch(err => {
								console.error('清空验证信息失败', err);
								uni.showToast({
									title: '清空失败，请重试',
									icon: 'none'
								});
							}).finally(() => {
								uni.hideLoading();
							});
						}
					}
				});
			}
		}
	}
</script>

<style>
	@import url("./myFriendsPage.css");
</style>
