<template>
	<view class="page-container">
		<!-- 自定义导航栏 -->
		<fui-nav-bar 
			title="发现校友" 
			background="#F0F4F8" 
			color="#333333" 
			fontWeight="bold" 
			:splitLine="true" 
			:isFixed="true"
			:isOccupy="true"
			@leftClick="goBack">
			<fui-icon name="arrowleft" :color="'#333'" :size="36"></fui-icon>
			<template v-slot:right>
				<!-- 右侧可以添加其他功能图标，如有需要 -->
			</template>
		</fui-nav-bar>
		
		<!-- 内容区域 -->
		<view class="content-container">
			<!-- Tab切换区域 -->
			<view class="tab-container">
				<view class="tab-item" :class="currentTab === 'search' ? 'tab-active' : ''" @tap="switchTab('search')">
					<text class="tab-text">搜索</text>
				</view>
				<view class="tab-item" :class="currentTab === 'classmates' ? 'tab-active' : ''" @tap="switchTab('classmates')">
					<text class="tab-text">同学</text>
				</view>
			</view>
			
			<!-- 搜索分类内容 -->
			<view v-if="currentTab === 'search'">
				<!-- 筛选表单区域 -->
				<view class="filter-form">
					<!-- 姓名 -->
					<view class="form-item">
						<view class="label">姓名：</view>
						<input class="input" type="text" placeholder="选填" v-model="form.name" />
					</view>
					
					<!-- 入校类型 -->
					<view class="form-item" @tap="showPicker('schoolType')">
						<view class="label">入校类型：</view>
						<view class="value">{{ form.schoolTypeDesc || '不限' }}</view>
						<fui-icon name="right" :size="32"></fui-icon>
					</view>
					
					<!-- 入校院系 -->
					<view class="form-item" @tap="showPicker('department')">
						<view class="label">入校院系：</view>
						<view class="value">{{ form.departmentDesc || '不限年份，不限院系' }}</view>
						<fui-icon name="right" :size="32"></fui-icon>
					</view>
					
					<!-- 居住地 -->
					<view class="form-item" @tap="showPicker('residence')">
						<view class="label">居住地：</view>
						<view class="value">{{ form.residenceDesc || '选填 一级：大洲/国家/省/市/地' }}</view>
						<fui-icon name="right" :size="32"></fui-icon>
					</view>
					
					<!-- 行业 -->
					<view class="form-item" @tap="showPicker('industry')">
						<view class="label">行业：</view>
						<view class="value">{{ form.industryDesc || '不限' }}</view>
						<fui-icon name="right" :size="32"></fui-icon>
					</view>
					
					<!-- 单位 -->
					<view class="form-item">
						<view class="label">单位：</view>
						<input class="input" type="text" placeholder="选填" v-model="form.company" />
					</view>
				</view>
				
				<!-- 按距离排序 -->
				<view class="distance-sort">
					<view class="form-item">
						<view class="label">按距离排序：</view>
						<view class="value"></view>
						<view class="switch-container">
							<fui-switch 
								:checked="form.sortByDistance" 
								@change="toggleSortByDistance"
								color="#004299"
								background="#f1f1f1"
								:scaleRatio="0.9">
							</fui-switch>
						</view>
					</view>
					<view class="sort-tip" v-if="!form.sortByDistance">
						<view class="tip-content">
							<text>开启按距离排序，获取附近校友信息</text>
							<view class="enable-btn" @tap="enableLocationSort">启用</view>
						</view>
					</view>
				</view>
				
				<!-- 查找按钮 -->
				<view class="search-btn-container">
					<view class="search-btn" @tap="searchAlumni">查找</view>
				</view>
				
				<!-- 搜索结果区域 -->
				<view v-if="searchState !== 'initial'">
					<!-- 搜索中状态 -->
					<view v-if="searchState === 'loading'" style="text-align: center; padding: 40rpx 0;">
						<fui-loading type="col" text="搜索中..."></fui-loading>
					</view>
					
					<!-- 无结果状态 -->
					<view v-else-if="searchState === 'noResult'" class="search-results">
						<view class="no-result">
							<view class="no-result-icon">
								<fui-icon name="search" :size="80"></fui-icon>
							</view>
							<view class="no-result-text">未找到匹配的校友，请尝试修改筛选条件</view>
						</view>
					</view>
					
					<!-- 有结果状态 -->
					<view v-else-if="searchState === 'hasResult'" class="search-results">
						<view v-for="(item, index) in searchResults.list" :key="item.id" class="result-item">
							<image class="avatar" :src="item.avatar" mode="aspectFill"></image>
							<view class="info">
								<view class="name-row">
									<text class="name">{{item.name}}</text>
									<text v-if="form.sortByDistance" class="distance">{{item.distance}}</text>
								</view>
								<view class="detail-row">{{item.enrollYear}}级 {{item.department}}</view>
								<view class="detail-row">{{item.industry}} | {{item.company}}</view>
								<view class="detail-row">现居住地: {{item.residence}}</view>
								<view class="action-row">
									<view class="add-btn" @tap="addFriend(item.id)">添加</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 同学分类内容 -->
			<view v-else-if="currentTab === 'classmates'">
				<view class="classmates-container">
					<view class="classmates-title">我的同学</view>
					<view class="classmates-list">
						<view v-for="(item, index) in classmatesData.list" :key="item.id" class="classmate-item">
							<image class="classmate-avatar" :src="item.avatar" mode="aspectFill"></image>
							<text class="classmate-name">{{item.name}}</text>
							<text class="classmate-info">{{item.enrollYear}}级 {{item.specialty}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 底部浮动收藏图标 -->
		<view class="float-star" :class="{'star-active': isStarAnimating}" @tap="toggleFavorite">
			<fui-icon name="star" :color="isFavorite ? '#FFCC00' : '#C0C0C0'" :size="50"></fui-icon>
		</view>
		
		<!-- First UI Picker 组件 -->
		<!-- 入校类型选择器 -->
		<fui-picker 
			:options="pickerOptions.schoolType" 
			:show="pickerShow.schoolType" 
			:title="'选择入校类型'" 
			confirmColor="#004299" 
			:value="schoolTypeIndex"
			@change="onSchoolTypeChange"
			@cancel="()=>closePicker('schoolType')">
		</fui-picker>
		
		<!-- 入校院系选择器 -->
		<fui-picker 
			:layer="2" 
			:options="pickerOptions.department" 
			:show="pickerShow.department" 
			:title="'选择入校院系'" 
			confirmColor="#004299"
			:value="departmentIndex"
			@change="onDepartmentChange"
			@cancel="()=>closePicker('department')">
		</fui-picker>
		
		<!-- 居住地选择器 -->
		<fui-picker 
			:linkage="true" 
			:layer="3" 
			:options="pickerOptions.residence" 
			:show="pickerShow.residence" 
			:title="'选择居住地'"
			confirmColor="#004299"
			:value="residenceIndex"
			@change="onResidenceChange"
			@cancel="()=>closePicker('residence')"
			:fields="['text', 'value', 'children']">
		</fui-picker>
		
		<!-- 行业选择器 -->
		<fui-picker 
			:options="pickerOptions.industry" 
			:show="pickerShow.industry" 
			:title="'选择行业'" 
			confirmColor="#004299"
			:value="industryIndex"
			@change="onIndustryChange"
			@cancel="()=>closePicker('industry')">
		</fui-picker>
	</view>
</template>

<script>
	import { 
		departmentList, 
		schoolTypeList, 
		industryList, 
		searchAlumni, 
		getUserLocation, 
		saveSearchHistory, 
		mockSearchResults, 
		mockClassmatesData,
		formatSchoolTypeData,
		formatDepartmentData,
		formatResidenceData,
		formatIndustryData
	} from './discoverAlumniPage.js';
	
	export default {
		data() {
			return {
				currentTab: 'search',
				form: {
					name: '',
					schoolType: '',
					schoolTypeDesc: '',
					department: '',
					departmentDesc: '',
					year: '',
					residence: '',
					residenceDesc: '',
					industry: '',
					industryDesc: '',
					company: '',
					sortByDistance: false
				},
				isFavorite: false,
				isStarAnimating: false,
				// 搜索状态：initial(初始状态), loading(搜索中), noResult(无结果), hasResult(有结果)
				searchState: 'initial',
				searchResults: {
					total: 0,
					list: []
				},
				classmatesData: {
					total: 0,
					list: []
				},
				// picker选择器索引
				schoolTypeIndex: [0],
				departmentIndex: [0, 0],
				residenceIndex: [0, 0, 0],
				industryIndex: [0],
				// picker组件显示控制
				pickerShow: {
					schoolType: false,
					department: false,
					residence: false,
					industry: false
				},
				// 选择器数据初始化为空，将在created钩子中初始化
				pickerOptions: {
					schoolType: [],
					department: [],
					residence: [],
					industry: []
				}
			}
		},
		created() {
			// 初始化选择器数据
			this.initPickerData();
			
			// 初始化同学数据
			this.loadClassmatesData();
		},
		methods: {
			// 初始化选择器数据
			initPickerData() {
				// 格式化入校类型数据
				this.pickerOptions.schoolType = formatSchoolTypeData();
				
				// 格式化院系数据
				this.pickerOptions.department = formatDepartmentData();
				
				// 格式化居住地数据
				this.pickerOptions.residence = formatResidenceData();
				
				// 格式化行业数据
				this.pickerOptions.industry = formatIndustryData();
				
				console.log('选择器数据初始化完成', this.pickerOptions);
			},
			
			// 加载同学数据
			loadClassmatesData() {
				// 实际开发中应该从服务器获取数据
				// 这里使用模拟数据
				this.classmatesData = mockClassmatesData;
			},
			
			// 添加好友
			addFriend(id) {
				uni.showToast({
					title: '已发送好友申请',
					icon: 'success'
				});
			},
			
			// 页面导航
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			
			// 切换Tab
			switchTab(tab) {
				if (this.currentTab === tab) return;
				
				this.currentTab = tab;
				
				// 重置搜索状态
				if (tab === 'search') {
					this.searchState = 'initial';
				}
				// 如果切换到"同学"分类，确保数据已加载
				else if (tab === 'classmates') {
					if (this.classmatesData.list.length === 0) {
						this.loadClassmatesData();
					}
				}
			},
			
			// 显示选择器
			showPicker(type) {
				this.pickerShow[type] = true;
				console.log(`显示${type}选择器`);
			},
			
			// 关闭选择器
			closePicker(type) {
				this.pickerShow[type] = false;
				console.log(`关闭${type}选择器`);
			},
			
			// 入校类型选择回调
			onSchoolTypeChange(e) {
				console.log('选择入校类型', e);
				this.closePicker('schoolType');
				
				// 检查并输出原始数据结构，帮助调试
				console.log('入校类型选择回调数据:', JSON.stringify(e));
				
				if (e && e.index && Array.isArray(e.index)) {
					// 获取索引
					const index = e.index[0] || 0;
					
					// 从选项列表中获取对应的选项
					const selected = schoolTypeList[index];
					
					if (selected) {
						// 更新表单
						this.form.schoolType = selected.code;
						this.form.schoolTypeDesc = selected.name;
						this.schoolTypeIndex = e.index;
						console.log('已选择入校类型:', selected.name, selected.code);
					}
				}
			},
			
			// 入校院系选择回调
			onDepartmentChange(e) {
				console.log('选择入校院系', e);
				this.closePicker('department');
				
				if (e && e.text && e.text.length >= 2) {
					const year = e.text[0];
					const dept = e.text[1];
					
					let desc = '';
					if(year === '全部' && dept === '全部') {
						desc = '不限年份，不限院系';
					} else if(year === '全部') {
						desc = `不限年份，${dept}`;
					} else if(dept === '全部') {
						desc = `${year}年，不限院系`;
					} else {
						desc = `${year}年，${dept}`;
					}
					
					this.form.year = year === '全部' ? '' : year;
					this.form.department = dept === '全部' ? '' : dept;
					this.form.departmentDesc = desc;
					this.departmentIndex = e.index;
				}
			},
			
			// 居住地选择回调
			onResidenceChange(e) {
				console.log('选择居住地', e);
				this.closePicker('residence');
				
				if (e && e.text && e.value) {
					// 处理联动选择
					const path = e.text.join(',');
					const codes = e.value.join(',');
					
					this.form.residence = codes;
					this.form.residenceDesc = path;
					this.residenceIndex = e.index;
				}
			},
			
			// 行业选择回调
			onIndustryChange(e) {
				console.log('选择行业', e);
				this.closePicker('industry');
				
				// 检查并输出原始数据结构，帮助调试
				console.log('行业选择回调数据:', JSON.stringify(e));
				
				if (e && e.index && Array.isArray(e.index)) {
					// 获取索引
					const index = e.index[0] || 0;
					
					// 从选项列表中获取对应的选项
					const selected = industryList[index];
					
					if (selected) {
						// 更新表单
						this.form.industry = selected.code;
						this.form.industryDesc = selected.name;
						this.industryIndex = e.index;
						console.log('已选择行业:', selected.name, selected.code);
					}
				}
			},
			
			// 切换距离排序
			toggleSortByDistance(e) {
				this.form.sortByDistance = e.detail.value;
				if (this.form.sortByDistance) {
					this.requestLocationPermission();
				}
			},
			
			// 启用位置排序
			enableLocationSort() {
				this.form.sortByDistance = true;
				this.requestLocationPermission();
			},
			
			// 请求位置权限
			requestLocationPermission() {
				getUserLocation()
					.then(location => {
						console.log('位置信息获取成功', location);
						// 存储位置信息
						this.form.latitude = location.latitude;
						this.form.longitude = location.longitude;
					})
					.catch(err => {
						console.error('位置信息获取失败', err);
						this.form.sortByDistance = false;
						uni.showToast({
							title: '获取位置信息失败，无法按距离排序',
							icon: 'none'
						});
					});
			},
			
			// 搜索校友
			searchAlumni() {
				console.log('搜索条件:', this.form);
				// 保存搜索历史
				saveSearchHistory(this.form);
				
				// 设置搜索状态为加载中
				this.searchState = 'loading';
				
				// 调用搜索API
				searchAlumni(this.form)
					.then(res => {
						// 处理搜索结果
						console.log('搜索结果:', res);
						
						// 模拟延迟，实际开发中不需要
						setTimeout(() => {
							// 使用模拟数据
							this.searchResults = mockSearchResults;
							
							// 根据结果数量设置状态
							if (this.searchResults.total > 0) {
								this.searchState = 'hasResult';
							} else {
								this.searchState = 'noResult';
							}
						}, 1000);
					})
					.catch(err => {
						console.error('搜索失败', err);
						this.searchState = 'noResult';
						uni.showToast({
							title: '搜索失败，请重试',
							icon: 'none'
						});
					});
			},
			
			// 切换收藏状态
			toggleFavorite() {
				this.isFavorite = !this.isFavorite;
				
				// 添加动画效果
				this.isStarAnimating = true;
				setTimeout(() => {
					this.isStarAnimating = false;
				}, 300);
				
				uni.showToast({
					title: this.isFavorite ? '已收藏' : '取消收藏',
					icon: 'none'
				});
			}
		}
	}
</script>

<style>
	@import url("./discoverAlumniPage.css");
</style>
