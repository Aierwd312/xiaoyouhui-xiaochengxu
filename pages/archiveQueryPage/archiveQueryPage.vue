<template>
	<view class="page-container">
		<!-- 自定义导航栏 -->
		<fui-nav-bar
			title="档案查询申请"
			:background="navBackground"
			:color="navTitleColor"
			fontWeight="bold"
			:splitLine="true"
			:isFixed="true"
			:isOccupy="false"
			@init="navbarInit"
			@leftClick="goBack">
			<fui-icon name="arrowleft" :color="navTitleColor" :size="36"></fui-icon>
		</fui-nav-bar>
		<!-- 内容区域 -->
		<view class="content-container" :style="{ paddingTop: navHeight + 'px' }">
			<!-- 顶部装饰区域 -->
			<view class="header-decoration">
				<view class="decoration-content">
					<image src="/static/archive-line.svg" class="decoration-icon" mode="aspectFit"></image>
					<view class="decoration-text">
						<text class="decoration-title">档案材料申请</text>
						<text class="decoration-subtitle">快速申请您需要的档案材料</text>
					</view>
				</view>
				<image src="/static/school-badge.svg" class="school-badge" mode="aspectFit"></image>
			</view>
			
			<!-- 顶部操作区 -->
			<view class="action-bar">
				<fui-button 
					type="primary" 
					:background="primaryColor" 
					@click="showApplicationForm"
					class="add-button">
					<fui-icon name="add" color="#FFFFFF" :size="32"></fui-icon>
					<text class="add-text">新增申请</text>
				</fui-button>
			</view>
			
			<!-- 申请列表区域 -->
			<view class="application-list">
				<!-- 列表标题 -->
				<view class="list-header">
					<text class="header-title">我的申请</text>
					<text class="header-count">共 {{applications.length}} 条</text>
				</view>
				
				<!-- 加载提示 -->
				<view v-if="isLoading" class="empty-records">
					<fui-loadmore text="加载中..." iconColor="#004299"></fui-loadmore>
				</view>
				
				<!-- 无记录提示 -->
				<view v-else-if="applications.length === 0" class="empty-records">
					<fui-icon name="file-search-line" :size="80" color="#CCCCCC"></fui-icon>
					<text class="empty-text">暂无申请记录</text>
					<text class="empty-hint">点击上方"新增申请"按钮创建档案查询申请</text>
				</view>
				
				<!-- 申请记录列表 -->
				<view v-else class="application-cards">
					<view class="app-card" v-for="(app, index) in applications" :key="app.id">
						<!-- 卡片头部 -->
						<view class="card-header">
							<view class="card-title-area">
								<text class="card-title">{{app.title}}</text>
								<view class="card-status" :class="'status-' + app.status">
									{{app.statusText}}
								</view>
							</view>
							<view class="card-time">{{app.createTime}}</view>
						</view>
						
						<!-- 卡片内容 -->
						<view class="card-body">
							<view class="card-row">
								<text class="row-label">申请材料：</text>
								<text class="row-value">{{app.applicationFile}}</text>
							</view>
							<view class="card-row">
								<text class="row-label">申请原因：</text>
								<text class="row-value">{{app.applicationReason}}</text>
							</view>
							<view class="card-row" v-if="app.address">
								<text class="row-label">邮寄地址：</text>
								<text class="row-value">{{app.address}}</text>
							</view>
							<view class="card-row" v-if="app.reviewerName">
								<text class="row-label">审核人：</text>
								<text class="row-value">{{app.reviewerName}}</text>
							</view>
							<view class="card-row" v-if="app.reviewComments">
								<text class="row-label" :class="{'error-label': app.status === 'rejected'}">审核意见：</text>
								<text class="row-value" :class="{'error-text': app.status === 'rejected'}">{{app.reviewComments}}</text>
							</view>
						</view>
						
						<!-- 操作按钮 -->
						<view class="card-actions">
							<!-- 待审核状态：编辑、撤回、删除 -->
							<template v-if="app.status === 'pending'">
								<view 
									class="mini-btn edit-btn" 
									@click="editApplication(app)">
									编辑
								</view>
								<view 
									class="mini-btn withdraw-btn" 
									@click="withdrawApplication(app.id)">
									撤回
								</view>
								<view 
									class="mini-btn delete-btn" 
									@click="deleteApplication(app.id)">
									删除
								</view>
							</template>
							
							<!-- 已完成状态：下载 -->
							<template v-if="app.status === 'completed'">
								<view 
									class="mini-btn download-btn" 
									@click="downloadResult(app.id)">
									下载结果
								</view>
							</template>
							
							<!-- 已拒绝状态：删除 -->
							<template v-if="app.status === 'rejected'">
								<view 
									class="mini-btn delete-btn" 
									@click="deleteApplication(app.id)">
									删除
								</view>
							</template>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 安全区域 -->
			<view class="safe-area-bottom"></view>
		</view>
		<!-- 申请表单弹窗 -->
		<fui-bottom-popup 
			:show="showFormPopup" 
			@close="closeFormPopup"
			height="75%">
			<view class="form-popup">
				<view class="popup-title">{{ formMode === 'edit' ? '编辑' : '新增' }}档案申请</view>
				
				<scroll-view scroll-y class="form-scroll">
					<fui-form>
						<fui-form-item label="申请标题" required asterisk>
							<fui-input 
								v-model="formData.title" 
								placeholder="请输入申请标题">
							</fui-input>
						</fui-form-item>
						
						<fui-form-item label="申请材料" required asterisk>
							<fui-input 
								v-model="formData.applicationFile" 
								placeholder="请输入申请材料名称（如：成绩单）">
							</fui-input>
						</fui-form-item>
						
						<fui-form-item label="申请原因" required asterisk>
							<fui-textarea 
								v-model="formData.applicationReason" 
								placeholder="请输入申请原因" 
								:maxlength="200">
							</fui-textarea>
						</fui-form-item>
						
						<fui-form-item label="接收方式" required asterisk>
							<fui-input 
								v-model="formData.sendTypeText" 
								placeholder="请选择接收方式" 
								@click="showSendTypePicker" 
								readonly 
								rightIcon="right">
							</fui-input>
						</fui-form-item>
						
						<fui-form-item v-if="formData.sendType === '0' || formData.sendType === '2'" label="电子邮箱" required asterisk>
							<fui-input 
								v-model="formData.email" 
								placeholder="请输入电子邮箱"
								type="email">
							</fui-input>
						</fui-form-item>
						
						<fui-form-item v-if="formData.sendType === '1' || formData.sendType === '2'" label="邮寄地址">
							<fui-textarea 
								v-model="formData.address" 
								placeholder="请输入邮寄地址" 
								:maxlength="100">
							</fui-textarea>
						</fui-form-item>
						
						<fui-form-item label="联系电话" required asterisk>
							<fui-input 
								v-model="formData.phone" 
								placeholder="请输入联系电话"
								type="number">
							</fui-input>
						</fui-form-item>
						
						<fui-form-item label="备注">
							<fui-textarea 
								v-model="formData.remark" 
								placeholder="请输入备注信息（选填）" 
								:maxlength="200">
							</fui-textarea>
						</fui-form-item>
					</fui-form>
				</scroll-view>
				
				<view class="popup-footer">
					<fui-button 
					type="default" 
					@click="closeFormPopup"
					class="footer-btn cancel-btn"
					background="#E8E8E8"
					color="#333333">
					取消
				</fui-button>
					<fui-button 
						type="primary" 
						:background="primaryColor"
						@click="submitForm"
						:loading="isSubmitting"
						class="footer-btn">
						{{ formMode === 'edit' ? '保存' : '提交' }}
					</fui-button>
				</view>
			</view>
		</fui-bottom-popup>
		
		<!-- 选择器组件 -->
		<fui-picker 
			:show="pickerConfig.show" 
			:options="pickerConfig.options" 
			:zIndex="1100"
			@change="onPickerConfirm" 
			@cancel="closePicker">
		</fui-picker>
		
	</view>
</template>

<script>
	import archiveQueryPageJs from './archiveQueryPage.js'
	import { ref } from 'vue';
	
	export default {
		mixins: [archiveQueryPageJs],
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
		}
	}
</script>

<style>
	@import './archiveQueryPage.css';
</style>
