import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    token: null,
    username: null
  }),
  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);  // 将 token 保存在 localStorage 中
    },
    removeToken() {
      this.token = null;
      localStorage.removeItem('token');  // 从 localStorage 中移除 token
    },
    setUsername(username) {
      this.username = username;
      localStorage.setItem('username', username);  // 将 username 保存在 localStorage 中
    },
    removeUsername() {
      this.username = null;
      localStorage.removeItem('username');  // 从 localStorage 中移除 username
    }
  }
})