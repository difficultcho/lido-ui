<template>
	<view class="main-layout">
		<!-- 头部导航栏 -->
		<view class="header">
			<view class="left-section">
				<uni-icons type="bars" size="24" color="#333" @click="toggleSidebar"></uni-icons>
				<text class="title">{{ title + ' ' + userInfo.name }}</text>
			</view>
			<view class="right-section">
				<uni-icons type="person" size="24" color="#333" @click="login"></uni-icons>
				<uni-icons type="person" size="24" color="#333" @click="toLogout"></uni-icons>
			</view>
		</view>

		<!-- 侧边栏遮罩层 -->
		<view v-if="showSidebar && isMobile" class="sidebar-mask" @click="toggleSidebar"></view>

		<!-- 侧边栏菜单 -->
		<view class="sidebar" :class="{'sidebar-open': showSidebar, 'sidebar-mobile': isMobile}">
			<scroll-view scroll-y class="menu-scroll">
				<tree-menu :data="menuTree" :active-component="activeComponent" @item-click="handleMenuItemClick"
					@toggle-folder="handleFolderToggle" />
			</scroll-view>
		</view>

		<!-- 页面内容 -->
		<view class="content">
			<!-- 标签页标签头 -->
			<view class="tabs-bar">
				<scroll-view scroll-x class="tabs-scroll">
					<view v-for="(tab, index) in tabs" :key="tab.id" class="tab-item"
						:class="{ active: activeTabId === tab.id }" @click="switchTab(tab.id)">
						<text class="tab-title">{{ tab.title }}</text>
						<uni-icons type="close" size="14" class="close-icon" @click="closeTab(tab.id)"></uni-icons>
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
	import User from '@/components/content/User.vue'
	import Role from '@/components/content/Role.vue'
	import Order from '@/components/content/Order.vue'
	import TreeMenu from '@/components/treeMenu/treeMenu.vue'
	import {
		getMenu
	} from '@/api/query.js';
	import {
		mapMutations
	} from 'vuex';

	export default {
		props: {
			title: {
				type: String,
				default: '应用标题'
			}
		},
		components: {
			User,
			Role,
			Order,
			TreeMenu
		},
		data() {
			return {
				showSidebar: false,
				isMobile: false,

				activeComponent: '',

				tabs: [], // 打开的标签页
				activeTabId: null, // 当前激活的标签页ID

				menuTree: []
			}
		},
		computed: {
			userInfo() {
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
			...mapMutations(['logout']),
			checkPlatform() {
				// 根据屏幕宽度判断是否移动端
				const {
					windowWidth
				} = uni.getSystemInfoSync()
				this.isMobile = windowWidth <= 768
				// 初始化侧边栏状态
				this.showSidebar = !this.isMobile
			},
			login() {
				uni.navigateTo({
					url: '/pages/public/login'
				})
			},
			toLogout() {
				this.logout();
			},
			toggleSidebar() {
				this.showSidebar = !this.showSidebar
			},
			// 点击文件夹切换
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
			// 点击菜单打开页面
			handleMenuItemClick(item) {
				this.activeComponent = item.id
				const existingTab = this.tabs.find(tab =>
					tab.component === item.component
				)
				if (existingTab) {
					this.switchTab(existingTab.id)
				} else {
					this.openNewTab(item)
				}
			},
			// 打开新标签页
			openNewTab(menu) {
				const newTab = {
					id: menu.id,
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
				this.activeComponent = tabId
				let folder = this.findFolder(null, this.menuTree, tabId).filter(item => item);
				if (!folder[0].isOpen) {
					// TODO 需要完善，目前只打开分支上的第一级菜单
					this.handleFolderToggle(folder[0]);
				}
				
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
			// 找到触发开启的目录
			findFolder(parent, children, itemId) {
				for (let item of children) {
					if (item.isFolder) {
						if (item.children) {
							let ret = this.findFolder(item, item.children, itemId)
							if (ret) {
								return [parent, ...ret]
							}
						}
					} else {
						if (item.id == itemId) {
							return [parent]
						}
					}
				}
				return null;
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
			color: #3d2;
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