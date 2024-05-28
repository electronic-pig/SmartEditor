<template>
  <div class="card">
    <h1>我的文档</h1>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { ElMessage } from "element-plus";
import request from "../utils/request.js";

onMounted(async () => {
  try {
    const response = await request.get("/document/user/1");
    if (response.code == 200) {
      ElMessage.success(response.message);
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error(error);

  }
});
</script>

<style scoped>
.card {
  width: 90%;
  height: 500px;
  background: #eee;
  margin: 20px auto;
  text-align: center;
  line-height: 500px;
  border-radius: 10px;
}
</style>