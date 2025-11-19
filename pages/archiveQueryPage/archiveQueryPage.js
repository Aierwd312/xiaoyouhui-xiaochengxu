import { ref, reactive } from 'vue';

export default {
	data() {
		return {
			// 导航栏配置
			navBackground: '#004299', // 导航栏背景色 - 重财蓝
			navTitleColor: '#FFFFFF', // 导航栏标题颜色 - 白色
			primaryColor: '#004299', // 主题色 - 重财蓝
			
			// 档案类型数据
			archiveTypes: [
				{
					type: 'transcript',
					name: '成绩单',
					icon: 'file-list-3-line',
					color: '#2A6DCF',
					description: '在校期间的成绩记录'
				},
				{
					type: 'diploma',
					name: '学历证明',
					icon: 'bookmark-3-line',
					color: '#FF9800',
					description: '毕业证书、学位证明等'
				},
				{
					type: 'awards',
					name: '获奖记录',
					icon: 'award-line',
					color: '#4CAF50',
					description: '在校期间获得的各类奖项'
				},
				{
					type: 'activity',
					name: '社团活动',
					icon: 'team-line',
					color: '#79A6DC',
					description: '参与过的社团和活动记录'
				},
				{
					type: 'status',
					name: '学籍信息',
					icon: 'profile-line',
					color: '#FF5722',
					description: '在校学籍状态记录'
				},
				{
					type: 'other',
					name: '其他材料',
					icon: 'folder-5-line',
					color: '#333333',
					description: '其他类型的档案材料'
				}
			],
			
			// 选择器数据
			semesterOptions: [
				{ value: 'all', text: '全部学期' },
				{ value: 'year1', text: '第一学年' },
				{ value: 'year2', text: '第二学年' },
				{ value: 'year3', text: '第三学年' },
				{ value: 'year4', text: '第四学年' },
				{ value: '2025-2026-1', text: '2025-2026学年第一学期' },
				{ value: '2025-2026-2', text: '2025-2026学年第二学期' },
				{ value: '2026-2027-1', text: '2026-2027学年第一学期' },
				{ value: '2026-2027-2', text: '2026-2027学年第二学期' }
			],
			
			purposeOptions: [
				{ value: 'further_study', text: '升学' },
				{ value: 'employment', text: '就业' },
				{ value: 'personal', text: '个人存档' },
				{ value: 'other', text: '其他' }
			],
			
			receiveMethodOptions: [
				{ value: 'electronic', text: '电子档' },
				{ value: 'paper', text: '纸质档(邮寄)' },
				{ value: 'both', text: '两者都需要' }
			],
			
			// 当前选择的档案类型
			selectedType: null,
			
			// 表单数据
			formData: {
				name: '', // 姓名（自动填充）
				studentId: '', // 学号（自动填充）
				enrollmentYear: '', // 入学年份（自动填充）
				department: '', // 院系（自动填充）
				semester: '', // 查询学期值
				semesterText: '', // 查询学期显示文本
				purpose: '', // 用途值
				purposeText: '', // 用途显示文本
				receiveMethod: '', // 接收方式值
				receiveMethodText: '', // 接收方式显示文本
				remarks: '', // 备注
				phone: '', // 联系电话（自动填充但可修改）
				address: '' // 邮寄地址（仅纸质档显示）
			},
			
			// 选择器配置
			pickerConfig: {
				show: false, // 是否显示选择器
				options: [], // 选择器选项
				currentField: '' // 当前操作的字段
			},
			
			// 历史申请记录数据
			historyRequests: [],
			isHistoryExpanded: true, // 默认展开历史记录
			isHistoryLoading: false, // 历史记录加载状态
			
			// 状态控制
			isLoading: false, // 加载状态
			showSuccess: false // 是否显示成功页面
		}
	},
	onLoad() {
		// 初始化加载状态
		this.isLoading = false;
		this.isHistoryLoading = false;
		
		// 页面加载时获取用户信息和历史记录
		this.fetchUserInfo();
		this.fetchHistoryRequests();
	},
	onShow() {
		// 确保页面显示时处理中状态已关闭
		this.isLoading = false;
		this.isHistoryLoading = false;
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
		 * 获取用户基本信息
		 */
		async fetchUserInfo() {
			try {
				this.isLoading = true;
				
				// 这里是模拟API调用，实际应用中应该从服务器获取
				await new Promise(resolve => setTimeout(resolve, 500));
				
				// 模拟用户数据
				this.formData.name = '张三';
				this.formData.studentId = '202512345';
				this.formData.enrollmentYear = '2025';
				this.formData.department = '会计学院';
				this.formData.phone = '13800138000';
			} catch (error) {
				console.error('获取用户信息失败:', error);
				uni.showToast({
					title: '获取用户信息失败',
					icon: 'none'
				});
			} finally {
				this.isLoading = false;
			}
		},
		
		/**
		 * 获取历史申请记录
		 */
		async fetchHistoryRequests() {
			try {
				this.isHistoryLoading = true;
				
				// 模拟API请求延迟
				await new Promise(resolve => setTimeout(resolve, 1000));
				
				// 模拟数据，实际应从服务器获取
				this.historyRequests = [
					{
						id: 'req001',
						type: 'transcript',
						typeName: '成绩单',
						status: 'completed',
						statusText: '已完成',
						applyDate: '2025-09-15 14:30',
						isExpanded: false, // 控制展开状态
						details: {
							semester: '2025-2026学年第一学期',
							purpose: '升学',
							receiveMethod: '电子档',
							remarks: ''
						},
						resultUrl: 'https://example.com/results/transcript_001.pdf',
						processingTime: '2025-09-16 10:25'
					},
					{
						id: 'req002',
						type: 'diploma',
						typeName: '学历证明',
						status: 'processing',
						statusText: '处理中',
						applyDate: '2025-09-20 11:45',
						isExpanded: false,
						details: {
							purpose: '就业',
							receiveMethod: '纸质档(邮寄)',
							address: '重庆市南岸区学府大道19号 邮编: 400000',
							remarks: '需要加盖学校公章'
						}
					},
					{
						id: 'req003',
						type: 'awards',
						typeName: '获奖记录',
						status: 'pending',
						statusText: '待处理',
						applyDate: '2025-09-22 16:20',
						isExpanded: false,
						details: {
							purpose: '个人存档',
							receiveMethod: '电子档',
							remarks: '包含所有奖学金及竞赛获奖情况'
						}
					},
					{
						id: 'req004',
						type: 'status',
						typeName: '学籍信息',
						status: 'rejected',
						statusText: '已拒绝',
						applyDate: '2025-09-10 09:15',
						isExpanded: false,
						details: {
							purpose: '其他',
							receiveMethod: '电子档',
							remarks: '需要完整的学籍变动记录'
						},
						rejectReason: '申请信息不完整，请重新提交并说明具体需要的学籍信息内容'
					}
				];
			} catch (error) {
				console.error('获取历史记录失败:', error);
				uni.showToast({
					title: '获取历史记录失败',
					icon: 'none'
				});
			} finally {
				this.isHistoryLoading = false;
			}
		},
		
		/**
		 * 选择档案类型
		 */
		selectArchiveType(item) {
			this.selectedType = item.type;
			
			// 重置表单特定字段
			this.formData.semester = '';
			this.formData.semesterText = '';
			this.formData.purpose = '';
			this.formData.purposeText = '';
			this.formData.receiveMethod = '';
			this.formData.receiveMethodText = '';
			this.formData.address = '';
			this.formData.remarks = '';
			
			// 滚动到表单区域
			setTimeout(() => {
				uni.pageScrollTo({
					selector: '.form-section',
					duration: 300
				});
			}, 100);
		},
		
		/**
		 * 打开学期选择器
		 */
		showSemesterPicker() {
			this.pickerConfig = {
				show: true,
				options: this.semesterOptions,
				currentField: 'semester'
			};
		},
		
		/**
		 * 打开用途选择器
		 */
		showPurposePicker() {
			this.pickerConfig = {
				show: true,
				options: this.purposeOptions,
				currentField: 'purpose'
			};
		},
		
		/**
		 * 打开接收方式选择器
		 */
		showReceiveMethodPicker() {
			this.pickerConfig = {
				show: true,
				options: this.receiveMethodOptions,
				currentField: 'receiveMethod'
			};
		},
		
		/**
		 * 关闭选择器
		 */
		closePicker() {
			this.pickerConfig.show = false;
		},
		
		/**
		 * 选择器确认选择
		 */
		onPickerConfirm(e) {
			try {
				const { value, text } = e.item[0];
				const field = this.pickerConfig.currentField;
				
				// 根据当前操作的字段更新表单数据
				if (field === 'semester') {
					this.formData.semester = value;
					this.formData.semesterText = text;
				} else if (field === 'purpose') {
					this.formData.purpose = value;
					this.formData.purposeText = text;
				} else if (field === 'receiveMethod') {
					this.formData.receiveMethod = value;
					this.formData.receiveMethodText = text;
				}
				
				this.closePicker();
			} catch (error) {
				console.error('选择器确认选择错误:', error);
				uni.showToast({
					title: '选择出错，请重试',
					icon: 'none'
				});
				this.closePicker();
			}
		},
		
		/**
		 * 切换历史记录区域展开/折叠
		 */
		toggleHistory() {
			this.isHistoryExpanded = !this.isHistoryExpanded;
		},
		
		/**
		 * 切换记录详情展开/折叠
		 */
		toggleRecordDetail(index) {
			// 切换当前点击的记录展开状态
			this.historyRequests[index].isExpanded = !this.historyRequests[index].isExpanded;
		},
		
		/**
		 * 根据类型获取图标
		 */
		getIconByType(type) {
			const typeItem = this.archiveTypes.find(item => item.type === type);
			return typeItem ? typeItem.icon : 'file-list-3-line';
		},
		
		/**
		 * 根据类型获取颜色
		 */
		getColorByType(type) {
			const typeItem = this.archiveTypes.find(item => item.type === type);
			return typeItem ? typeItem.color : '#333333';
		},
		
		/**
		 * 获取详情字段标签
		 */
		getDetailLabel(key) {
			const labelMap = {
				'semester': '查询学期',
				'purpose': '用途说明',
				'receiveMethod': '接收方式',
				'address': '邮寄地址',
				'remarks': '其他说明'
			};
			
			return labelMap[key] || key;
		},
		
		/**
		 * 下载查询结果
		 */
		async downloadResult(recordId) {
			try {
				// 使用单独的下载状态变量，避免影响全局加载状态
				const record = this.historyRequests.find(item => item.id === recordId);
				if (!record || !record.resultUrl) {
					uni.showToast({
						title: '下载链接无效',
						icon: 'none'
					});
					return;
				}
				
				// 显示下载中提示，但不影响全局loading状态
				uni.showLoading({
					title: '下载中...',
					mask: true
				});
				
				// 模拟下载过程
				await new Promise(resolve => setTimeout(resolve, 1500));
				
				// 下载成功提示
				uni.hideLoading();
				uni.showToast({
					title: '下载成功',
					icon: 'success'
				});
			} catch (error) {
				console.error('下载结果错误:', error);
				uni.hideLoading();
				uni.showToast({
					title: '下载失败，请重试',
					icon: 'none'
				});
			}
		},
		
		/**
		 * 提交表单
		 */
		async submitForm() {
			// 表单验证
			if (!this.validateForm()) {
				return;
			}
			
			try {
				this.isLoading = true;
				
				// 模拟提交请求
				await new Promise(resolve => setTimeout(resolve, 1500));
				
				this.showSuccess = true;
				
				// 重置表单
				this.resetForm();
				
				// 刷新历史记录
				this.fetchHistoryRequests();
			} catch (error) {
				console.error('提交表单错误:', error);
				uni.showToast({
					title: '提交失败，请重试',
					icon: 'none'
				});
			} finally {
				this.isLoading = false;
			}
		},
		
		/**
		 * 表单验证
		 */
		validateForm() {
			try {
				// 检查必填字段
				if (this.selectedType === 'transcript' && !this.formData.semester) {
					uni.showToast({
						title: '请选择查询学期',
						icon: 'none'
					});
					return false;
				}
				
				if (!this.formData.purpose) {
					uni.showToast({
						title: '请选择用途说明',
						icon: 'none'
					});
					return false;
				}
				
				if (!this.formData.receiveMethod) {
					uni.showToast({
						title: '请选择接收方式',
						icon: 'none'
					});
					return false;
				}
				
				// 如果选择了纸质档，检查地址
				if ((this.formData.receiveMethod === 'paper' || this.formData.receiveMethod === 'both') && !this.formData.address) {
					uni.showToast({
						title: '请输入邮寄地址',
						icon: 'none'
					});
					return false;
				}
				
				// 检查电话
				if (!this.formData.phone) {
					uni.showToast({
						title: '请输入联系电话',
						icon: 'none'
					});
					return false;
				}
				
				// 手机号格式验证
				const phoneReg = /^1[3-9]\d{9}$/;
				if (!phoneReg.test(this.formData.phone)) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					});
					return false;
				}
				
				return true;
			} catch (error) {
				console.error('表单验证错误:', error);
				return false;
			}
		},
		
		/**
		 * 重置表单
		 */
		resetForm() {
			this.selectedType = null;
			this.formData.semester = '';
			this.formData.semesterText = '';
			this.formData.purpose = '';
			this.formData.purposeText = '';
			this.formData.receiveMethod = '';
			this.formData.receiveMethodText = '';
			this.formData.address = '';
			this.formData.remarks = '';
			
			// 滚动到页面顶部
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 300
			});
		},
		
		/**
		 * 关闭成功提示
		 */
		onSuccessClose() {
			this.showSuccess = false;
			
			// 刷新历史记录
			this.fetchHistoryRequests();
		}
	}
}
