<template>
  <div class="container">
    <h2 class="title">我的模板</h2>
    <div class="documents-grid">
      <div v-for="(doc, index) in documents" :key="index" class="document-card" @click="handleClick(doc.id)">
        <img src="../assets/images/docs.png" alt="Document" class="document-logo">
        <div class="document-title">{{ doc.title }}</div>
        <el-dropdown class="document-dropdown" @command="handleCommand">
          <el-icon :size="18">
            <Setting />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="editDocument">编辑</el-dropdown-item>
              <el-dropdown-item command="openDocumentInNewTab">新标签打开</el-dropdown-item>
              <el-dropdown-item command="deleteDocument">删除</el-dropdown-item>
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
import router from "../router";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const documents = ref([]);

onMounted(async () => {
  try {
    NProgress.start();
    const response = await request.get("/document/template");
    if (response.code == 200) {
      documents.value = response.document;
      console.log(documents);
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error(error);
  } finally {
    NProgress.done();
  }
});

const handleCommand = (command) => {
  if (command === "editDocument") {
    console.log("Edit document");
  }
};

const handleClick = (id) => {
  router.push({ name: 'edit', params: { id: id } });
};
</script>

<style scoped>
.container {
  margin: 20px 2vw;
}

.title {
  color: #555;
}

.documents-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-top: 20px;
}

.document-card {
  width: 10%;
  margin: 3vh 1.5vw;
  margin-bottom: 10px;
  position: relative;
  cursor: pointer;
}

.document-card:hover {
  background-color: #f5f5f5;
  border-radius: 8px;
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
  top: 4px;
  right: 4px;
  visibility: hidden;
}

.document-card:hover .document-dropdown {
  visibility: visible
}
</style>