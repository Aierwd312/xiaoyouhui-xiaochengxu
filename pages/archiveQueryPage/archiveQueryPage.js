import { ref, reactive } from 'vue';
import { 
	getArchiveApplicationList, 
	addArchiveApplication, 
	updateArchiveApplication, 
	deleteArchiveApplication,
	getArchiveApplicationDetail 
} from '@/api/archives';
import store from '@/store';

export default {
	data() {
		return {
			// 导航栏配置
			navBackground: '#004299',
			navTitleColor: '#FFFFFF',
			primaryColor: '#004299',
			
			// 申请列表数据
			applications: [],
			
			// 表单数据
			formData: {
				title: '', // 申请标题
				applicationFile: '', // 申请材料
				applicationReason: '', // 申请原因
				applicationAnnexes: '', // 申请附件
				sendType: '', // 接收方式值
				sendTypeText: '', // 接收方式显示文本
				email: '', // 电子邮箱
				address: '', // 邮寄地址
				phone: '', // 联系电话
				remark: '' // 备注
			},
			
			// 接收方式选项（字符串数组）
			sendTypeOptions: ['电子档', '纸质档(邮寄)', '两者都需要'],
			
			// 接收方式映射
			sendTypeMap: {
				'电子档': 'email',
				'纸质档(邮寄)': 'paper',
				'两者都需要': 'both'
			},
			
			// 选择器配置
			pickerConfig: {
				show: false,
				options: [],
				currentField: ''
			},
			
			// 状态控制
			isLoading: false, // 列表加载状态
			isSubmitting: false, // 提交加载状态
			showFormPopup: false, // 是否显示表单弹窗
			formMode: 'add', // 表单模式：add-新增, edit-编辑
			currentEditId: null // 当前编辑的申请ID
		}
	},
	onLoad() {
		this.loadApplications();
	},
	onShow() {
		// 页面重新显示时刷新列表
		this.loadApplications();
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
		 * 加载申请列表
		 */
		async loadApplications() {
			try {
				this.isLoading = true;
				
				// 获取当前用户ID（从store中获取）
				const userInfo = store.getters.userInfo || {};
				const userId = userInfo.userId || userInfo.id;
				
				console.log('=== 加载档案申请列表 ===');
				console.log('用户信息:', userInfo);
				console.log('用户ID:', userId);
				
				// 调用API获取列表 - 根据API文档优化查询参数
				const queryParams = {
					applicant: userId,
					// 可以添加其他查询条件
					// status: '', // 申请状态筛选
					// title: '', // 标题筛选
					// applicationFile: '', // 申请材料筛选
				};
				
				console.log('查询参数:', queryParams);
				const response = await getArchiveApplicationList(queryParams);
				
				// 处理返回数据 - 根据API响应结构
				console.log('API响应:', response);
				
				if (response && response.code === 1) {
					// 成功响应，处理数据
					if (response.rows && Array.isArray(response.rows)) {
						this.applications = response.rows.map(item => ({
							...item,
							status: this.mapStatus(item.status),
							statusText: this.getStatusText(item.status)
						}));
						console.log('处理后的申请列表:', this.applications);
						console.log('总记录数:', response.total);
					} else {
						this.applications = [];
						console.log('无申请记录');
					}
				} else {
					// 响应失败
					this.applications = [];
					const errorMsg = response?.msg || '获取列表失败';
					console.error('API响应错误:', errorMsg);
					uni.showToast({
						title: errorMsg,
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('加载申请列表失败:', error);
				this.applications = [];
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				});
			} finally {
				this.isLoading = false;
			}
		},
		
		/**
		 * 显示申请表单
		 */
		showApplicationForm() {
			this.formMode = 'add';
			this.currentEditId = null;
			this.resetFormData();
			// 获取用户信息填充电话和邮箱
			const userInfo = store.getters.userInfo || {};
			this.formData.phone = userInfo.phonenumber || userInfo.phone || '';
			this.formData.email = userInfo.email || '';
			this.showFormPopup = true;
		},
		
		/**
		 * 关闭表单弹窗
		 */
		closeFormPopup() {
			this.showFormPopup = false;
			this.resetFormData();
		},
		
		/**
		 * 重置表单数据
		 */
		resetFormData() {
			this.formData = {
				title: '',
				applicationFile: '',
				applicationReason: '',
				applicationAnnexes: '',
				sendType: '',
				sendTypeText: '',
				email: '',
				address: '',
				phone: '',
				remark: ''
			};
		},
		
		/**
		 * 打开接收方式选择器
		 */
		showSendTypePicker() {
			this.pickerConfig = {
				show: true,
				options: this.sendTypeOptions,
				currentField: 'sendType'
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
				const selectedText = e.text; // 选中的文本
				const selectedValue = this.sendTypeMap[selectedText]; // 映射到对应的值
				
				// 先关闭选择器，避免布局冲突
				this.closePicker();
				
				// 延迟更新数据，确保选择器完全关闭后再更新
				setTimeout(() => {
					this.formData.sendTypeText = selectedText;
					this.formData.sendType = selectedValue;
				}, 150);
			} catch (error) {
				console.error('选择器确认错误:', error);
				this.closePicker();
			}
		},
		
		/**
		 * 下载查询结果
		 */
		downloadResult(recordId) {
			const record = this.applications.find(item => item.id === recordId);
			if (!record || !record.resultUrl) {
				uni.showToast({
					title: '暂无可下载文件',
					icon: 'none'
				});
				return;
			}
			
			// 如果有下载链接，使用uni.downloadFile下载
			uni.downloadFile({
				url: record.resultUrl,
				success: (res) => {
					if (res.statusCode === 200) {
						// 保存文件到本地
						const filePath = res.tempFilePath;
						uni.saveFile({
							tempFilePath: filePath,
							success: (saveRes) => {
								uni.showToast({
									title: '下载成功',
									icon: 'success'
								});
							},
							fail: () => {
								uni.showToast({
									title: '保存失败',
									icon: 'none'
								});
							}
						});
					}
				},
				fail: (error) => {
					console.error('下载失败:', error);
					uni.showToast({
						title: '下载失败',
						icon: 'none'
					});
				}
			});
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
				this.isSubmitting = true;
				
				// 获取当前用户信息
				// const userInfo = store.getters.userInfo || {};
				// const userId = userInfo.userId || userInfo.id;
				// const userName = userInfo.userName || userInfo.nickName || '';
				
				// // 检查用户信息
				// if (!userId) {
				// 	console.error('用户信息缺失，无法提交申请');
				// 	uni.showModal({
				// 		title: '提示',
				// 		content: '用户信息缺失，请重新登录后再试',
				// 		showCancel: false,
				// 		success: () => {
				// 			uni.reLaunch({ url: '/pages/login/login' });
				// 		}
				// 	});
				// 	return;
				// }
				
				// 构建提交数据 - 完全匹配API示例结构
				const submitData = {
					title: this.formData.title,
					// applicant: userId,
					// applicantUserName: userName,
					// applicantNickName: userInfo.nickName || '',
					// deptId: userInfo.deptId || 1, // 默认为1
					applicationFile: this.formData.applicationFile,
					applicationReason: this.formData.applicationReason,
					applicationAnnexes: this.formData.applicationAnnexes || '', // 申请附件
					sendType: this.formData.sendType,
					email: this.formData.email || userInfo.email || '',
					address: this.formData.address || '',
					phone: this.formData.phone,
					// status: '0', // 0-待审核
					reviewer: null, // 审核人，新增时为空
					reviewerName: '', // 审核人姓名
					reviewComments: '', // 审核意见
					// createBy: userName, // 创建者
					// updateBy: userName, // 更新者
					remark: this.formData.remark || '',
					params: {
						// 扩展参数，可用于存储额外信息
					}
				};
				
				// 打印调试信息
				// console.log('=== 档案申请提交调试信息 ===');
				// console.log('用户信息:', userInfo);
				// console.log('表单数据:', this.formData);
				// console.log('提交数据:', submitData);
				// console.log('API模式:', this.formMode === 'edit' ? '编辑' : '新增');
				
				// 根据是否为编辑模式调用不同API
				if (this.formMode === 'edit' && this.currentEditId) {
					submitData.id = this.currentEditId;
					console.log('调用编辑API:', submitData);
					const response = await updateArchiveApplication(submitData);
					console.log('编辑API响应:', response);
					uni.showToast({
						title: '修改成功',
						icon: 'success'
					});
				} else {
					console.log('调用新增API:', submitData);
					const response = await addArchiveApplication(submitData);
					console.log('新增API响应:', response);
					uni.showToast({
						title: '提交成功',
						icon: 'success'
					});
				}
				this.loadApplications();
			} catch (error) {
				console.error('提交错误:', error);
				uni.showToast({
					title: this.formMode === 'edit' ? '修改失败' : '提交失败',
					icon: 'none'
				});
			} finally {
				this.isSubmitting = false;
			}
		},
		
		/**
		 * 表单验证
		 */
		validateForm() {
			if (!this.formData.title) {
				uni.showToast({
					title: '请输入申请标题',
					icon: 'none'
				});
				return false;
			}
			
			if (!this.formData.applicationFile) {
				uni.showToast({
					title: '请输入申请材料名称',
					icon: 'none'
				});
				return false;
			}
			
			if (!this.formData.applicationReason) {
				uni.showToast({
					title: '请输入申请原因',
					icon: 'none'
				});
				return false;
			}
			
			if (!this.formData.sendType) {
				uni.showToast({
					title: '请选择接收方式',
					icon: 'none'
				});
				return false;
			}
			
			// 验证电子邮箱（电子档或两者都需要时必填）
			if ((this.formData.sendType === 'email' || this.formData.sendType === 'both') && !this.formData.email) {
				uni.showToast({
					title: '请输入电子邮箱',
					icon: 'none'
				});
				return false;
			}
			
			// 验证邮箱格式
			if (this.formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) {
				uni.showToast({
					title: '请输入正确的邮箱格式',
					icon: 'none'
				});
				return false;
			}
			
			if ((this.formData.sendType === 'paper' || this.formData.sendType === 'both') && !this.formData.address) {
				uni.showToast({
					title: '请输入邮寄地址',
					icon: 'none'
				});
				return false;
			}
			
			if (!this.formData.phone) {
				uni.showToast({
					title: '请输入联系电话',
					icon: 'none'
				});
				return false;
			}
			
			const phoneReg = /^1[3-9]\d{9}$/;
			if (!phoneReg.test(this.formData.phone)) {
				uni.showToast({
					title: '请输入正确的手机号',
					icon: 'none'
				});
				return false;
			}
			
			return true;
		},
		
		/**
		 * 编辑档案申请
		 */
		editApplication(app) {
			this.formMode = 'edit';
			this.currentEditId = app.id;
			
			// 填充表单数据
			const sendTypeText = Object.keys(this.sendTypeMap).find(key => this.sendTypeMap[key] === app.sendType) || '';
			
			this.formData = {
				title: app.title || '',
				applicationFile: app.applicationFile || '',
				applicationReason: app.applicationReason || '',
				applicationAnnexes: app.applicationAnnexes || '',
				sendType: app.sendType || '',
				sendTypeText: sendTypeText,
				email: app.email || '',
				address: app.address || '',
				phone: app.phone || '',
				remark: app.remark || ''
			};
			
			// 显示表单
			this.showFormPopup = true;
		},
		
		/**
		 * 撤回档案申请
		 */
		async withdrawApplication(appId) {
			try {
				const confirmResult = await new Promise((resolve) => {
					uni.showModal({
						title: '确认撤回',
						content: '确定要撤回这条申请吗？',
						success: (res) => resolve(res.confirm),
						fail: () => resolve(false)
					});
				});
				
				if (!confirmResult) return;
				
				// 撤回即删除
				await deleteArchiveApplication(appId);
				
				uni.showToast({
					title: '已撤回',
					icon: 'success'
				});
				
				this.loadApplications();
			} catch (error) {
				console.error('撤回失败:', error);
				uni.showToast({
					title: '撤回失败',
					icon: 'none'
				});
			}
		},
		
		/**
		 * 删除档案申请
		 */
		async deleteApplication(appId) {
			try {
				const confirmResult = await new Promise((resolve) => {
					uni.showModal({
						title: '确认删除',
						content: '确定要删除这条申请吗？删除后将无法恢复。',
						success: (res) => resolve(res.confirm),
						fail: () => resolve(false)
					});
				});
				
				if (!confirmResult) return;
				
				await deleteArchiveApplication(appId);
				
				uni.showToast({
					title: '删除成功',
					icon: 'success'
				});
				
				this.loadApplications();
			} catch (error) {
				console.error('删除申请错误:', error);
				uni.hideLoading();
				uni.showToast({
					title: '删除失败，请重试',
					icon: 'none'
				});
			}
		},
		
		/**
		 * 映射状态值
		 */
		mapStatus(statusValue) {
			const statusMap = {
				'0': 'pending',
				'1': 'completed',
				'2': 'rejected'
			};
			return statusMap[String(statusValue)] || 'pending';
		},
		
		/**
		 * 获取状态文本
		 */
		getStatusText(statusValue) {
			const textMap = {
				'0': '待审核',
				'1': '已通过',
				'2': '已拒绝'
			};
			return textMap[String(statusValue)] || '待审核';
		}
	}
}
