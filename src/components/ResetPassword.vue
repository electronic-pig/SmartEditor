<template>
  <el-dialog v-model="show" class="reset-dialog" width="24vw" align-center center :show-close="false">
    <el-icon size="60px">
      <Message />
    </el-icon>
    <p>为确保本人操作，请验证邮箱：{{ maskedEmail }}</p>
    <el-form class="form" :model="resetForm" :rules="rules" ref="resetFormRef">
      <el-form-item prop="verification_code">
        <div class="code-container">
          <el-input v-model="resetForm.verification_code" autocomplete="off" placeholder="验证码"><template #prepend>
              <el-icon>
                <Check />
              </el-icon> </template></el-input>
          <el-button :disabled="isButtonDisabled" @click="getCode" style="margin-left: 5px">{{
            isButtonDisabled ?
              `已发送(${countdown}s)` : '发送验证码' }}</el-button>
        </div>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="resetForm.password" autocomplete="off" show-password
          placeholder="密码"><template #prepend>
            <el-icon>
              <Lock />
            </el-icon> </template></el-input>
      </el-form-item>
      <el-form-item prop="checkPassword">
        <el-input type="password" v-model="resetForm.checkPassword" autocomplete="off" show-password
          placeholder="确认密码"><template #prepend>
            <el-icon>
              <Lock />
            </el-icon> </template></el-input>
      </el-form-item>

      <div style="text-align: center">
        <el-button type="default" @click="cancel">取消</el-button>
        <el-button type="primary" @click="reset">确认</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from "vue";
import { ElLoading, ElMessage } from "element-plus";
import { useUserStore } from "../stores/userStore.js";
import request from "../utils/request.js";

const userStore = useUserStore();
const maskedEmail = computed(() => {
  const email = userStore.email;
  const emailParts = email.split('@');
  const [emailName, emailDomain] = emailParts;
  const firstTwo = emailName.slice(0, 2);
  const lastTwo = emailName.slice(-2);
  return `${firstTwo}***${lastTwo}@${emailDomain}`;
});
const props = defineProps({
  signal: Boolean,
});
const show = ref(false);
const resetFormRef = ref();
const resetForm = reactive({
  password: "",
  checkPassword: "",
  verification_code: "",
});
const rules = reactive({
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度必须在6到20个字符之间', trigger: 'blur' },
    { pattern: /^[A-Za-z\d]{6,20}$/, message: '密码只能包含字母和数字，不能包含特殊字符和空格', trigger: 'blur' }
  ],
  checkPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== resetForm.password) {
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

const getCode = async () => {
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
    const response = await request.get("/auth/reset_varify");
    if (response.code == 200) {
      ElMessage.success(response.message);
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error(error);
  }

};

const reset = async () => {
  const valid = await resetFormRef.value.validate();
  if (!valid) return;
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: "正在加载中...",
  });
  try {
    const response = await request.post("/auth/reset_password", resetForm);
    if (response.code == 200) {
      ElMessage.success(response.message);
      resetForm.password = "";
      resetForm.checkPassword = "";
      resetForm.verification_code = "";
      show.value = false;
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error(error);
  }
  loadingInstance.close();
};

const cancel = () => {
  show.value = false;
};

watch(props, () => {
  show.value = true; // 当参数发生变化时，显示对话框
});

</script>

<style scoped>
.form {
  width: 20vw;
}

.code-container {
  display: flex;
}
</style>