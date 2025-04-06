<template>
  <div class="container">
    <!-- Header with Search and Add Button -->
    <div class="header-actions">
      <van-search
        v-model="searchQuery"
        placeholder="Search by task name or status"
        shape="round"
        class="search-bar"
      />
      <van-button type="primary" @click="showAddDialog" class="add-btn">
        Add New Task
      </van-button>
    </div>

    <!-- Task table -->
    <div class="task-table">
      <div class="table-header">
        <span @click="sortTasks('id')">ID {{ sortField === 'id' ? (sortAsc ? '↑' : '↓') : '' }}</span>
        <span @click="sortTasks('name')">Task Name {{ sortField === 'name' ? (sortAsc ? '↑' : '↓') : '' }}</span>
        <span @click="sortTasks('status')">Status {{ sortField === 'status' ? (sortAsc ? '↑' : '↓') : '' }}</span>
        <span @click="sortTasks('date')">Date Added {{ sortField === 'date' ? (sortAsc ? '↑' : '↓') : '' }}</span>
        <span>Actions</span>
      </div>
      <van-grid :column-num="1" :border="false" class="table-body">
        <van-grid-item v-for="(task, index) in paginatedTasks" :key="index">
          <div class="table-row">
            <span>{{ (currentPage - 1) * pageSize + index + 1 }}</span>
            <span>{{ task.name }}</span>
            <span>{{ task.status || 'Pending' }}</span>
            <span>{{ task.date }}</span>
            <span class="actions">
              <van-button type="warning" size="small" @click="showEditDialog((currentPage - 1) * pageSize + index)">
                Edit
              </van-button>
              <van-button type="danger" size="small" @click="deleteTask((currentPage - 1) * pageSize + index)">
                Delete
              </van-button>
            </span>
          </div>
        </van-grid-item>
      </van-grid>
    </div>

    <!-- Pagination -->
    <van-pagination
      v-model="currentPage"
      :total-items="filteredTasks.length"
      :items-per-page="pageSize"
      :show-page-size="5"
      class="pagination"
      @change="onPageChange"
    />

    <!-- Add Task Dialog -->
    <van-dialog
      v-model:show="showAddDialogFlag"
      title="Add New Task"
      show-cancel-button
      @confirm="addTask"
      @cancel="cancelAdd"
    >
      <van-field
        v-model="newTask.name"
        label="Task Name"
        placeholder="Enter task name"
        :rules="[{ required: true, message: 'Task name is required' }]"
      />
      <van-field
        v-model="newTask.status"
        label="Status"
        placeholder="e.g., Pending"
      />
    </van-dialog>

    <!-- Edit Dialog -->
    <van-dialog
      v-model:show="showEditDialogFlag"
      title="Edit Task"
      show-cancel-button
      @confirm="saveEditedTask"
      @cancel="cancelEdit"
    >
      <van-field
        v-model="editTaskData.name"
        label="Task Name"
        placeholder="Enter task name"
        :rules="[{ required: true, message: 'Task name is required' }]"
      />
      <van-field
        v-model="editTaskData.status"
        label="Status"
        placeholder="e.g., Pending"
      />
    </van-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { showToast } from 'vant';

