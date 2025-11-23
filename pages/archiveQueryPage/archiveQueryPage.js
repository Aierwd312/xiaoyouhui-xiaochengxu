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
			navBackground: '#004299',
			navTitleColor: '#FFFFFF',
			primaryColor: '#004299',
			applications: [],
			formData: {
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
			},
			sendTypeOptions: ['电子档', '纸质档(邮寄)', '两者都需要'],
			sendTypeMap: {
				'电子档': '0',
				'纸质档(邮寄)': '1',
				'两者都需要': '2'
			},
			sendTypeReverseMap: {
				'0': 'email',
				'1': 'paper',
				'2': 'both'
			},
			pickerConfig: {
				show: false,
				options: [],
				currentField: ''
			},
			isLoading: false,
			isSubmitting: false,
			showFormPopup: false,
			formMode: 'add',
			currentEditId: null
		}
	},
	onLoad() {
		this.loadApplications();
	},
	onShow() {
		this.loadApplications();
	},
	methods: {
		goBack() {
			uni.navigateBack({
				delta: 1
			});
		},
		
		async loadApplications() {
			try {
				this.isLoading = true;
				const userInfo = store.getters.userInfo || {};
				const userId = userInfo.userId || userInfo.id;
				
				console.log('=== 加载档案申请列表 ===');
				console.log('用户信息:', userInfo);
				console.log('用户ID:', userId);
				// 如果有 userId，则按用户过滤；否则获取所有记录
				const queryParams = userId ? { applicant: userId } : {};
				
				console.log('查询参数:', queryParams);
				const response = await getArchiveApplicationList(queryParams);
				console.log('API响应:', response);
				
				if (response && response.code === 200) {
					if (response.rows && Array.isArray(response.rows)) {
						this.applications = response.rows.map(item => {
							const originalStatus = item.status;
							return {
								...item,
								status: this.mapStatus(originalStatus),
								statusText: this.getStatusText(originalStatus)
							};
						});
						console.log('处理后的申请列表:', this.applications);
						console.log('总记录数:', response.total);
					} else {
						this.applications = [];
						console.log('无申请记录');
					}
				} else {
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
		
		showApplicationForm() {
			this.formMode = 'add';
			this.currentEditId = null;
			this.resetFormData();
			const userInfo = store.getters.userInfo || {};
			this.formData.phone = userInfo.phonenumber || userInfo.phone || '';
			this.formData.email = userInfo.email || '';
			this.showFormPopup = true;
		},
		
		closeFormPopup() {
			this.showFormPopup = false;
			this.resetFormData();
		},
		
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
		
		showSendTypePicker() {
			this.pickerConfig = {
				show: true,
				options: this.sendTypeOptions,
				currentField: 'sendType'
			};
		},
		
		closePicker() {
			this.pickerConfig.show = false;
		},
		
		onPickerConfirm(e) {
			try {
				const selectedText = e.text;
				const selectedValue = this.sendTypeMap[selectedText];
				this.closePicker();
				setTimeout(() => {
					this.formData.sendTypeText = selectedText;
					this.formData.sendType = selectedValue;
				}, 150);
			} catch (error) {
				console.error('选择器确认错误:', error);
				this.closePicker();
			}
		},
		
		downloadResult(recordId) {
			const record = this.applications.find(item => item.id === recordId);
			if (!record || !record.resultUrl) {
				uni.showToast({
					title: '暂无可下载文件',
					icon: 'none'
				});
				return;
			}
			uni.downloadFile({
				url: record.resultUrl,
				success: (res) => {
					if (res.statusCode === 200) {
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
		
		async submitForm() {
			if (!this.validateForm()) {
				return;
			}
			
			try {
				this.isSubmitting = true;
				const submitData = {
					title: this.formData.title,
					applicationFile: this.formData.applicationFile,
					applicationReason: this.formData.applicationReason,
					applicationAnnexes: this.formData.applicationAnnexes || '',
					sendType: this.formData.sendType,
					email: this.formData.email || '',
					address: this.formData.address || '',
					phone: this.formData.phone,
					remark: this.formData.remark || ''
				};
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
				this.closeFormPopup();
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
			if ((this.formData.sendType === '0' || this.formData.sendType === '2') && !this.formData.email) {
				uni.showToast({
					title: '请输入电子邮箱',
					icon: 'none'
				});
				return false;
			}
			if (this.formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) {
				uni.showToast({
					title: '请输入正确的邮箱格式',
					icon: 'none'
				});
				return false;
			}
			
			if ((this.formData.sendType === '1' || this.formData.sendType === '2') && !this.formData.address) {
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
		
		editApplication(app) {
			this.formMode = 'edit';
			this.currentEditId = app.id;
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
			this.showFormPopup = true;
		},
		
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
		
		mapStatus(statusValue) {
			const statusMap = {
				'0': 'pending',
				'1': 'completed',
				'2': 'rejected',
				'pending': 'pending',
				'completed': 'completed',
				'rejected': 'rejected',
				'sent': 'sent'
			};
			return statusMap[String(statusValue)] || 'pending';
		},
		
		getStatusText(statusValue) {
			const textMap = {
				'0': '待审核',
				'1': '已通过',
				'2': '已拒绝',
				'pending': '待审核',
				'completed': '已通过',
				'rejected': '已拒绝',
				'sent': '已发放'
			};
			return textMap[String(statusValue)] || '待审核';
		}
	}
}
