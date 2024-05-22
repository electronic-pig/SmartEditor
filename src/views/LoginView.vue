<template>
  <div class="login">
    <div class="image">
      <img style="width: 160px;" alt="logo" src="../assets/images/白底logo.png" />
    </div>
    <p class="logo">妙笔</p>
    <el-form class="form" :model="loginForm">
      <el-form-item>
        <el-input v-model="loginForm.email" autocomplete="off" placeholder="邮箱"><template #prepend>
            <el-icon>
              <Message />
            </el-icon> </template></el-input>
      </el-form-item>
      <el-form-item>
        <el-input type="password" v-model="loginForm.password" autocomplete="off" show-password
          placeholder="密码"><template #prepend>
            <el-icon>
              <Lock />
            </el-icon> </template></el-input>
      </el-form-item>
      <el-form-item>
        <div class="code-container">
          <el-input v-model="loginForm.captcha" autocomplete="off" placeholder="验证码">
            <template #prepend>
              <el-icon>
                <Check />
              </el-icon>
            </template>
          </el-input>
          <img class="captcha" :src="captchaImage" @click="refreshCaptcha" alt="captcha" />
        </div>
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
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElLoading, ElMessage } from "element-plus";
import request from "@/utils/request.js";

const router = useRouter();
const loginForm = reactive({
  email: "",
  password: "",
  captcha: "",
});
const captchaImage = ref("");

const refreshCaptcha = async () => {
  const response = await request.get("/auth/captcha", { responseType: "blob" });
  captchaImage.value = URL.createObjectURL(response);
};

const login = async () => {
  if (!loginForm.email || !loginForm.password) {
    ElMessage.error("请填写完整的登录信息！");
    return;
  }
  if (!loginForm.captcha) {
    ElMessage.error("请输入验证码！");
    return;
  }
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: "正在加载中...",
  });
  try {
    const response = await request.post("/auth/login", loginForm,);
    if (response.code == 200) {
      ElMessage.success(response.message);
      loginForm.email = "";
      loginForm.password = "";
      loginForm.captcha = "";
    } else {
      ElMessage.error(response.message);
      refreshCaptcha();
    }
  } catch (error) {
    ElMessage.error(error);
    refreshCaptcha();
  }
  loadingInstance.close();
};

const cancel = () => {
  router.push("/");
};

const goRegist = () => {
  router.push("/register");
};

onMounted(refreshCaptcha);
</script>

<style scoped>
.login {
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

.form {
  width: 20vw;
}

.code-container {
  display: flex;
}

.captcha {
  height: 32px;
  margin-left: 10px;
  border: #dcdfe6 solid 1px;
  border-radius: 4px;
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
