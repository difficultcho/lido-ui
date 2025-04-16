<template>
	<view class="main-layout">
		<!-- 头部导航栏 -->
		<view class="header">
			<view class="left-section">
				<uni-icons type="bars" size="24" color="#333" @click="toggleSidebar"></uni-icons>
				<text class="title">{{ title }}</text>
			</view>
			<view class="right-section">
				<uni-icons type="person" size="24" color="#333" @click="showLogoutDrawer"></uni-icons>
			</view>
		</view>

		<!-- 登出 -->
		<uni-drawer class="logoutDrawer" ref="showRight" mode="right" :mask-click="true">
			<text>{{ '用户 ' + userInfo.name + ' 登出' }}</text>
			<button type="default" @click="toLogout()">退出登录</button>
		</uni-drawer>

		<!-- 侧边栏遮罩层 -->
		<view v-if="showSidebar && isMobile" class="sidebar-mask" @click="toggleSidebar"></view>

		<!-- 侧边栏菜单 -->
		<!-- <view class="sidebar" :class="{'sidebar-open': showSidebar, 'sidebar-mobile': isMobile}">
			<scroll-view scroll-y class="menu-scroll">
				<tree-menu :data="menuTree" :active-component="activeComponent" @item-click="handleMenuItemClick"
					@toggle-folder="handleFolderToggle" />
			</scroll-view>
		</view> -->
		<view class="sidebar" :class="{'sidebar-open': showSidebar, 'sidebar-mobile': isMobile}">
			<scroll-view scroll-y class="menu-scroll">
				<!-- 替换为 Element Tree -->
				<el-tree ref="menuTreeRef" :instance="true" :data="processedMenuTree" :props="treeProps"
					:expand-on-click-node="false" :current-node-key="activeComponent" node-key="id"
					@node-click="handleTreeNodeClick">
					<template #default="{ node, data }">
						<view class="custom-tree-node">
							<uni-icons v-if="data.isFolder" :type="node.expanded ? 'folder-open' : 'folder'" size="16"
								class="folder-icon" />
							<text :class="['menu-text', { active: activeComponent === data.id }]">
								{{ node.label }}
							</text>
						</view>
					</template>
				</el-tree>
			</scroll-view>
		</view>





		<!-- 页面内容 -->
		<view class="content">
			<view style="margin-bottom: 20px">
				<el-button size="small" @click="addTab(editableTabsValue)">
					add tab
				</el-button>
			</view>
			<el-tabs v-model="editableTabsValue" type="card" class="demo-tabs" closable @tab-remove="removeTab2">
<!-- 				<el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name">
					{{ item.content }}
				</el-tab-pane> -->
<!-- 				<keep-alive>
					<template v-for="tab in tabs" :key="tab.id">
						<view v-show="activeTabId === tab.id">
							<component :is="tab.component" :ref="`tabContent_${tab.id}`" />
						</view>
					</template>
				</keep-alive> -->
				<keep-alive>
					<el-tab-pane v-for="tab in tabs" :key="tab.id" :label="tab.title" :name="tab.id">
						<view v-show="activeTabId === tab.id">
							<component :is="tab.component" :ref="`tabContent_${tab.id}`" />
						</view>
					</el-tab-pane>
				</keep-alive>
			</el-tabs>
			<!-- 标签页标签头 -->
<!-- 			<view class="tabs-bar">
				<scroll-view scroll-x class="tabs-scroll">
					<view v-for="(tab, index) in tabs" :key="tab.id" class="tab-item"
						:class="{ active: activeTabId === tab.id }" @click="switchTab(tab.id)">
						<text class="tab-title">{{ tab.title }}</text>
						<uni-icons type="close" size="14" class="close-icon" @click="closeTab(tab.id)"></uni-icons>
					</view>
				</scroll-view>
			</view> -->
			<!-- 标签页内容 -->
