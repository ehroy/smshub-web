import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../components/Loginpage.vue";
import DashboardPage from "../components/Dashboard.vue";

const routes = [
  { path: "/", component: LoginPage },
  {
    path: "/dashboard",
    component: DashboardPage,
    beforeEnter: (to, from, next) => {
      const apiKey = localStorage.getItem("api_key");
      if (!apiKey) {
        next("/");
      } else {
        next();
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
