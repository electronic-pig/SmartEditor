<template>
  <el-container style="height: 100vh">
    <el-aside width="14vw" style="background-color: var(--nav--color)">
      <div class="platform">
        <img class="platform-logo" src="@/assets/images/logo.png" alt="logo" />
        <div class="platform-title">妙 笔</div>
      </div>
      <el-divider class="divider-title">功能区</el-divider>
      <!-- 左侧导航链接 -->
      <div class="router-link">
        <router-link to="/dashboard/IndexPage" class="link">工作台</router-link>
        <router-link to="/dashboard/DocumentPage" class="link">我的文档</router-link>
        <router-link to="/dashboard/TemplatePage" class="link">模板库</router-link>
        <router-link to="/dashboard/StarPage" class="link">我的收藏</router-link>
        <router-link to="/dashboard/RecyclePage" class="link">回收站</router-link>
        <div class="more">更多</div>
      </div>
    </el-aside>
    <el-container>
      <el-header class="el-header"><span>开始</span><el-avatar
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
        </el-dropdown>
      </el-header>
      <el-main><router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view></el-main>
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
}

.platform-logo {
  width: 7vw;
  margin: 10px auto;
}

.platform-title {
  position: relative;
  font-weight: bolder;
  font-size: 28px;
  cursor: pointer;
  background: linear-gradient(135deg, #5DAEFF, #bd34fe);
  background-clip: text;
  color: transparent;
}

.platform-title::after {
  content: "";
  width: 0%;
  height: 3px;
  background: linear-gradient(135deg, #5DAEFF, #bd34fe);
  position: absolute;
  top: 100%;
  left: 50%;
  transition: all 0.5s;
}

.platform-title:hover:after {
  left: 0%;
  width: 100%;
}

.divider-title :deep(.el-divider__text) {
  line-height: 24px;
  background-color: var(--nav--color);
  color: #8c9db6;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  margin-left: 1vw;
  color: var(--el-color-primary);
  cursor: pointer;
}

.router-link {
  width: 80%;
  margin: 3vh auto 0;
}

.link {
  width: 100%;
  display: block;
  padding: 1.5vh 0;
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
  margin-top: 36vh;
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