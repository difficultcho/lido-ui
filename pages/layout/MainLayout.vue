<template>
	<view class="main-layout">
		<!-- 头部导航栏 -->
		<view class="header">
			<view class="left-section">
				<uni-icons type="bars" size="24" color="#333" @click="toggleSidebar"></uni-icons>
				<text class="title">{{ title }}</text>
			</view>
			<view class="right-section">
				<uni-icons type="person" size="24" color="#333" @click="toLogin"></uni-icons>
			</view>
		</view>

		<!-- 侧边栏遮罩层 -->
		<view v-if="showSidebar && isMobile" class="sidebar-mask" @click="toggleSidebar"></view>

		<!-- 侧边栏菜单 -->
		<view class="sidebar" :class="{
        'sidebar-open': showSidebar,
        'sidebar-mobile': isMobile
      }">
			<scroll-view scroll-y class="menu-scroll">
				<view v-for="(item, index) in menuItems" :key="index" class="menu-item" :class="{ active: x() }"
					@click="switchContent(item)">
					<uni-icons :type="item.icon" size="18"></uni-icons>
					<text class="menu-text">{{ item.text }}</text>
				</view>
			</scroll-view>
		</view>

		<!-- 页面内容 -->
		<view class="content">
			<!-- 动态组件容器 -->
			<view class="content-wrapper">
				<component :is="activeComponent" :key="componentKey" class="content-component" />
			</view>
		</view>
	</view>
</template>

<script>
import Home from '@/components/content/Home.vue'
import User from '@/components/content/User.vue'
import Order from '@/components/content/Order.vue'

	export default {
		props: {
			title: {
				type: String,
				default: '应用标题'
			}
		},
		data() {
			return {
				showSidebar: false,
				isMobile: false,

				activeComponent: 'Home',
				componentKey: 0,
				menuItems: [{
						text: '首页',
						name: 'Home',
						icon: 'home'
					},
					{
						text: '用户管理',
						name: 'User',
						icon: 'person'
					},
					{
						text: '订单管理',
						name: 'Order',
						icon: 'cart'
					}
				]
			}
		},
		mounted() {
			this.checkPlatform()
			uni.$on('toggleSidebar', this.toggleSidebar)
		},
		beforeDestroy() {
			uni.$off('toggleSidebar', this.toggleSidebar)
		},
		components: {
		    Home,
		    User,
		    Order
		},
		methods: {
			x() {
				return false;
			},
			toLogin() {
				uni.navigateTo({
					url: '/pages/public/login'
				})
			},
			toggleSidebar() {
				this.showSidebar = !this.showSidebar
			},
			checkPlatform() {
				// 根据屏幕宽度判断是否移动端
				const {
					windowWidth
				} = uni.getSystemInfoSync()
				this.isMobile = windowWidth <= 768
				// 初始化侧边栏状态
				this.showSidebar = !this.isMobile
			},
			switchContent(item) {
				if (this.activeComponent === item.name) return

				// 添加切换动画
				uni.showLoading({
					title: '加载中',
					mask: true
				})

				this.activeComponent = item.name
				this.componentKey++ // 强制刷新组件

				// 模拟加载延迟
				setTimeout(() => {
					uni.hideLoading()
				}, 300)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main-layout {
		height: 100vh;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.header {
		height: 60px;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		z-index: 1000;

		.left-section {
			display: flex;
			align-items: center;
			gap: 15px;

			.title {
				font-size: 18px;
				font-weight: bold;
			}
		}

		.right-section {
			display: flex;
			align-items: center;
			gap: 15px;
		}
	}

	.sidebar {
		width: 240px;
		background: #fff;
		box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease;
		position: fixed;
		left: 0;
		top: 60px;
		bottom: 0;
		z-index: 999;

		&.sidebar-mobile {
			transform: translateX(-100%);
			top: 0;
			height: 100vh;
		}

		&.sidebar-open {
			transform: translateX(0);
		}

		.menu-scroll {
			height: 100%;
			padding: 15px 0;
		}

		.menu-item {
			display: flex;
			align-items: center;
			padding: 12px 20px;
			gap: 12px;
			cursor: pointer;
			transition: background 0.2s;

			&:hover {
				background: #f5f5f5;
			}

			&.active {
				background: #e8f4ff;
				color: #1890ff;
				border-right: 3px solid #1890ff;
			}

			.menu-text {
				font-size: 14px;
			}
		}
	}

	.sidebar-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 998;
	}

	.content {
		flex: 1;
		padding: 20px;
		transition: margin-left 0.3s ease;
		margin-left: 240px;
		overflow-y: auto;

		&.content-shift {
			margin-left: 240px;
		}
	}

	@media (max-width: 768px) {
		.content {
			margin-left: 0 !important;
		}
	}
</style>