export default {
  setup() {
    // Task data
    const tasks = ref([]);
    const newTask = ref({ name: '', status: '' });

    // Search state
    const searchQuery = ref('');

    // Sorting state
    const sortField = ref('id');
    const sortAsc = ref(true);

    // Pagination state
    const currentPage = ref(1);
    const pageSize = ref(5); // 5 tasks per page

    // Dialog states
    const showAddDialogFlag = ref(false);
    const showEditDialogFlag = ref(false);
    const editTaskData = ref({ name: '', status: '' });
    const editIndex = ref(null);

    // Show add dialog
    const showAddDialog = () => {
      newTask.value = { name: '', status: '' };
      showAddDialogFlag.value = true;
    };

    // Add a new task
    const addTask = () => {
      if (newTask.value.name.trim()) {
        tasks.value.push({
          name: newTask.value.name,
          status: newTask.value.status || 'Pending',
          date: new Date().toLocaleDateString(),
        });
        showAddDialogFlag.value = false;
        showToast('Task added successfully!');
        currentPage.value = Math.ceil(filteredTasks.value.length / pageSize.value);
      }
    };

    // Cancel add
    const cancelAdd = () => {
      showAddDialogFlag.value = false;
    };

    // Delete a task
    const deleteTask = (index) => {
      tasks.value.splice(index, 1);
      showToast('Task deleted!');
      if (paginatedTasks.value.length === 0 && currentPage.value > 1) {
        currentPage.value--;
      }
    };

    // Show edit dialog
    const showEditDialog = (index) => {
      editIndex.value = index;
      editTaskData.value = { ...tasks.value[index] };
      showEditDialogFlag.value = true;
    };

    // Save edited task
    const saveEditedTask = () => {
      if (editTaskData.value.name.trim()) {
        tasks.value[editIndex.value] = {
          ...editTaskData.value,
          date: tasks.value[editIndex.value].date,
        };
        showEditDialogFlag.value = false;
        showToast('Task updated!');
      }
    };

    // Cancel edit
    const cancelEdit = () => {
      showEditDialogFlag.value = false;
    };

    // Sort tasks
    const sortTasks = (field) => {
      if (sortField.value === field) {
        sortAsc.value = !sortAsc.value;
      } else {
        sortField.value = field;
        sortAsc.value = true;
      }
      currentPage.value = 1; // Reset to first page on sort
    };

    // Computed property for filtered tasks
    const filteredTasks = computed(() => {
      const query = searchQuery.value.toLowerCase().trim();
      if (!query) return tasks.value;
      return tasks.value.filter(
        (task) =>
          task.name.toLowerCase().includes(query) ||
          (task.status && task.status.toLowerCase().includes(query))
      );
    });

    // Computed property for sorted tasks
    const sortedTasks = computed(() => {
      const sorted = [...filteredTasks.value];
      sorted.sort((a, b) => {
        let valA = a[sortField.value] || '';
        let valB = b[sortField.value] || '';
        
        if (sortField.value === 'id') {
          return sortAsc.value ? 0 : 0; // ID is index-based
        }
        
        valA = valA.toString().toLowerCase();
        valB = valB.toString().toLowerCase();
        
        return sortAsc.value ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
      return sorted;
    });

    // Computed property for paginated tasks
    const paginatedTasks = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return sortedTasks.value.slice(start, end);
    });

    // Handle page change
    const onPageChange = () => {
      // No additional logic needed
    };

    return {
      tasks,
      newTask,
      searchQuery,
      sortField,
      sortAsc,
      sortedTasks,
      filteredTasks,
      currentPage,
      pageSize,
      paginatedTasks,
      showAddDialogFlag,
      showEditDialogFlag,
      editTaskData,
      showAddDialog,
      addTask,
      cancelAdd,
      deleteTask,
      showEditDialog,
      saveEditedTask,
      cancelEdit,
      sortTasks,
      onPageChange,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px; /* Fits 1080p screens */
  margin: 20px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.header-actions {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: center;
}

.search-bar {
  flex: 1;
  max-width: 400px;
}

.add-btn {
  width: 150px;
  height: 40px;
}

.task-table {
  border: 1px solid #ebedf0;
  border-radius: 4px;
  overflow: hidden;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 1fr 3fr 2fr 2fr 2fr; /* ID, Name, Status, Date, Actions */
  padding: 12px 16px;
  align-items: center;
}

.table-header {
  background-color: #f7f8fa;
  font-weight: bold;
  border-bottom: 1px solid #ebedf0;
  cursor: pointer;
}

.table-header span:hover {
  color: #409eff; /* Vant primary color */
}

.table-row {
  border-bottom: 1px solid #ebedf0;
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: #fafafa;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row span {
  padding: 0 10px;
}

.actions {
  display: flex;
  gap: 10px;
}

.van-button {
  font-size: 14px;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}
</style>