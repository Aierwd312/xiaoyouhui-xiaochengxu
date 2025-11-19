<script>
	import { getToken } from '@/utils/auth'
	import store from '@/store'
	
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 检查登录状态
			this.checkLoginStatus()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			// 检查登录状态
			checkLoginStatus() {
				const token = getToken()
				console.log('检查登录状态，token:', token)
				
				if (token) {
					// 如果有token，尝试获取用户信息以验证token有效性
					store.dispatch('GetInfo').then(() => {
						console.log('自动登录成功，用户信息已恢复')
						// 不需要跳转，保持当前页面
					}).catch((error) => {
						console.log('Token已过期，需要重新登录', error)
						// Token无效，清除本地存储
						store.dispatch('LogOut')
					})
				} else {
					console.log('未找到登录信息')
					// 没有token，不做任何操作，让各个页面自己处理登录检查
				}
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>