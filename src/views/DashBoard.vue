<template>
  <div class="container">
    <div class="left-pane">
      <!-- 左侧导航链接 -->
      <div class="router-link">
        <router-link to="/dashboard/Apage" class="link">首页</router-link>
        <router-link to="/dashboard/Bpage" class="link">Bpage</router-link>
        <router-link to="/dashboard/Cpage" class="link">Cpage</router-link>
      </div>
    </div>
    <div class="right-pane">
      <!-- 右侧内容 -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  height: 100vh; /* 100%视窗高度 */
}

.left-pane {
  width: 14vw;
  height: 100%; /* 100%父容器的高度 */
  box-sizing: border-box; /* 让边框不会撑大容器 */
}

.right-pane {
  flex: 1; /* 平分父容器的宽度 */
  height: 100%; /* 100%父容器的高度 */
  box-sizing: border-box; /* 让边框不会撑大容器 */
}

.left-pane {
  background-color: #eee; /* 左侧面板的背景色 */
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

.right-pane {
  background-color: #ffffff; /* 右侧面板的背景色 */
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
</style>