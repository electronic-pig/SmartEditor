<template>
  <div class="container">
    <div class="login">
      <div class="image">
        <img style="width: 160px;" alt="logo" src="../assets/images/白底logo.png" />
      </div>
      <p class="logo">妙笔</p>
      <el-form class="form" :model="loginForm" :rules="rules" ref="loginFormRef">
        <el-form-item prop="email">
          <el-input v-model="loginForm.email" autocomplete="off" placeholder="邮箱"><template #prepend>
              <el-icon>
                <Message />
              </el-icon> </template></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" autocomplete="off" show-password
            placeholder="密码"><template #prepend>
              <el-icon>
                <Lock />
              </el-icon> </template></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" plain :icon="Pointer" class="varify" @click="onShow"
        v-if="!isSuccess">点击按钮进行验证</el-button>
      <el-button type="success" plain :icon="CircleCheck" class="varify" v-if="isSuccess">验证成功</el-button>
      <Vcode :show="isShow" @success="onSuccess" @close="onClose" />
      <div style="text-align: center">
        <el-button type="default" @click="cancel">取消</el-button>
        <el-button type="primary" @click="login">登录</el-button>
      </div>
      <p class="register" @click="goRegist">没有账户？立即注册</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElLoading, ElMessage } from "element-plus";
import { Pointer, CircleCheck } from '@element-plus/icons-vue'
import { useUserStore } from '../stores/userStore.js';
import Vcode from "vue3-puzzle-vcode";
import request from "../utils/request.js";

const router = useRouter();
const userStore = useUserStore();
const loginFormRef = ref();
const isShow = ref(false);
const isSuccess = ref(false);
const loginForm = reactive({
  email: "",
  password: "",
});
const rules = reactive({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度必须在6到20个字符之间', trigger: 'blur' },
  ],
});

const login = async () => {
  const valid = await loginFormRef.value.validate();
  if (!valid) return;
  if (!isSuccess.value) {
    ElMessage.error('请完成滑块验证');
    return;
  }
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: "正在加载中...",
  });
  try {
    const response = await request.post("/auth/login", loginForm);
    if (response.code == 200) {
      ElMessage.success(response.message);
      userStore.setToken(response.data.access_token);
      userStore.setUsername(response.data.username);
      loginForm.email = "";
      loginForm.password = "";
      router.push("/dashboard/IndexPage");
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error(error);
  }
  loadingInstance.close();
};

const cancel = () => {
  router.push("/");
};

const onShow = () => {
  isShow.value = true;
};

const onClose = () => {
  isShow.value = false;
};

const onSuccess = () => {
  isSuccess.value = true;
  onClose();
};

const goRegist = () => {
  router.push("/register");
};

</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 80vh;
  width: 24vw;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  border-radius: 1vw;
  background-color: #fff;
}

.image {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.logo {
  margin: 10px auto;
  font-weight: bold;
  background: linear-gradient(135deg, #5DAEFF, #bd34fe);
  background-clip: text;
  color: transparent;
  font-size: 32px;
}

.form {
  width: 20vw;
}

.code-container {
  display: flex;
}

.varify {
  width: 20vw;
  height: 5vh;
  margin-bottom: 20px;
}

.register {
  margin-top: 20px;
  font-size: 14px;
  line-height: 22px;
  text-indent: 8px;
  color: var(--theme--color);
  cursor: pointer;
  display: inline-block;
}

.register:hover {
  color: var(--el-color-primary-dark-2);
}
</style>
