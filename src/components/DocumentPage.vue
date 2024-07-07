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
          <el-dropdown @command="command => handleCommand(command, row)">
            <el-icon :size="20">
              <Setting />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="editDocument">编辑</el-dropdown-item>
                <el-dropdown-item command="addFavorite">加入收藏</el-dropdown-item>
                <el-dropdown-item command="addRecycle">放入回收站</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import request from "../utils/request.js";
import router from "../router";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const documents = ref([]);

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
  router.push({ name: 'edit', params: { id: row.id } });
};

const handleCommand = (command, document) => {
  switch (command) {
    case 'editDocument':
      editDocument(document);
      break;
    case 'addFavorite':
      addFavorite(document);
      break;
    case 'addRecycle':
      addRecycle(document);
      break;
    default:
      break;
  }
};

const loadDocuments = async () => {
  try {
    NProgress.start();
    const response = await request.get("/document/user");
    if (response.code == 200) {
      documents.value = response.documents;
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error(error);
  } finally {
    NProgress.done();
  }
};

const editDocument = (document) => {
  // 编辑文档的代码
  console.log('Editing document:', document.id);
};

const addFavorite = async (document) => {
  try {
    NProgress.start();
    const response = await request.put(`/document/favorite/${document.id}`);
    if (response.code == 200) {
      ElMessage.success(response.message);
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error(error);
  } finally {
    NProgress.done();
  }
};

const addRecycle = async (document) => {
  try {
    NProgress.start();
    const response = await request.put(`/document/delete/${document.id}`);
    if (response.code == 200) {
      ElMessage.success(response.message);
      loadDocuments();
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error(error);
  } finally {
    NProgress.done();
  }
};

onMounted(loadDocuments);

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