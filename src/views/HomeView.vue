<template>
  <div class="container">
    <div class="header">
      <a href="#" class="logo">Smart<b>Editor</b></a>
      <ul class="links">
        <li>首页</li>
        <li>联系我们</li>
        <li>信息</li>
        <li>帮助</li>
        <router-link to="/login" class="toLogin">登录/注册</router-link>
      </ul>
    </div>
    <div class="content">
      <div class="info">
        <h1>Smart Editor 智能编辑器</h1>
        <p>
          数字化时代，在用户在日常学习和工作中，常常需要编辑和处理大量的多模态信息。无论是撰写项目书、设计分工表格，还是记录会议和日常，一个结合生成式AI能力、能够处理图片、文本、表格、代码甚至音视频，并辅助用户进行内容创作的智能编辑器，将能极大地提升我们的学习效率和用户体验。
        </p>
        <button @click="start">开始试用</button>
      </div>
      <div class="image">
        <img alt="logo" src="../assets/images/开发经验.svg" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const start = () => {
  router.push("/dashboard");
};
</script>

<style scoped>
a {
  text-decoration: none;
}

ul {
  list-style: none;
}

.header {
  margin-left: 10vw;
  margin-right: 10vw;
}

.header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  color: #5d5d5d;
  font-style: italic;
  text-transform: uppercase;
  font-size: 20px;
}

.links {
  display: flex;
  align-items: center;
}

.links li {
  margin-left: 30px;
  color: #5d5d5d;
  cursor: pointer;
  transition: 0.3s;
}

.toLogin {
  margin-left: 30px;
  border-radius: 20px;
  padding: 10px 20px;
  color: #fff;
  background-color: #6c63ff;
}

.links li:hover {
  color: #6c63ff;
}

.content {
  margin: auto 10vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: calc(100vh - 80px);
}

.content .info {
  flex: 1;
}

.content .info h1 {
  color: #5d5d5d;
  font-size: 44px;
}

.content .info p {
  margin: 0;
  line-height: 1.6;
  font-size: 16px;
  color: #5d5d5d;
}

.content .info button {
  border: 0;
  border-radius: 20px;
  padding: 12px 30px;
  margin-top: 30px;
  cursor: pointer;
  color: #fff;
  background-color: #6c63ff;
}

.content .image {
  flex: 1;
}

img {
  width: 100%;
}
</style>
