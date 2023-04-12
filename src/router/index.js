import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/Login.vue";
import Chat from "../views/Chat.vue";


const routes = [
  {
    path: "/",
    name: "login",
    component: Login,
  },
  {
    path: "/chat",
    name: "chat",
    component: Chat,
  },
];


const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
