<template>
	<view>
		<el-form :model="form">
			<el-form-item label="姓名" prop="name">
				<el-input v-model="form.name"></el-input>
			</el-form-item>
			<el-form-item label="年龄" prop="age">
				<el-input v-model="form.age"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">提交</el-button>
			</el-form-item>
		</el-form>

		<el-table :data="tableData">
			<el-table-column prop="name" label="姓名"></el-table-column>
			<el-table-column prop="age" label="年龄"></el-table-column>
			<el-table-column label="操作">
				<template #default="scope">
					<el-button @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button @click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
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
				]
			};
		},
		methods: {
			onSubmit() {
				this.tableData.push({
					...this.form
				});
				this.form.name = '';
				this.form.age = '';
			},
			handleEdit(index, row) {
				this.form = {
					...row
				};
				this.tableData.splice(index, 1);
			},
			handleDelete(index, row) {
				this.tableData.splice(index, 1);
			}
		}
	};
</script>

<style>
	/* Add any custom styles here */
</style>