<template>
  <div class="login">
    <div class="image">
      <img style="width: 160px;" alt="logo" src="../assets/images/白底logo.png" />
    </div>
    <p class="logo">妙笔</p>
    <el-form class="form" :model="loginForm">
      <el-form-item>
        <el-input v-model="loginForm.username" autocomplete="off" placeholder="用户名"><template #prepend>
            <el-icon>
              <Avatar />
            </el-icon> </template></el-input>
      </el-form-item>
      <el-form-item>
        <el-input type="password" v-model="loginForm.password" autocomplete="off" show-password
          placeholder="密码"><template #prepend>
            <el-icon>
              <Lock />
            </el-icon> </template></el-input>
      </el-form-item>
      <div style="text-align: center">
        <el-button type="default" @click="cancel">取消</el-button>
        <el-button type="primary" @click="login">登录</el-button>
      </div>
    </el-form>
    <p class="register" @click="goRegist">没有账户？立即注册</p>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { ElLoading, ElMessage } from "element-plus";

const router = useRouter();
const loginForm = reactive({
  username: "",
  password: "",
});

const login = () => {
  if (!loginForm.username || !loginForm.password) {
    ElMessage.error("请填写完整的登录信息！");
    return;
  }
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: "正在加载中...",
  });
  router.push("/");
  localStorage.setItem("username", loginForm.username);
  loadingInstance.close();
};

const cancel = () => {
  router.push("/");
};

const goRegist = () => {
  router.push("/register");
};
</script>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 80vh;
  width: 24vw;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  border-radius: 1vw;
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

img {
  width: 50%;
}

.form {
  width: 20vw;
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
