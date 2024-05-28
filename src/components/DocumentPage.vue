<template>
  <div class="container">
    <h2 class="title">我的文档</h2>
    <el-table :data="documents" class="table" :row-style="{ height: '50px' }" @row-click="handleRowClick">
      <el-table-column label="标题"><template #default="{ row }">
          <div style="display: flex; align-items: center;">
            <img src="../assets/images/docs.png" alt="Document" style="height: 30px; margin-right: 8px;">
            {{ row.title }}
          </div>
        </template></el-table-column>
      <el-table-column label="创建时间">
        <template #default="{ row }">
          {{ formatDate(row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间">
        <template #default="{ row }">
          {{ formatDate(row.updated_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-dropdown>
            <el-icon :size="20">
              <Setting />
            </el-icon>
            <template v-slot:dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="editDocument(row)">编辑</el-dropdown-item>
                <el-dropdown-item @click="openDocumentInNewTab(row)">新标签打开</el-dropdown-item>
                <el-dropdown-item @click="deleteDocument(row)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import request from "../utils/request.js";

const documents = reactive([]);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Shanghai'
  }).format(date);
};

const handleRowClick = (row) => {
  console.log(row);
};

onMounted(async () => {
  try {
    const response = await request.get("/document/user/1");
    if (response.code == 200) {
      console.log(response);
      documents.push(...response.documents);
      console.log(documents);
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error(error);
  }
});

const editDocument = () => {
  // 编辑文档的代码...
};

const openDocumentInNewTab = () => {
  // 在新标签中打开文档的代码...
};

const deleteDocument = () => {
  // 删除文档的代码...
};
</script>

<style scoped>
.container {
  margin: 20px 2vw;
}

.title {
  color: #555;
}

.table {
  width: 100%;
}

.table :deep(.el-table__body) :hover {
  cursor: pointer;
}
</style>