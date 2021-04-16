import Vue from 'vue'
import VueRouter from 'vue-router'
import Explorer from "../views/Explorer.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'explorer',
    component: Explorer
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
