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
		<view class="sidebar" :class="{'sidebar-open': showSidebar, 'sidebar-mobile': isMobile}">
			<scroll-view scroll-y class="menu-scroll">
				<!-- <view v-for="(item, index) in menuItems" :key="index" class="menu-item" :class="{ active: isActiveMenu(item) }"
					@click="handleMenuClick(item)">
					<uni-icons :type="item.icon" size="18"></uni-icons>
					<text class="menu-text">{{ item.title }}</text>
				</view> -->
				<tree-menu :data="menuTree" :active-component="activeComponent" @item-click="handleMenuItemClick"
					@toggle-folder="handleFolderToggle" />
			</scroll-view>
		</view>

		<!-- 页面内容 -->
		<view class="content">
			<!-- 动态组件容器 -->
			<!-- 			<view class="content-wrapper">
				{{contentParams}}
				<keep-alive :include="cachedComponents">
					<component :is="activeComponent" :key="componentKey" class="content-component" />
				</keep-alive>
			</view> -->




			<!-- 标签页导航 -->
			<view class="tabs-bar">
				<scroll-view scroll-x class="tabs-scroll">
					<view v-for="(tab, index) in tabs" :key="tab.id" class="tab-item"
						:class="{ active: activeTabId === tab.id }" @click="switchTab(tab.id)">
						<text class="tab-title">{{ tab.title }}</text>
						<uni-icons type="close" size="14" class="close-icon" @click.stop="closeTab(tab.id)"></uni-icons>
					</view>
				</scroll-view>
			</view>
			<!-- 标签页内容 -->
			<view class="tabs-content">
				<keep-alive>
					<template v-for="tab in tabs" :key="tab.id">
						<view v-show="activeTabId === tab.id">
							<component :is="tab.component" :ref="`tabContent_${tab.id}`" />
						</view>
					</template>
				</keep-alive>
			</view>


		</view>
	</view>
</template>

<script>
	import Home from '@/components/content/Home.vue'
	import User from '@/components/content/User.vue'
	import Order from '@/components/content/Order.vue'
	import {
		getMenu
	} from '@/api/member.js';
	import TreeMenu from '@/components/treeMenu/treeMenu.vue'

	export default {
		props: {
			title: {
				type: String,
				default: '应用标题'
			}
		},
		components: {
			Home,
			User,
			Order,
			TreeMenu
		},
		data() {
			return {
				showSidebar: false,
				isMobile: false,

				activeComponent: 'Home',
				componentKey: 0,
				menuItems: [],
				cachedComponents: ['Home', 'User'], // 需要缓存的组件名

				tabs: [], // 打开的标签页
				activeTabId: null, // 当前激活的标签页ID
				nextTabId: 1, // 下一个标签页ID


				menuTree: []
			}
		},
		computed: {
			contentParams() {
				return this.$store.state.userInfo
			}
		},
		mounted() {
			this.checkPlatform()
			uni.$on('toggleSidebar', this.toggleSidebar)
		},
		beforeDestroy() {
			uni.$off('toggleSidebar', this.toggleSidebar)
		},
		async created() {
			const res = await getMenu()



			this.menuTree = res.map(item => ({
				...item
			}))
		},
		methods: {
			isActiveMenu(item) {
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

				const start = Date.now()

				this.$nextTick(() => {
					const duration = Date.now() - start
					if (duration > 1000) {
						console.warn(`组件 ${item.name} 加载耗时过长: ${duration}ms`)
					}
				})
			},










			// 点击菜单项打开新标签
			handleMenuClick(menu) {
				const existingTab = this.tabs.find(tab =>
					tab.component === menu.component
				)

				if (existingTab) {
					this.switchTab(existingTab.id)
				} else {
					this.openNewTab(menu)
				}
			},

			// 打开新标签页
			openNewTab(menu) {
				const newTab = {
					id: `tab_${this.nextTabId++}`,
					title: menu.title,
					component: menu.component,
					keepAlive: menu.keepAlive || false,
					timestamp: Date.now()
				}

				this.tabs = [...this.tabs, newTab]
				this.activeTabId = newTab.id
			},

			// 切换标签页
			switchTab(tabId) {
				this.activeTabId = tabId
				// 触发组件的激活事件（如果需要）
				const ref = this.$refs[`tabContent_${tabId}`]?.[0]
				if (ref && ref.onTabActivate) {
					ref.onTabActivate()
				}
			},

			// 关闭标签页
			closeTab(tabId) {
				const index = this.tabs.findIndex(tab => tab.id === tabId)
				if (index === -1) return

				const newTabs = this.tabs.filter(tab => tab.id !== tabId)
				this.tabs = newTabs

				// 自动切换标签逻辑
				if (this.activeTabId === tabId) {
					if (newTabs.length > 0) {
						this.activeTabId = newTabs[Math.max(0, index - 1)].id
					} else {
						this.activeTabId = null
					}
				}
			},

			// 处理文件夹切换
			handleFolderToggle(currentItem) {
				const closeSiblings = (items) => {
					items.forEach(item => {
						if (item.isFolder && item !== currentItem) {
							this.$set(item, 'isOpen', false)
							if (item.children) closeSiblings(item.children)
						}
					})
				}

				// 切换当前目录状态
				this.$set(currentItem, 'isOpen', !currentItem.isOpen)
				// 关闭其他同级目录
				closeSiblings(this.menuTree)
			},

			// 处理菜单点击
			handleMenuItemClick(item) {
				this.activeComponent = item.component
				
				this.handleMenuClick(item);
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

	.tabs-bar {
		height: 40px;
		background: #f5f5f5;
		border-bottom: 1px solid #ddd;
	}

	.tabs-scroll {
		white-space: nowrap;
		height: 100%;
	}

	.tab-item {
		display: inline-flex;
		align-items: center;
		height: 100%;
		padding: 0 20px;
		border-right: 1px solid #ddd;
		background: #fff;
		position: relative;

		&.active {
			background: #fff;
			border-bottom: 2px solid #1890ff;
		}

		.tab-title {
			max-width: 120px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.close-icon {
			margin-left: 8px;
			padding: 4px;
			border-radius: 50%;
			transition: background 0.2s;

			&:hover {
				background: #f0f0f0;
			}
		}
	}

	.tabs-content {
		height: calc(100vh - 100px);
		/* 根据实际布局调整 */
		overflow: auto;
	}

	@media (max-width: 768px) {
		.content {
			margin-left: 0 !important;
		}
	}
</style>