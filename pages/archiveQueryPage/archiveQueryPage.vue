<template>
	<view class="page-container">
		<!-- 自定义导航栏 -->
		<fui-nav-bar
			title="档案查询"
			:background="navBackground"
			:color="navTitleColor"
			fontWeight="bold"
			:splitLine="true"
			:isFixed="true"
			:isOccupy="true"
			@init="navbarInit"
			@leftClick="goBack">
			<fui-icon name="arrowleft" :color="navTitleColor" :size="36"></fui-icon>
		</fui-nav-bar>
		
		<!-- 内容区域 -->
		<view class="content-container" :style="{ paddingTop: navHeight + 'px' }">
			<!-- 档案类型选择区 -->
			<view class="section-container archive-types-section">
				<view class="section-title">
					<text class="title-text">选择查询类型</text>
				</view>
				<view class="archive-types-grid">
					<fui-grid :columns="3" :showBorder="false">
						<fui-grid-item v-for="(item, index) in archiveTypes" :key="index" @click="selectArchiveType(item)">
							<view class="grid-item-box" :class="{'active': selectedType === item.type}">
								<fui-icon :name="item.icon" :color="item.color" :size="48"></fui-icon>
								<text class="grid-text">{{item.name}}</text>
							</view>
						</fui-grid-item>
					</fui-grid>
				</view>
			</view>
			
			<!-- 申请表单区域 - 仅在选择档案类型后显示 -->
			<view class="section-container form-section" v-if="selectedType">
				<view class="section-title">
					<text class="title-text">填写申请信息</text>
				</view>
				
				<fui-form>
					<!-- 基本信息 - 自动填充 -->
					<fui-form-item label="姓名" required asterisk>
						<fui-input :disabled="true" v-model="formData.name" placeholder="已自动填充"></fui-input>
					</fui-form-item>
					
					<fui-form-item label="学号" required asterisk>
						<fui-input :disabled="true" v-model="formData.studentId" placeholder="已自动填充"></fui-input>
					</fui-form-item>
					
					<fui-form-item label="入学年份" required asterisk>
						<fui-input :disabled="true" v-model="formData.enrollmentYear" placeholder="已自动填充"></fui-input>
					</fui-form-item>
					
					<fui-form-item label="所属院系" required asterisk>
						<fui-input :disabled="true" v-model="formData.department" placeholder="已自动填充"></fui-input>
					</fui-form-item>
					
					<!-- 根据档案类型显示不同的表单字段 -->
					<block v-if="selectedType === 'transcript'">
						<fui-form-item label="查询学期" required asterisk>
							<fui-input 
								v-model="formData.semesterText" 
								placeholder="请选择需查询的学期" 
								@tap="showSemesterPicker" 
								:disabled="true" 
								rightIcon="right">
							</fui-input>
						</fui-form-item>
					</block>
					
					<fui-form-item label="用途说明" required asterisk>
						<fui-input 
							v-model="formData.purposeText" 
							placeholder="请选择申请用途" 
							@tap="showPurposePicker" 
							:disabled="true" 
							rightIcon="right">
						</fui-input>
					</fui-form-item>
					
					<fui-form-item label="接收方式" required asterisk>
						<fui-input 
							v-model="formData.receiveMethodText" 
							placeholder="请选择结果接收方式" 
							@tap="showReceiveMethodPicker" 
							:disabled="true" 
							rightIcon="right">
						</fui-input>
					</fui-form-item>
					
					<!-- 如果选择了纸质档，显示地址输入框 -->
					<fui-form-item v-if="formData.receiveMethod === 'paper' || formData.receiveMethod === 'both'" label="邮寄地址" required asterisk>
						<fui-textarea 
							v-model="formData.address" 
							placeholder="请输入接收纸质材料的地址" 
							:maxlength="100">
						</fui-textarea>
					</fui-form-item>
					
					<fui-form-item label="联系电话" required asterisk>
						<fui-input 
							v-model="formData.phone" 
							placeholder="请输入接收结果的联系电话"
							type="number">
						</fui-input>
					</fui-form-item>
					
					<fui-form-item label="其他说明">
						<fui-textarea 
							v-model="formData.remarks" 
							placeholder="请输入其他需说明的信息（选填）" 
							:maxlength="200">
						</fui-textarea>
					</fui-form-item>
				</fui-form>
				
				<!-- 提交按钮 -->
				<view class="submit-button-container">
					<fui-button type="primary" :background="primaryColor" @click="submitForm" :loading="isLoading" :disabled="isLoading" class="submit-button">提交申请</fui-button>
					<text class="submit-tip">申请提交后将在1-3个工作日内处理，结果将通过系统消息通知您</text>
				</view>
			</view>
			
			<!-- 历史查询记录区 -->
			<view class="section-container history-section">
				<view class="section-title" @tap="toggleHistory">
					<text class="title-text">历史查询记录</text>
					<fui-icon :name="isHistoryExpanded ? 'up' : 'down'" :size="32" color="#666"></fui-icon>
				</view>
				
				<view class="history-records" v-if="isHistoryExpanded">
					<!-- 加载提示 -->
					<view v-if="isHistoryLoading" class="empty-records">
						<fui-loadmore text="加载中..." iconColor="#004299"></fui-loadmore>
					</view>
					
					<!-- 无记录提示 -->
					<view v-else-if="historyRequests.length === 0" class="empty-records">
						<fui-icon name="file-search-line" :size="64" color="#CCCCCC"></fui-icon>
						<text class="empty-text">暂无查询记录</text>
					</view>
					
					<!-- 历史记录列表 -->
					<view v-else>
						<view class="record-card" v-for="(record, index) in historyRequests" :key="record.id" @tap="toggleRecordDetail(index)">
							<view class="record-header">
								<view class="record-type">
									<fui-icon :name="getIconByType(record.type)" :color="getColorByType(record.type)" :size="36"></fui-icon>
									<text class="type-name">{{record.typeName}}</text>
								</view>
								<view class="record-status" :class="'status-' + record.status">
									{{record.statusText}}
								</view>
							</view>
							
							<view class="record-date">申请时间：{{record.applyDate}}</view>
							
							<!-- 记录详情 - 展开时显示 -->
							<view class="record-details" v-if="record.isExpanded">
								<view class="detail-item" v-for="(value, key) in record.details" :key="key" v-if="value">
									<text class="detail-label">{{getDetailLabel(key)}}：</text>
									<text class="detail-value">{{value}}</text>
								</view>
								
								<!-- 处理时间 -->
								<view class="detail-item" v-if="record.processingTime">
									<text class="detail-label">处理时间：</text>
									<text class="detail-value">{{record.processingTime}}</text>
								</view>
								
								<!-- 如果已完成，显示下载按钮 -->
								<view class="record-actions" v-if="record.status === 'completed'">
									<fui-button type="primary" :background="primaryColor" size="medium" class="download-button" @click.stop="downloadResult(record.id)">下载结果</fui-button>
								</view>
								
								<!-- 如果被拒绝，显示拒绝原因 -->
								<view class="reject-reason" v-if="record.status === 'rejected' && record.rejectReason">
									<text class="reason-label">拒绝原因：</text>
									<text class="reason-content">{{record.rejectReason}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 安全区域 -->
			<view class="safe-area-bottom"></view>
		</view>
		
		<!-- 选择器组件 -->
		<fui-picker 
			:show="pickerConfig.show" 
			:options="pickerConfig.options" 
			@confirm="onPickerConfirm" 
			@cancel="closePicker">
		</fui-picker>
		
		<!-- 加载提示 -->
		<fui-loading :show="isLoading && !isHistoryLoading" type="col" text="处理中..."></fui-loading>
		
		<!-- 成功提示页 -->
		<fui-dialog 
			:show="showSuccess" 
			title="申请提交成功" 
			content="您的档案查询申请已成功提交，请耐心等待处理结果"
			buttonColor="#004299"
			@confirm="onSuccessClose">
		</fui-dialog>
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
