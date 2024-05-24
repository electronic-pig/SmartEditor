import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import DashBoard from "../views/DashBoard.vue";

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
      path: "/dashboard",
      component: DashBoard,
      children: [
        {
          path: "",
          redirect: "/dashboard/Apage",
        },
        {
          path: "Apage",
          name: "Apage",
          component: () => import("../components/IndexPage.vue"),
        },
        {
          path: "Bpage",
          name: "Bpage",
          component: () => import("../components/DocumentPage.vue"),
        },
        {
          path: "Cpage",
          name: "Cpage",
          component: () => import("../components/TemplatePage.vue"),
        },
      ],
    },
  ],
});

export default router;