<!-- 			<view class="tabs-content">
				<keep-alive>
					<template v-for="tab in tabs" :key="tab.id">
						<view v-show="activeTabId === tab.id">
							<component :is="tab.component" :ref="`tabContent_${tab.id}`" />
						</view>
					</template>
				</keep-alive>
			</view> -->
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
	import {
		ElTree
	} from 'element-plus'
	import {
		ref
	} from 'vue'


	export default {
		props: {
			title: {
				type: String,
				default: 'CRM demo'
			}
		},
		components: {
			User,
			Role,
			Order,
			TreeMenu,
			ElTree,
		},
		data() {
			return {
				showSidebar: false,
				isMobile: false,

				activeComponent: '',

				tabs: [], // 打开的标签页
				activeTabId: null, // 当前激活的标签页ID

				menuTree: [],
				treeProps: {
					label: 'title',
					children: 'children'
				},


				tabIndex: 2,
				editableTabsValue: ref('2'),
				editableTabs: ref([{
						title: 'Tab 1',
						name: '1',
						content: 'Tab 1 content',
					},
					{
						title: 'Tab 2',
						name: '2',
						content: 'Tab 2 content',
					},
				])
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			},
			// 转换菜单数据结构
			processedMenuTree() {
				const convert = items => items.map(item => ({
					...item,
					title: item.title,
					children: item.isFolder ? convert(item.children || []) : null
				}))
				return convert(this.menuTree)
			}
		},
		mounted() {
			if (!this.userInfo.name) {
				uni.navigateTo({
					url: '/pages/public/login'
				})
			}
			this.checkPlatform()
			uni.$on('toggleSidebar', this.toggleSidebar)

			this.$nextTick(() => {
				const tree = this.$refs.menuTreeRef
				console.log('Tree 方法列表:', Object.keys(tree?.$ || {}))
			})
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
			showLogoutDrawer() {
				this.$refs.showRight.open();
			},
			toLogout() {
				this.logout();
				uni.navigateTo({
					url: '/'
				})
			},
			toggleSidebar() {
				this.showSidebar = !this.showSidebar
			},
			// 点击文件夹切换
			handleFolderToggleaaa(currentItem) {
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
			},









			handleTreeNodeClick(data, node) {
				if (data.isFolder) {
					this.toggleFolder(data)
				} else {
					this.activeComponent = data.id
					const existingTab = this.tabs.find(tab =>
						tab.component === data.component
					)
					if (existingTab) {
						this.switchTab(existingTab.id)
					} else {
						this.openNewTab(data)
					}
				}
			},

			toggleFolder(data) {
				// 方式一：尝试调用官方 API
				const tree = this.getTreeInstance()
				if (tree?.toggleNodeExpansion) {
					tree.toggleNodeExpansion(data)
				}
				// 方式二：手动控制状态
				else {
					const node = tree?.getNode(data.id)
					if (node) {
						this.$set(node, 'expanded', !node.expanded)
					}
				}

				// 关闭其他同级目录
				const closeSiblings = (items) => {
					items.forEach(item => {
						if (item.isFolder && item.id !== data.id) {
							const treeNode = this.$refs.menuTreeRef.getNode(item.id)
							if (treeNode && treeNode.expanded) {
								this.$set(treeNode, 'expanded', false)
							}
						}
					})
				}
				closeSiblings(this.menuTree)
			},

			findParent(targetId, items = this.menuTree) {
				for (const item of items) {
					if (item.children?.some(child => child.id === targetId)) return item
					if (item.children) {
						const found = this.findParent(targetId, item.children)
						if (found) return found
					}
				}
				return null
			},

			// 安全的组件实例获取
			getTreeInstance() {
				const ref = this.$refs.menuTreeRef
				// 处理 Vue 3 的 ref 包装
				return ref?.$el ? ref : ref?.value
			},

			// 修改后的文件夹切换方法
			handleFolderTogglebbb(currentItem) {
				const closeSiblings = (items) => {
					items.forEach(item => {
						if (item.isFolder && item !== currentItem) {
							const treeNode = this.$refs.menuTreeRef.getNode(item)
							if (treeNode && treeNode.expanded) {
								this.$refs.menuTreeRef.store.setExpanded(treeNode, false)
							}
						}
					})
				}
				closeSiblings(this.menuTree)
			},

			// 切换标签页
			// switchTab(tabId) {
			// 	this.activeComponent = tabId
			// 	let folder = this.findFolder(null, this.menuTree, tabId).filter(item => item);
			// 	if (!folder[0].isOpen) {
			// 		// TODO 需要完善，目前只打开分支上的第一级菜单
			// 		this.handleFolderToggle(folder[0]);
			// 	}

			// 	this.activeTabId = tabId
			// 	// 触发组件的激活事件（如果需要）
			// 	const ref = this.$refs[`tabContent_${tabId}`]?.[0]
			// 	if (ref && ref.onTabActivate) {
			// 		ref.onTabActivate()
			// 	}
			// },
			// 修改后的切换标签页方法
			switchTab(tabId) {
				const findNodePath = (node) => {
					const path = []
					let current = this.$refs.menuTreeRef.getNode(tabId)
					while (current) {
						path.unshift(current.data)
						current = current.parent
					}
					return path.filter(item => item.isFolder)
				}


				// 关闭其他同级目录
				const closeSiblings = (items) => {
					items.forEach(item => {
						if (item.isFolder) {
							const treeNode = this.$refs.menuTreeRef.getNode(item.id)
							if (treeNode && treeNode.expanded) {
								this.$set(treeNode, 'expanded', false)
							}
						}
					})
				}

				if (!this.tabs.find(tab => tab.id === tabId) && this.tabs.length > 0) {
					tabId = this.tabs[this.tabs.length - 1].id;
				}

				closeSiblings(this.menuTree)


				// 展开所有父级目录
				const folders = findNodePath()
				folders.forEach(folder => {
					const node = this.$refs.menuTreeRef.getNode(folder.id)
					if (node && !node.expanded) {
						//this.$refs.menuTreeRef.store.setExpanded(node, true)
						this.$set(node, 'expanded', !node.expanded)
					}
				})

				this.activeTabId = tabId
				this.activeComponent = tabId
			},

			addTab(targetName) {
				const newTabName = `${++this.tabIndex}`
				this.editableTabs.push({
					title: 'New Tab',
					name: newTabName,
					content: 'New Tab content',
				})
				this.editableTabsValue = newTabName
			},
			removeTab(targetName) {
				debugger
				const tabs = this.editableTabs
				let activeName = this.editableTabsValue
				if (activeName === targetName) {
					tabs.forEach((tab, index) => {
						if (tab.name === targetName) {
							const nextTab = tabs[index + 1] || tabs[index - 1]
							if (nextTab) {
								activeName = nextTab.name
							}
						}
					})
				}

				this.editableTabsValue = activeName
				this.editableTabs = tabs.filter((tab) => tab.name !== targetName)
			},
			removeTab2(targetName) {
				debugger
				const tabs = this.tabs
				let activeTabId = this.activeTabId
				if (activeTabId === targetName) {
					tabs.forEach((tab, index) => {
						if (tab.id === targetName) {
							const nextTab = tabs[index + 1] || tabs[index - 1]
							if (nextTab) {
								activeTabId = nextTab.id
							}
						}
					})
				}
			
				this.activeTabId = activeTabId
				this.tabs = tabs.filter((tab) => tab.id !== targetName)
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

	.logoutDrawer {
		margin-top: 60px;
	}

	@media (max-width: 768px) {
		.content {
			margin-left: 0 !important;
		}
	}









	/* 自定义树形菜单样式 */
	:deep(.el-tree) {
		background: transparent;
		color: #333;

		.el-tree-node {
			padding: 0 0;

			&:focus>.el-tree-node__content {
				background-color: transparent;
			}

			.el-tree-node__content {
				height: 40px;
				transition: background 0.2s;

				&:hover {
					background: #f5f5f5;
				}
			}

			&.is-current>.el-tree-node__content {
				background: #e8f4ff;

				.menu-text {
					color: #1890ff;
				}
			}
		}
	}

	.custom-tree-node {
		display: flex;
		align-items: center;
		padding-left: 8px;

		.folder-icon {
			margin-right: 8px;
			color: #666;
		}

		.menu-text {
			font-size: 14px;
			transition: color 0.2s;

			&.active {
				color: #1890ff;
				font-weight: 500;
			}
		}
	}
</style>