import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user:null
  },
  mutations: {
    setUser:(state,payload) => (state.user = payload),
    setComputers:(state,payload) => (state.user.computers = payload),
  },
  actions: {
  },
  modules: {
  }
})
