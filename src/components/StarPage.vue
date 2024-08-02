<template>
  <div class="container">
    <h2 class="title">我的收藏</h2>
    <div class="documents-grid">
      <div v-for="(doc, index) in documents" :key="index" class="document-card" @click="handleClick(doc.id)">
        <img src="../assets/images/doc.png" alt="Document" class="document-logo">
        <div class="document-title">{{ doc.title }}</div>
        <el-dropdown class="document-dropdown">
          <el-icon :size="18">
            <Setting />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="openInNewTab(doc.id)">新标签打开</el-dropdown-item>
              <el-dropdown-item @click="addTemplate(doc.id)">另存为模板</el-dropdown-item>
              <el-dropdown-item @click="removeFavorite(doc.id)">取消收藏</el-dropdown-item>
              <el-dropdown-item @click="addRecycle(doc.id)">放入回收站</el-dropdown-item>
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

const loadDocuments = async () => {
  try {
    NProgress.start();
    const response = await request.get("/document/favorites/user");
    if (response.code == 200) {
      documents.value = response.documents;
    }
  } catch (error) {
    ElMessage.error(error);
  } finally {
    NProgress.done();
  }
};
// 在新标签中打开文档
const openInNewTab = (id) => {
  const url = router.resolve({ name: 'edit', params: { id: id } }).href;
  window.open(url, '_blank');
};
// 另存为模板
const addTemplate = async (id) => {
  try {
    NProgress.start();
    const response = await request.put(`/document/template/${id}`);
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
// 取消收藏
const removeFavorite = async (id) => {
  try {
    NProgress.start();
    const response = await request.put(`/document/unfavorite/${id}`);
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
// 放入回收站
const addRecycle = async (id) => {
  try {
    NProgress.start();
    const response = await request.put(`/document/delete/${id}`);
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
// 点击文档
const handleClick = (id) => {
  router.push({ name: 'edit', params: { id: id } });
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
  cursor: pointer;
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
}

.document-card:hover .document-dropdown {
  visibility: visible
}
</style>