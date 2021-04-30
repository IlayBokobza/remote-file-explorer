import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/index'
import Explorer from "../views/Explorer.vue";
import Signup from '../views/Signup.vue';
import Login from '../views/Login.vue';
import Account from '../views/Account.vue';
import Homepage from '../views/Homepage.vue';

Vue.use(VueRouter)

//route guards
const onlyLoggedIn = (to,from,next) => {
  if(store.state.user){
    next()
  }else{
    next({name:'homepage'})
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
    path:'/',
    name:'homepage',
    component:Homepage,
    beforeEnter:onlyNotLoggedIn
  },
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
  {
    path:'/account',
    name:'account',
    component:Account,
    beforeEnter:onlyLoggedIn,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
