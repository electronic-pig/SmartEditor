<template>
  <el-container style="height: 100vh">
    <el-aside width="14vw" style="background-color: var(--nav--color)">
      <div class="platform">
        <router-link to="/">
          <img class="platform-logo" src="@/assets/images/开发经验.svg" alt="logo" />
        </router-link>
        <div class="platform-title">
          <a>Smart Editor</a>
        </div>
      </div>
      <el-divider class="divider-title">功能区</el-divider>
      <!-- 左侧导航链接 -->
      <div class="router-link">
        <router-link to="/dashboard/Apage" class="link">开始</router-link>
        <router-link to="/dashboard/Bpage" class="link">我的文档</router-link>
        <router-link to="/dashboard/Cpage" class="link">模板库</router-link>
        <div class="more">更多</div>
      </div>
    </el-aside>
    <el-container>
      <el-header class="el-header"><span>文档名</span><el-avatar
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" size="small"
          style="margin-left: 70vw" />
        <el-dropdown size="large" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            admin
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown></el-header>
      <el-main><Router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </Router-view></el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const handleCommand = (command) => {
  if (command === "logout") {
    router.push("/");
  }
};
</script>
<style scoped>
.platform {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--theme--color);
  height: 20vh;
}

.platform-logo {
  width: 8vw;
}

.platform-title {
  position: relative;
  font-weight: 1000;
  font-family: Microsoft JhengHei UI, sans-serif;
  font-size: 22px;
  cursor: pointer;
  color: var(--theme--color);
}

.platform-title::after {
  content: "";
  width: 0;
  height: 3px;
  background: var(--theme--color);
  position: absolute;
  top: 100%;
  left: 50%;
  right: 50%;
  transition: all 0.5s;
}

.platform-title:hover:after {
  left: 0%;
  width: 100%;
}

.divider-title :deep(.el-divider__text) {
  line-height: 24px;
  background-color: var(--nav--color);
  color: rgb(140, 157, 182);
}

.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  margin-left: 1vw;
}

.router-link {
  width: 80%;
  margin: 22px auto 0;
}

.link {
  width: 100%;
  display: block;
  padding: 10px 0;
  text-align: center;
  text-decoration: none;
  border-radius: 10px;
  color: var(--el-color-primary-light-3);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.link.router-link-active {
  background-color: var(--el-color-primary-light-3);
  color: #eee;
}

.more {
  width: 100%;
  padding: 10px 0;
  margin-top: 50vh;
  display: block;
  text-align: center;
  text-decoration: none;
  border-radius: 10px;
  color: var(--el-color-primary-light-3);
  background-color: #ebedf0;
  cursor: pointer;
}

.more:hover {
  background-color: var(--el-color-primary-light-5);
  color: #eee;
}
</style>