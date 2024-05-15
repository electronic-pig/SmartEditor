<template>
  <div class="container">
    <div class="left-pane">
      <div class="platform">
        <router-link to="/">
          <img
            class="platform-logo"
            src="@/assets/images/开发经验.svg"
            alt="logo"
          />
        </router-link>
        <div class="platform-title">
          <a>Smart Editor</a>
        </div>
      </div>
      <el-divider class="divider-title"> 功能区 </el-divider>
      <!-- 左侧导航链接 -->
      <div class="router-link">
        <router-link to="/dashboard/Apage" class="link">开始</router-link>
        <router-link to="/dashboard/Bpage" class="link">我的文档</router-link>
        <router-link to="/dashboard/Cpage" class="link">模板库</router-link>
        <div class="more">更多</div>
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
  background-color: #f2f3f5; /* 左侧面板的背景色 */
}

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
  background-color: #f2f3f5;
  color: rgb(140, 157, 182);
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

.more {
  width: 100%;
  padding: 10px 0;
  margin-top: 50vh;
  display: block;
  text-align: center;
  text-decoration: none;
  border-radius: 10px;
  color: var(--el-color-primary-light-3);
  background-color: #EBEDF0;
  cursor: pointer;
}

.more:hover {
  background-color: var(--el-color-primary-light-5);
  color: #eee;
}
</style>