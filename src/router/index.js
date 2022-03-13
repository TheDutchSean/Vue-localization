import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Localization from "../views/Localization.vue";
import Dynamic from "../views/Dynamic.vue";
import Currency from "../views/Currency.vue";
import Installation from "../views/Installation.vue";

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
    path: "/Currency",
    name: "Currency",
    component: Currency,
  },
  {
    path: "/Installation",
    name: "Installation",
    component: Installation,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
