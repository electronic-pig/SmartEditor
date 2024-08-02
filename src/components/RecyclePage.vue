<template>
  <div class="container">
    <h2 class="title">回收站</h2>
    <div class="documents-grid">
      <div v-for="(doc, index) in documents" :key="index" class="document-card">
        <img src="../assets/images/doc.png" alt="Document" class="document-logo">
        <div class="document-title">{{ doc.title }}</div>
        <el-dropdown class="document-dropdown">
          <el-icon :size="18">
            <Setting />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="recoverDocument(doc.id)">恢复文档</el-dropdown-item>
              <el-dropdown-item @click="deleteDocument(doc.id)">彻底删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import request from "../utils/request.js";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const documents = ref([]);

const loadDocuments = async () => {
  try {
    NProgress.start();
    const response = await request.get("/document/deleted/user");
    if (response.code == 200) {
      documents.value = response.documents;
    }
  } catch (error) {
    ElMessage.error(error);
  } finally {
    NProgress.done();
  }
};
// 恢复文档
const recoverDocument = async (id) => {
  try {
    NProgress.start();
    const response = await request.put(`/document/recover/${id}`);
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
// 彻底删除文档
const deleteDocument = async (id) => {
  try {
    NProgress.start();
    const response = await request.delete(`/document/${id}`);
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
  margin: 2vh 2vw;
}

.title {
  color: #555;
}

.documents-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-top: 2vh;
}

.document-card {
  width: 10%;
  margin: 3vh 1.5vw;
  margin-bottom: 1vh;
  position: relative;
}

.document-card:hover {
  background-color: #f5f5f5;
  border-radius: 1vh;
}

.document-logo {
  width: 100%;
}

.document-title {
  text-align: center;
  font-family: Arial, sans-serif;
  color: #555;
  font-weight: bold;
}

.document-dropdown {
  position: absolute;
  top: 0.5vh;
  right: 0.5vw;
  visibility: hidden;
  cursor: pointer;
}

.document-card:hover .document-dropdown {
  visibility: visible
}
</style>