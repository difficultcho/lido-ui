<template>
	<view>
		<view v-for="item in data" :key="item.id" class="menu-node">
			<!-- 目录/菜单项 -->
			<view :class="['menu-item', {'is-folder': item.isFolder, 'is-active': activeComponent === item.component}]"
			    :style="{ paddingLeft: 16 + level * 20 + 'px' }" @click="item.isFolder ? toggleFolder(item) : $emit('item-click', item)">
				<!-- 折叠图标（改用旋转动画） -->
				<uni-icons v-if="item.isFolder" type="arrowright" size="14"
					class="folder-icon" :class="{ 'is-open': item.isOpen }" />

				<!-- 菜单图标 -->
				<uni-icons :type="item.icon || 'circle'" size="16" class="menu-icon" />

				<!-- 菜单文本 -->
				<text class="menu-text">{{ item.title }}</text>
			</view>

			<!-- 递归子菜单（添加高度过渡） -->
			<template v-if="item.isFolder">
				<view class="submenu" :style="{ maxHeight: item.isOpen ? '1000px' : '0' }">
					<tree-menu v-if="item.children?.length" :data="item.children" :level="level + 1"
						:active-component="activeComponent" @item-click="$emit('item-click', $event)" @toggle-folder="$emit('toggle-folder', $event)" />
				</view>
			</template>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'TreeMenu',
		props: {
			data: Array,
			level: {
				type: Number,
				default: 0
			},
			activeComponent: String
		},
		methods: {
			toggleFolder(item) {
				this.$emit('toggle-folder', item)
			}
		}
	}
</script>

<style scoped>
/* 子菜单过渡效果 */
.submenu {
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 文件夹图标旋转动画 */
.folder-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.folder-icon.is-open {
  transform: rotate(90deg);
}
</style>