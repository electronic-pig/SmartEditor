import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from '../stores/userStore.js';
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import DashBoard from "../views/DashBoard.vue";
import EditView from "../views/EditView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/edit",
      name: "edit",
      component: EditView,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashBoard,
      meta: { requiresAuth: true },
      children: [
        {
          path: "/",
          redirect: "/dashboard/IndexPage",
        },
        {
          path: "IndexPage",
          name: "IndexPage",
          component: () => import("../components/IndexPage.vue"),
        },
        {
          path: "DocumentPage",
          name: "DocumentPage",
          component: () => import("../components/DocumentPage.vue"),
        },
        {
          path: "TemplatePage",
          name: "TemplatePage",
          component: () => import("../components/TemplatePage.vue"),
        },
        {
          path: "StarPage",
          name: "StarPage",
          component: () => import("../components/StarPage.vue"),
        },
        {
          path: "RecyclePage",
          name: "RecyclePage",
          component: () => import("../components/RecyclePage.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;
