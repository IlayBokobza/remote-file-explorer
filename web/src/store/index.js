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
    setPcOffline(state,id){
      const pcIndex = state.user.computers.findIndex(pc => id === `${pc._id}`)

      if(pcIndex === -1){
        console.log(pcIndex)
        return
      }

      state.user.computers[pcIndex].socketId = null
    }
  },
  actions: {
  },
  modules: {
  }
})
