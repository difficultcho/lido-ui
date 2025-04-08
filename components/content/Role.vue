<template>
  <div>
    <el-form :model="form">
      <el-form-item label="Name" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="Age" prop="age">
        <el-input v-model="form.age"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData">
      <el-table-column prop="name" label="Name"></el-table-column>
      <el-table-column prop="age" label="Age"></el-table-column>
      <el-table-column label="Operations">
        <template #default="scope">
          <el-button @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        age: ''
      },
      tableData: [
        {
          name: 'John Doe',
          age: 18
        },
        {
          name: 'Jane Smith',
          age: 25
        }
      ]
    };
  },
  methods: {
    onSubmit() {
      this.tableData.push({ ...this.form });
      this.form.name = '';
      this.form.age = '';
    },
    handleEdit(index, row) {
      this.form = { ...row };
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