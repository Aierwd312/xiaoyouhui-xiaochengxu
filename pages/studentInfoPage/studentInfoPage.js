export default {
	data() {
		return {
			// 导航栏配置
			navBackground: '#F0F4F8', // 导航栏背景色 - 与页面背景色保持一致
			navTitleColor: '#004299', // 导航栏标题颜色 - 重财蓝，在浅色背景上使用深色文字
			
			// 表单数据
			formData: {
				enrollmentType: '', // 入校类型
				enrollmentDept: '', // 入校院系
				studentId: '' // 学号（选填）
			},
			
			// 入校类型选择器
			typePickerShow: false, // 控制入校类型选择器显示
			typeOptions: ['本科', '硕士研究生', '博士研究生', '专升本', '其他'],
			
			// 院系选择器
			deptPickerShow: false, // 控制院系选择器显示
			// 院系数据 - 联动格式
			deptOptions: [
				{
					text: '会计学院',
					value: '01',
					children: [
						{ text: '会计学', value: '01-01' },
						{ text: '财务管理', value: '01-02' },
						{ text: '审计学', value: '01-03' }
					]
				},
				{
					text: '金融学院',
					value: '02',
					children: [
						{ text: '金融学', value: '02-01' },
						{ text: '投资学', value: '02-02' },
						{ text: '保险学', value: '02-03' }
					]
				},
				{
					text: '工商管理学院',
					value: '03',
					children: [
						{ text: '市场营销', value: '03-01' },
						{ text: '人力资源管理', value: '03-02' },
						{ text: '物流管理', value: '03-03' }
					]
				},
				{
					text: '经济学院',
					value: '04',
					children: [
						{ text: '经济学', value: '04-01' },
						{ text: '国际经济与贸易', value: '04-02' }
					]
				},
				{
					text: '法学院',
					value: '05',
					children: [
						{ text: '法学', value: '05-01' },
						{ text: '知识产权', value: '05-02' }
					]
				},
				{
					text: '信息学院',
					value: '06',
					children: [
						{ text: '计算机科学与技术', value: '06-01' },
						{ text: '软件工程', value: '06-02' },
						{ text: '信息管理与信息系统', value: '06-03' }
					]
				},
				{
					text: '外国语学院',
					value: '07',
					children: [
						{ text: '英语', value: '07-01' },
						{ text: '商务英语', value: '07-02' }
					]
				},
				{
					text: '统计学院',
					value: '08',
					children: [
						{ text: '统计学', value: '08-01' },
						{ text: '应用统计学', value: '08-02' }
					]
				},
				{
					text: '国际商学院',
					value: '09',
					children: [
						{ text: '国际商务', value: '09-01' },
						{ text: '跨境电子商务', value: '09-02' }
					]
				}
			]
		}
	},
	onLoad() {
		// 页面加载时的逻辑
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
		 * 显示入校类型选择器
		 */
		showTypePicker() {
			this.typePickerShow = true;
		},
		
		/**
		 * 选择入校类型
		 * @param {Object} e 选择事件对象，包含选中项的数据
		 */
		selectType(e) {
			console.log('选择的入校类型:', e);
			this.formData.enrollmentType = e.text;
			this.typePickerShow = false;
		},
		
		/**
		 * 显示入校院系选择器
		 */
		showDeptPicker() {
			this.deptPickerShow = true;
		},
		
		/**
		 * 选择入校院系
		 * @param {Object} e 选择事件对象，包含选中项的数据
		 */
		selectDept(e) {
			console.log('选择的入校院系:', e);
			// 组合学院和专业名称
			this.formData.enrollmentDept = `${e.text[0]}-${e.text[1]}`;
			this.deptPickerShow = false;
		},
		
		/**
		 * 提交表单
		 */
		submitForm() {
			// 表单验证
			if (!this.formData.enrollmentType) {
				uni.showToast({
					title: '请选择入校类型',
					icon: 'none'
				});
				return;
			}
			
			if (!this.formData.enrollmentDept) {
				uni.showToast({
					title: '请选择入校院系',
					icon: 'none'
				});
				return;
			}
			
			// 学号为选填，不做必填验证
			
			// 提交数据
			console.log('提交的数据:', this.formData);
			
			// 模拟提交成功
			uni.showLoading({
				title: '提交中...'
			});
			
			setTimeout(() => {
				uni.hideLoading();
				uni.showToast({
					title: '提交成功',
					icon: 'success',
					duration: 2000,
					success: () => {
						// 延迟返回上一页
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							});
						}, 2000);
					}
				});
			}, 1500);
		}
	}
}
