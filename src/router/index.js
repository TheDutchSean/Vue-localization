import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Localization from "../views/Localization.vue";
import Dynamic from "../views/Dynamic.vue";
import Numbers from "../views/Numbers.vue";

export const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/Dynamic",
    name: "Dynamic",
    component: Dynamic,
  },
  {
    path: "/Localization",
    name: "Localization",
    component: Localization,
  },
  {
    path: "/Numbers",
    name: "Numbers",
    component: Numbers,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
