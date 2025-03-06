<template>
	<div>
		<button @click="fetchData">Get Data</button>
		<button @click="gotoLogin">去登录</button>
		<pre v-if="response">{{ response }}</pre>
	</div>
</template>

<script>
	import { mapState } from 'vuex';
	
	export default {
		data() {
			return {
				response: null,
			};
		},
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		methods: {
			async fetchData() {
				try {
					uni.request({
						url: 'http://localhost:8080/user/page',
						method: 'GET',
						success: res => {
							console.log(res.data);
							this.response = JSON.stringify(res.data, null, 2);
						},
						fail: err => {
							console.error('请求接口失败：', err);
						},
						complete: () => {
							// 无论请求成功或失败都会执行
							console.log('请求完成');
						}
					});
				} catch (error) {
					this.response = `Error: ${error.message}`;
				}
			},
			gotoLogin() {
				uni.navigateTo({  
					url: '/pages/public/login'
				})
			}
		},
	};
</script>

<style>
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}
</style>