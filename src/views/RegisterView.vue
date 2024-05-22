<template>
  <div class="register">
    <div class="image">
      <img style="width: 160px;" alt="logo" src="../assets/images/白底logo.png" />
    </div>
    <p class="logo">妙笔</p>
    <el-form class="form" :model="registerForm">
      <el-form-item>
        <el-input v-model="registerForm.username" autocomplete="off" placeholder="用户名"><template #prepend>
            <el-icon>
              <Avatar />
            </el-icon> </template></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="registerForm.email" autocomplete="off" placeholder="邮箱"><template #prepend>
            <el-icon>
              <Message />
            </el-icon> </template></el-input>
      </el-form-item>
      <el-form-item>
        <div class="code-container">
          <el-input v-model="registerForm.code" autocomplete="off" placeholder="验证码"><template #prepend>
              <el-icon>
                <Check />
              </el-icon> </template></el-input>
          <el-button type="default" @click="getCode" style="margin-left: 5px">获取验证码</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <el-input type="password" v-model="registerForm.password" autocomplete="off" show-password
          placeholder="密码"><template #prepend>
            <el-icon>
              <Lock />
            </el-icon> </template></el-input>
      </el-form-item>
      <el-form-item>
        <el-input type="password" v-model="registerForm.checkPassword" autocomplete="off" show-password
          placeholder="确认密码"><template #prepend>
            <el-icon>
              <Lock />
            </el-icon> </template></el-input>
      </el-form-item>

      <div style="text-align: center">
        <el-button type="default" @click="cancel">取消</el-button>
        <el-button type="primary" @click="register">注册</el-button>
      </div>
    </el-form>
    <p class="login" @click="goLogin">已有账户？立即登录</p>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { ElLoading, ElMessage } from "element-plus";

const router = useRouter();
const registerForm = reactive({
  username: "",
  email: "",
  code: "",
  password: "",
  checkPassword: "",
});

const register = () => {
  if (
    !registerForm.username ||
    !registerForm.email ||
    !registerForm.code ||
    !registerForm.password ||
    !registerForm.checkPassword
  ) {
    ElMessage.error("请填写完整的注册信息");
    return;
  }

  if (registerForm.password !== registerForm.checkPassword) {
    ElMessage.error("两次输入的密码不一致");
    return;
  }
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: "正在加载中...",
  });
  ElMessage.success("注册成功！");
  registerForm.username = "";
  registerForm.email = "";
  registerForm.code = "";
  registerForm.password = "";
  registerForm.checkPassword = "";
  loadingInstance.close();
};
const getCode = () => {
  ElMessage.success("验证码已发送，请注意查收");
};
const cancel = () => {
  router.push("/");
};

const goLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.register {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 80vh;
  width: 24vw;
  margin: 10vh auto 0;
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

.code-container {
  display: flex;
}

.login {
  margin-top: 20px;
  font-size: 14px;
  line-height: 22px;
  text-indent: 8px;
  color: var(--theme--color);
  cursor: pointer;
  display: inline-block;
}

.login:hover {
  color: var(--el-color-primary-dark-2);
}
</style>
