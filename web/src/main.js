import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

Vue.config.productionTip = false

const loadVue = () => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')  
}

const token = localStorage.getItem('token')

if(token){
  axios.get('/api/users/',{
    headers:{
      'Authorization':`Bearer ${token}`
    }
  }).then(res => {
    store.commit('setUser',res.data)
    loadVue()
  }).catch(err => {
    console.warn(err.response)
    loadVue()
  })
}else{
  loadVue()
}