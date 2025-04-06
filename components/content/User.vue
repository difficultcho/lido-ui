<template>
	<view>
	    <van-button type="primary" @click="handleClick">Click Me</van-button>
	</view>
	<view class="container">
		<!-- 操作栏 -->
		<view class="action-bar">
			<button type="primary" @click="openDialog('add')">新增</button>
		</view>

		<!-- 数据列表 -->
		<scroll-view scroll-y class="list-container">
			<view class="list-item" v-for="(item, index) in listData" :key="item.id">
				<view class="item-content">
					<text class="title">{{ item.title }}</text>
					<text class="desc">{{ item.description }}</text>
				</view>
				<view class="item-actions">
					<button size="mini" @click="openDialog('edit', item)">编辑</button>
					<button size="mini" type="warn" @click="deleteItem(item.id)">删除</button>
				</view>
			</view>
		</scroll-view>

		<!-- 新增/编辑弹窗 -->
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog mode="base" :title="dialogType === 'add' ? '新增条目' : '编辑条目'">
				<view class="form-container">
					<uni-forms ref="form" :modelValue="formData">
						<uni-forms-item label="标题" name="title" required>
							<uni-easyinput v-model="formData.title" placeholder="请输入标题" />
						</uni-forms-item>
						<uni-forms-item label="描述" name="description">
							<uni-easyinput type="textarea" v-model="formData.description" placeholder="请输入描述" />
						</uni-forms-item>
					</uni-forms>
				</view>
				<view class="dialog-btns">
					<button @click="closeDialog">取消</button>
					<button type="primary" @click="handleSubmit">确认</button>
				</view>
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				listData: [{
						id: 1,
						title: '示例条目1',
						description: '这是第一个示例条目'
					},
					{
						id: 2,
						title: '示例条目2',
						description: '这是第二个示例条目'
					},
				], // 列表数据
				dialogType: 'add', // 弹窗类型（add/edit）
				formData: { // 表单数据
					id: '',
					title: '',
					description: ''
				},
				currentIndex: -1 // 当前操作的索引
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			}
		},
		methods: {
			handleClick() {
			      uni.showToast({ title: 'Button clicked!' });
			    },
			// 打开弹窗
			openDialog(type, item) {
				this.dialogType = type
				if (type === 'edit' && item) {
					this.formData = {
						...item
					}
				} else {
					this.formData = {
						id: '',
						title: '',
						description: ''
					}
				}
				this.$refs.popup.open()
			},

			// 关闭弹窗
			closeDialog() {
				this.$refs.popup.close()
			},

			// 提交表单
			handleSubmit() {
				this.$refs.form.validate().then(res => {
					if (this.dialogType === 'add') {
						// 新增操作
						const newItem = {
							...this.formData,
							id: Date.now() // 生成唯一ID
						}
						this.listData.push(newItem)
					} else {
						// 编辑操作
						const index = this.listData.findIndex(item => item.id === this.formData.id)
						if (index > -1) {
							this.listData.splice(index, 1, {
								...this.formData
							})
						}
					}
					this.closeDialog()
					uni.showToast({
						title: '操作成功',
						icon: 'success'
					})
				}).catch(err => {
					console.log('表单验证失败:', err)
				})
			},

			// 删除条目
			deleteItem(id) {
				uni.showModal({
					title: '提示',
					content: '确定要删除该条目吗？',
					success: res => {
						if (res.confirm) {
							this.listData = this.listData.filter(item => item.id !== id)
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							})
						}
					}
				})
			}
		}
	}
</script>

<style scoped>
	.container {
		padding: 20rpx;
	}

	.action-bar {
		margin-bottom: 20rpx;
	}

	.list-container {
		height: calc(100vh - 120rpx);
	}

	.list-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		border-bottom: 1rpx solid #eee;
	}

	.item-content {
		flex: 1;
		margin-right: 20rpx;
	}

	.title {
		display: block;
		font-size: 32rpx;
		color: #333;
	}

	.desc {
		display: block;
		font-size: 28rpx;
		color: #666;
	}

	.item-actions button {
		margin-left: 10rpx;
	}

	.form-container {
		padding: 20rpx;
	}

	.dialog-btns {
		display: flex;
		justify-content: flex-end;
		margin-top: 20rpx;
	}

	.dialog-btns button {
		margin-left: 20rpx;
	}
</style>