<template>
  <el-container style="height: 100vh">
    <el-aside width="14vw" style="background-color: var(--nav--color)">
      <div class="platform">
        <img class="platform-logo" src="@/assets/images/logo.png" alt="logo" />
        <div class="platform-title">妙 笔</div>
      </div>
      <div class="add-container">
        <button class="add" @click="createDoc()"><i class="ri-add-line"></i>&nbsp;新建文档</button>
      </div>
      <el-divider class="divider-title">功能区</el-divider>
      <!-- 左侧导航链接 -->
      <div class="router-link">
        <router-link to="/dashboard/DocumentPage" class="link">
          &nbsp;&nbsp;&nbsp;
          <i class="ri-folder-2-line"></i>
          &nbsp;&nbsp;
          我的文档
        </router-link>
        <router-link to="/dashboard/MyTemplate" class="link">
          &nbsp;&nbsp;&nbsp;
          <i class="ri-folder-open-line"></i>
          &nbsp;&nbsp;
          我的模板
        </router-link>
        <router-link to="/dashboard/StarPage" class="link">
          &nbsp;&nbsp;&nbsp;
          <i class="ri-star-line"></i>
          &nbsp;&nbsp;
          我的收藏
        </router-link>
        <router-link to="/dashboard/TemplateRepo" class="link">
          &nbsp;&nbsp;&nbsp;
          <i class="ri-folder-cloud-line"></i>
          &nbsp;&nbsp;
          模板库
        </router-link>
        <router-link to="/dashboard/RecyclePage" class="link">
          &nbsp;&nbsp;&nbsp;
          <i class="ri-delete-bin-line"></i>
          &nbsp;&nbsp;
          回收站
        </router-link>
        <div class="more" @click="getMore()">更多</div>
        <el-dialog v-model="RightsDialog" title="权益对比">
          <el-table :data="tableData" :header-cell-style="setHeader" :cell-style="setCell">
            <el-table-column prop="Type" label="权益类型"></el-table-column>
            <el-table-column prop="super" label="超级会员"></el-table-column>
            <el-table-column prop="gold" label="黄金会员"></el-table-column>
            <el-table-column prop="normal" label="普通会员"></el-table-column>
          </el-table>
        </el-dialog>
      </div>
    </el-aside>
    <el-container>
      <el-header class="header">
        <a href="https://github.com/electronic-pig/SmartEditor" target="_blank" style="text-decoration: none; ">
          <i style="font-size: 30px; color: #555" class="ri-github-fill"></i>
        </a>
        <el-autocomplete v-model="search" :fetch-suggestions="querySearchAsync" :trigger-on-focus="false"
          value-key="title" @select="handleSelect" placeholder="通过文档名搜索文档" clearable
          style="width: 40vw;margin-left: 15vw">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-autocomplete>
        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" size="small"
          style="margin-left: 15vw" />
        <el-dropdown size="large" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ userStore.username }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="reset_password">
                <el-icon>
                  <EditPen />
                </el-icon>修改密码</el-dropdown-item>
              <el-dropdown-item command="logout">
                <el-icon>
                  <SwitchButton />
                </el-icon>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
        <ResetPassword :signal="toggle" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from "vue";
import router from "../router";
import { useUserStore } from "../stores/userStore.js";
import ResetPassword from "../components/ResetPassword.vue";
import request from "../utils/request.js";
import { ElMessage, ElLoading } from "element-plus";

const userStore = useUserStore();
const toggle = ref(false);  // 控制重置密码对话框的显示
const RightsDialog = ref(false);  // 控制权益对比表格的显示
let search = ref('');
const tableData = ref([
  { Type: '存储空间', super: '10G', gold: '1G', normal: '100M' },
  { Type: '文档数量', super: '无限制', gold: '1000', normal: '100' },
  { Type: '个人模板', super: '无限制', gold: '100', normal: '10' },
  { Type: '下载打印', super: '支持', gold: '支持', normal: '无' },
  { Type: '信息提取', super: '全功能', gold: '部分功能', normal: '无' },
  { Type: 'AI编辑', super: '全功能', gold: '部分功能', normal: '无' },
  { Type: '模板库', super: '全部', gold: '部分', normal: '无' },
  { Type: '价格', super: '￥99/年', gold: '￥49/年', normal: 'Free' },
  { Type: '退款', super: '无理由退款', gold: '无理由退款', normal: '无理由退款' },
  { Type: '客服', super: '7*24小时', gold: '7*24小时', normal: '7*24小时' },
]);

const handleCommand = (command) => {
  if (command === "logout") {
    userStore.removeToken();
    userStore.removeUsername();
    userStore.removeEmail();
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    router.push("/");
  }
  if (command === "reset_password") {
    toggle.value = !toggle.value;
  }
};
// 文档查询
const querySearchAsync = async (queryString, cb) => {
  try {
    const response = await request.get("/document/search/" + queryString);
    if (response.code == 200) {
      cb(response.documents);
    } else {
      cb([]);
      ElMessage.info(response.message);
    }
  } catch (error) {
    ElMessage.error(error);
  }
};
// 点击查询结果
const handleSelect = (item) => {
  router.push({ name: 'edit', params: { id: item.id } });
};
// 新建文档
const createDoc = async () => {
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: "正在新建文档...",
  });
  try {
    const response = await request.post('/document', { content: "" });
    if (response.code == 200) {
      ElMessage.success('新建文档成功!');
      router.push({ name: 'edit', params: { id: response.id } });
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error(error);
  } finally {
    loadingInstance.close();
  }
};
// 更多功能
const getMore = () => {
  RightsDialog.value = true;
};
// 权益对比表格样式
const setHeader = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex == 1) {
    return { color: 'blueviolet' };
  }
  if (columnIndex == 2) {
    return { color: 'orange' };
  }
};
const setCell = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex == 1) {
    return { color: 'blueviolet' };
  }
  if (columnIndex == 2) {
    return { color: 'orange' };
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

.add-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 3vh 0;
}

.add {
  width: 80%;
  border: none;
  padding: 1.5vh 0;
  border-radius: 10px;
  background-color: var(--el-color-primary);
  color: #eee;
  cursor: pointer;
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
  font-size: 16px;
}

.router-link {
  width: 80%;
  margin: 3vh auto 0;
}

.link {
  width: 100%;
  display: block;
  padding: 1.5vh 0;
  text-decoration: none;
  border-radius: 10px;
  color: var(--el-color-primary);
}

.link:hover {
  background-color: #DCDFE6;
  color: var(--el-color-primary);
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
  margin-top: 26vh;
  display: block;
  text-align: center;
  text-decoration: none;
  border-radius: 10px;
  color: var(--el-color-primary-light-3);
  background-color: #DCDFE6;
  cursor: pointer;
}

.more:hover {
  background-color: var(--el-color-primary-light-5);
  color: #eee;
}

.header {
  height: 6vh;
  box-shadow: 0 0 2rem 0 rgba(41, 48, 66, 0.1);
  display: flex;
  align-items: center;
  background-color: var(--nav--color);
  color: #606266;
}

.main {
  padding: 0px;
}
</style>