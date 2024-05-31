import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    token: null,
    username: null
  }),
  getters: {
    isLoggedIn() {
      return this.token !== null;
    },
  },
  actions: {
    setToken(token) {
      this.token = token;
    },
    removeToken() {
      this.token = null;
    },
    setUsername(username) {
      this.username = username;
    },
    removeUsername() {
      this.username = null;
    }
  }
})