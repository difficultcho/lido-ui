<template>
	<view>
		<!-- 搜索区域 -->
		<div class="operation-bar">
			<el-input v-model="searchText" placeholder="请输入姓名搜索" clearable style="width: 300px; margin-right: 20px;"
				@input="handleSearch" />
			<el-button type="primary" @click="openDialog('add')">新增人员</el-button>
		</div>

		<!-- 表单对话框 -->
		<el-dialog :title="dialogType === 'add' ? '新增人员' : '编辑人员'" v-model="dialogVisible" width="30%">
			<el-form :model="form">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="年龄" prop="age">
					<el-input v-model="form.age"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="confirmForm">确认</el-button>
			</template>
		</el-dialog>

		<!-- 详情对话框 -->
		<el-dialog title="详细信息" v-model="detailDialogVisible" width="30%">
			<el-descriptions :column="1" border>
				<el-descriptions-item label="姓名">{{ currentDetail.name }}</el-descriptions-item>
				<el-descriptions-item label="年龄">{{ currentDetail.age }}</el-descriptions-item>
			</el-descriptions>
		</el-dialog>

		<!-- 删除确认对话框 -->
		<el-dialog title="提示" v-model="deleteDialogVisible" width="30%">
			<span>确认删除该记录吗？</span>
			<template #footer>
				<el-button @click="deleteDialogVisible = false">取消</el-button>
				<el-button type="danger" @click="confirmDelete">确认</el-button>
			</template>
		</el-dialog>

		<!-- 表格 -->
		<el-table :data="paginatedData" style="width: 100%">
			<el-table-column prop="name" label="姓名"></el-table-column>
			<el-table-column prop="age" label="年龄"></el-table-column>
			<el-table-column label="操作" width="200">
				<template #default="scope">
					<el-button size="small" @click="handleDetail(scope.row)">详情</el-button>
					<el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
					<el-button size="small" type="danger" @click="handleDelete(scope.row)">删除 </el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页 -->
		<el-pagination style="margin-top: 20px;" background layout="total, prev, pager, next"
			:total="filteredData.length" :page-size="pageSize" v-model:current-page="currentPage" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					name: '',
					age: ''
				},
				tableData: [{
						name: '张三',
						age: 18
					},
					{
						name: '李四',
						age: 25
					}
				],
				editingIndex: -1, // 新增编辑索引
				dialogVisible: false,
				deleteDialogVisible: false,
				detailDialogVisible: false,
				dialogType: 'add',
				currentDetail: {},
				deleteIndex: -1,
				deleteTarget: null, // 新增删除目标对象
				searchText: '',
				currentPage: 1,
				pageSize: 5
			};
		},
		computed: {
			filteredData() {
				return this.tableData.filter(item =>
					item.name.toLowerCase().includes(this.searchText.toLowerCase())
				);
			},
			paginatedData() {
				const start = (this.currentPage - 1) * this.pageSize;
				const end = start + this.pageSize;
				return this.filteredData.slice(start, end);
			}
		},
		methods: {
			handleSearch() {
				this.currentPage = 1; // 搜索后重置到第一页
			},
			openDialog(type) {
				this.dialogType = type;
				this.dialogVisible = true;
			},
			confirmForm() {
				if (this.dialogType === 'add') {
					this.tableData.push({
						...this.form
					});
				} else {
					if (this.editingIndex > -1) {
						this.tableData.splice(this.editingIndex, 1, {
							...this.form
						});
					}
				}
				this.resetForm();
				this.editingIndex = -1; // 重置索引
				this.dialogVisible = false;
			},
			handleEdit(row) {
				this.editingIndex = this.tableData.indexOf(row); // 直接获取索引
				this.form = {
					...row
				};
				this.openDialog('edit');
			},
			handleDelete(row) {
				this.deleteTarget = row;
				this.deleteDialogVisible = true;
			},
			confirmDelete() {
				const index = this.tableData.indexOf(this.deleteTarget);
				if (index > -1) {
					this.tableData.splice(index, 1);
				}
				this.deleteTarget = null;
				this.deleteDialogVisible = false;
			},
			handleDetail(row) {
				this.currentDetail = {
					...row
				};
				this.detailDialogVisible = true;
			},
			resetForm() {
				this.form = {
					name: '',
					age: ''
				};
			}
		}
	};
</script>

<style>
	/* 可根据需要添加自定义样式 */
	.el-dialog__body {
		padding: 20px;
	}

	.el-descriptions__label {
		width: 80px;
	}

	.operation-bar {
		margin: 10px 0;
	}
</style>