<template>
	<view class="help-area">
		<!-- 使用FirstUI导航栏组件 -->
		<fui-nav-bar
			:statusBar="true"
			title="系统帮助"
			background="#F0F4F8"
			color="#333333"
			:size="18"
			:isFixed="true"
			:fontWeight="500"
			@init="navbarInit"
			@leftClick="goBack">
			<!-- 正确使用命名插槽放置左侧返回按钮 -->
			<view slot="left">
				<fui-icon name="arrowleft" :size="48" color="#333333"></fui-icon>
			</view>
		</fui-nav-bar>
		
		<!-- 内容区域 -->
		<view class="help-content" :style="{ marginTop: navHeight + 'px' }">
			<!-- 系统说明卡片 -->
			<view class="card system-intro-card">
				<view class="card-title">
					<image src="/static/information-line.svg" class="title-icon svg-icon svg-blue"></image>
					<text class="title-text">关于重财校友会</text>
				</view>
				<view class="card-content">
					<text class="intro-text">重财校友会小程序是面向重庆财经学院校友的官方移动应用，为校友提供信息获取、人脉拓展、资源共享等服务，致力于促进校友之间的联系与交流，增强校友与母校的联系。</text>
				</view>
			</view>
			
			<!-- 功能指南卡片 -->
			<view class="card function-guide-card">
				<view class="card-title">
					<image src="/static/book-2-line.svg" class="title-icon svg-icon svg-darkblue"></image>
					<text class="title-text">功能指南</text>
				</view>
				<view class="card-content guide-list">
					<view class="guide-item" v-for="(item, index) in functionGuides" :key="index">
						<view class="guide-header" @tap="toggleGuide(index)">
							<view class="guide-question">
								<image :src="'/static/' + item.icon + '.svg'" class="guide-icon svg-icon" :class="item.iconClass"></image>
								<text class="guide-title">{{ item.title }}</text>
							</view>
							<image src="/static/arrow-down-s-line.svg" class="arrow-icon svg-icon svg-hint" :class="{'arrow-up': item.expanded}"></image>
						</view>
						<view class="guide-detail" v-if="item.expanded">
							<text class="guide-text">{{ item.content }}</text>
						</view>
						<view class="divider" v-if="index !== functionGuides.length - 1"></view>
					</view>
				</view>
			</view>
			
			<!-- 常见问题卡片 -->
			<view class="card faq-card">
				<view class="card-title">
					<image src="/static/question-line.svg" class="title-icon svg-icon svg-orange"></image>
					<text class="title-text">常见问题</text>
				</view>
				<view class="card-content faq-list">
					<view class="faq-item" v-for="(item, index) in faqs" :key="index">
						<view class="faq-header" @tap="toggleFaq(index)">
							<view class="faq-question">
								<text class="question-prefix">Q:</text>
								<text class="question-text">{{ item.question }}</text>
							</view>
							<image src="/static/arrow-down-s-line.svg" class="arrow-icon svg-icon svg-hint" :class="{'arrow-up': item.expanded}"></image>
						</view>
						<view class="faq-answer" v-if="item.expanded">
							<text class="answer-prefix">A:</text>
							<text class="answer-text">{{ item.answer }}</text>
						</view>
						<view class="divider" v-if="index !== faqs.length - 1"></view>
					</view>
				</view>
			</view>
			
			<!-- 联系我们卡片 -->
			<view class="card contact-card">
				<view class="card-title">
					<image src="/static/contacts-line.svg" class="title-icon svg-icon svg-green"></image>
					<text class="title-text">联系我们</text>
				</view>
				<view class="card-content">
					<view class="contact-item">
						<image src="/static/customer-service-2-line.svg" class="contact-icon svg-icon svg-blue"></image>
						<text class="contact-text">客服热线：023-12345678</text>
					</view>
					<view class="contact-item">
						<image src="/static/mail-line.svg" class="contact-icon svg-icon svg-blue"></image>
						<text class="contact-text">邮箱：alumni@cqcfa.edu.cn</text>
					</view>
					<view class="contact-item">
						<image src="/static/global-line.svg" class="contact-icon svg-icon svg-blue"></image>
						<text class="contact-text">网站：https://alumni.cqcfa.edu.cn</text>
					</view>
				</view>
			</view>
			
			<!-- 版本信息 -->
			<view class="version-info">
				<text class="version-text">当前版本: v1.0.0</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 导航栏高度
				navHeight: 44,
				statusBarHeight: 0,
				
				// 功能指南列表
				functionGuides: [
					{
						title: '校友卡',
						icon: 'bank-card-2-line',
						iconClass: 'svg-blue',
						content: '校友卡是您在重财校友网络中的电子身份证，包含您的校友信息、学历认证等。可用于校内场馆预约、图书馆借阅、参加校友活动等。',
						expanded: false
					},
					{
						title: '发现校友',
						icon: 'user-search-line',
						iconClass: 'svg-darkblue',
						content: '通过地区、院系、入学年份等多维度筛选，找到与您志同道合的校友，扩展您的人脉网络。',
						expanded: false
					},
					{
						title: '母校活动',
						icon: 'calendar-event-line',
						iconClass: 'svg-orange',
						content: '浏览并报名参加母校举办的各类活动，包括学术讲座、校友聚会、校庆活动等。您还可以查看活动回顾和相册。',
						expanded: false
					},
					{
						title: '进校申请',
						icon: 'building-4-line',
						iconClass: 'svg-darkblue',
						content: '校友返校参观需提前申请。通过此功能，您可以在线提交进校申请，获得电子通行证，便捷入校。',
						expanded: false
					}
				],
				
				// 常见问题列表
				faqs: [
					{
						question: '如何认证校友身份？',
						answer: '在"个人中心"页面点击"校友认证"，填写您的学号、姓名、入学年份等信息，系统将自动与学校数据库匹配。若信息无误，将在1-3个工作日内完成认证。',
						expanded: false
					},
					{
						question: '忘记账号密码怎么办？',
						answer: '请点击登录页面的"忘记密码"，通过绑定的手机号或邮箱进行身份验证，然后重置密码。如果无法找回，请联系客服协助处理。',
						expanded: false
					},
					{
						question: '如何更新个人信息？',
						answer: '在"个人中心"页面点击"编辑资料"，可以更新您的联系方式、工作信息、地址等个人资料。',
						expanded: false
					},
					{
						question: '如何参加校友活动？',
						answer: '在"母校活动"页面浏览近期活动，点击感兴趣的活动详情页，然后点击"报名参加"按钮完成报名。报名成功后，您将收到确认通知和活动提醒。',
						expanded: false
					},
					{
						question: '如何联系其他校友？',
						answer: '通过"发现校友"页面找到目标校友，点击其头像进入详情页，可以查看联系方式或发送好友请求。建立联系后，可以在"我的好友"中进行沟通交流。',
						expanded: false
					}
				]
			}
		},
		onLoad() {
			// 页面加载逻辑
		},
		methods: {
			// 导航栏初始化
			navbarInit(e) {
				this.statusBarHeight = e.statusBarHeight;
				this.navHeight = e.height + e.statusBarHeight;
			},
			
			// 返回上一页
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			
			// 切换功能指南展开状态
			toggleGuide(index) {
				this.functionGuides[index].expanded = !this.functionGuides[index].expanded;
				
				// 收起其他已展开的项
				this.functionGuides.forEach((item, i) => {
					if (i !== index && item.expanded) {
						item.expanded = false;
					}
				});
			},
			
			// 切换常见问题展开状态
			toggleFaq(index) {
				this.faqs[index].expanded = !this.faqs[index].expanded;
				
				// 收起其他已展开的项
				this.faqs.forEach((item, i) => {
					if (i !== index && item.expanded) {
						item.expanded = false;
					}
				});
			}
		}
	}
