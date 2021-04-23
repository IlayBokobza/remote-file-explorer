import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/index'
import Explorer from "../views/Explorer.vue";
import Signup from '../views/Signup.vue';
import Login from '../views/Login.vue';

Vue.use(VueRouter)

//route guards
const onlyLoggedIn = (to,from,next) => {
  if(store.state.user){
    next()
  }else{
    next({name:'login'})
  }
}

const onlyNotLoggedIn = (to,from,next) => {
  if(!store.state.user){
    next()
  }else{
    next({name:'explorer'})
  }
}

//routes
const routes = [
  {
    path: '/explorer',
    name: 'explorer',
    component: Explorer,
    beforeEnter:onlyLoggedIn,
  },
  {
    path:'/signup',
    name:'signup',
    component:Signup,
    beforeEnter:onlyNotLoggedIn,
  },
  {
    path:'/login',
    name:'login',
    component:Login,
    beforeEnter:onlyNotLoggedIn,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
