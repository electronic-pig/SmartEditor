<template>
  <div class="container">
    <div class="register">
      <div class="image">
        <img style="width: 160px;" alt="logo" src="../assets/images/白底logo.png" />
      </div>
      <p class="logo">妙笔</p>
      <el-form class="form" :model="registerForm" :rules="rules" ref="registerFormRef">
        <el-form-item prop="username">
          <el-input v-model="registerForm.username" autocomplete="off" placeholder="用户名"><template #prepend>
              <el-icon>
                <Avatar />
              </el-icon> </template></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="registerForm.email" autocomplete="off" placeholder="邮箱"><template #prepend>
              <el-icon>
                <Message />
              </el-icon> </template></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="registerForm.password" autocomplete="off" show-password
            placeholder="密码"><template #prepend>
              <el-icon>
                <Lock />
              </el-icon> </template></el-input>
        </el-form-item>
        <el-form-item prop="checkPassword">
          <el-input type="password" v-model="registerForm.checkPassword" autocomplete="off" show-password
            placeholder="确认密码"><template #prepend>
              <el-icon>
                <Lock />
              </el-icon> </template></el-input>
        </el-form-item>
        <el-form-item prop="verification_code">
          <div class="code-container">
            <el-input v-model="registerForm.verification_code" autocomplete="off" placeholder="验证码"><template #prepend>
                <el-icon>
                  <Check />
                </el-icon> </template></el-input>
            <el-button :disabled="isButtonDisabled" @click="getCode" style="margin-left: 5px">{{ isButtonDisabled ?
              `已发送(${countdown}s)` : '发送验证码' }}</el-button>
          </div>
        </el-form-item>
        <div style="text-align: center">
          <el-button type="default" @click="cancel">取消</el-button>
          <el-button type="primary" @click="register">注册</el-button>
        </div>
      </el-form>
      <p class="login" @click="goLogin">已有账户？立即登录</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElLoading, ElMessage } from "element-plus";
import request from "../utils/request.js";

const router = useRouter();
const registerFormRef = ref();
const registerForm = reactive({
  username: "",
  email: "",
  password: "",
  checkPassword: "",
  verification_code: "",
});
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度必须在6到20个字符之间', trigger: 'blur' },
    { pattern: /^[A-Za-z\d]{6,20}$/, message: '密码只能包含字母和数字，不能包含特殊字符和空格', trigger: 'blur' }
  ],
  checkPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }, trigger: 'blur'
    }
  ],
});
const countdown = ref(60);
const isButtonDisabled = ref(false);

const register = async () => {
  const valid = await registerFormRef.value.validate();
  if (!valid) return;
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: "正在加载中...",
  });
  try {
    const response = await request.post("/auth/register", registerForm);
    if (response.code == 200) {
      ElMessage.success(response.message);
      registerForm.username = "";
      registerForm.email = "";
      registerForm.password = "";
      registerForm.checkPassword = "";
      registerForm.verification_code = "";
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error(error);
  }
  loadingInstance.close();
};

const getCode = async () => {
  const valid = await registerFormRef.value.validate();
  if (!valid) return;
  isButtonDisabled.value = true;
  const timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timer);
      isButtonDisabled.value = false;
      countdown.value = 60;
    }
  }, 1000);
  try {
    const response = await request.get("/auth/varify/" + registerForm.username + "&" + registerForm.email);
    if (response.code == 200) {
      ElMessage.success(response.message);
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error(error);
  }

};

const cancel = () => {
  router.push("/");
};

const goLogin = () => {
  router.push("/login");
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

.register {
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