</script>

<style>
	.help-area {
		min-height: 100vh;
		background-color: var(--background-color-solid, #F0F4F8);
	}
	
	.help-content {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	
	/* 卡片通用样式 */
	.card {
		background-color: rgba(255, 255, 255, 0.9);
		border-radius: 12px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.2);
		margin-bottom: 16px;
	}
	
	.card-title {
		display: flex;
		align-items: center;
		padding: 16px;
		border-bottom: 1px solid #EEEEEE;
	}
	
	.title-icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: 12px;
	}
	
	.title-text {
		font-size: 32rpx;
		font-weight: 600;
		color: #333333;
	}
	
	.card-content {
		padding: 16px;
	}
	
	/* 系统介绍卡片 */
	.intro-text {
		font-size: 28rpx;
		color: #666666;
		line-height: 1.6;
	}
	
	/* 功能指南和常见问题共用样式 */
	.guide-item, .faq-item {
		margin-bottom: 12px;
	}
	
	.guide-header, .faq-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 0;
	}
	
	.guide-question, .faq-question {
		display: flex;
		align-items: center;
		flex: 1;
	}
	
	.guide-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 12px;
	}
	
	.guide-title, .question-text {
		font-size: 28rpx;
		color: #333333;
		flex: 1;
	}
	
	.arrow-icon {
		width: 36rpx;
		height: 36rpx;
		transition: transform 0.3s;
	}
	
	.arrow-up {
		transform: rotate(180deg);
	}
	
	.guide-detail, .faq-answer {
		padding: 12px 0 12px 48rpx;
		background-color: rgba(0, 0, 0, 0.02);
		border-radius: 8px;
		margin-top: 8px;
	}
	
	.guide-text, .answer-text {
		font-size: 26rpx;
		color: #666666;
		line-height: 1.6;
	}
	
	/* 问答特有样式 */
	.question-prefix, .answer-prefix {
		font-weight: bold;
		margin-right: 8px;
		font-size: 28rpx;
	}
	
	.question-prefix {
		color: #2A6DCF;
	}
	
	.answer-prefix {
		color: #4CAF50;
	}
	
	/* 联系我们卡片 */
	.contact-item {
		display: flex;
		align-items: center;
		margin-bottom: 16px;
	}
	
	.contact-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 12px;
	}
	
	.contact-text {
		font-size: 28rpx;
		color: #666666;
	}
	
	/* 版本信息 */
	.version-info {
		text-align: center;
		padding: 24px 0;
	}
	
	.version-text {
		font-size: 24rpx;
		color: #999999;
	}
	
	/* 分割线 */
	.divider {
		height: 1px;
		background-color: #EEEEEE;
		margin: 12px 0;
	}
	
	/* SVG 图标颜色类 */
	.svg-icon {
		display: block;
	}
	
	.svg-blue {
		filter: brightness(0) saturate(100%) invert(36%) sepia(44%) saturate(2419%) hue-rotate(200deg) brightness(91%) contrast(95%);
	}
	
	.svg-darkblue {
		filter: brightness(0) saturate(100%) invert(16%) sepia(78%) saturate(3107%) hue-rotate(206deg) brightness(94%) contrast(101%);
	}
	
	.svg-orange {
		filter: brightness(0) saturate(100%) invert(64%) sepia(68%) saturate(2809%) hue-rotate(360deg) brightness(103%) contrast(102%);
	}
	
	.svg-green {
		filter: brightness(0) saturate(100%) invert(59%) sepia(10%) saturate(2606%) hue-rotate(75deg) brightness(94%) contrast(86%);
	}
	
	.svg-hint {
		filter: brightness(0) saturate(100%) invert(66%) sepia(0%) saturate(0%) hue-rotate(213deg) brightness(87%) contrast(81%);
	}
</style>
