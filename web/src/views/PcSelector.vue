<template>
  <div class="pcSelector">
    <div class="container">
        <div v-if="user.computers.length">
            <!-- online computers -->
            <div v-if="onlinePc.length">
                <h2 class="title">Onine Computers</h2>
                <div @click="selectComputer(pc._id)" class="explorer-item" v-for="pc in onlinePc" :key="pc._id">
                    <span class="material-icons">desktop_windows</span>
                    <p>{{ pc.name }}</p>
                </div>
            </div>
            <h2 class="title" v-else>No online computers</h2>
            <!-- offline computers -->
            <details v-if="offlinePc.length">
                <summary class="title gray">Offline Computers</summary>
                <div class="explorer-item" v-for="pc in offlinePc" :key="pc._id">
                    <span class="material-icons">desktop_windows</span>
                    <p>{{ pc.name }}</p>
                </div>
            </details>
        </div>
        <h2 class="title" v-else>No computers connected to your account</h2>
    </div>
    <!-- refresh btn -->
    <div class="explorer-controls explorer-controls--left">
        <button @click="refresh" id="pc-selector-refresh-btn">
            <span class="material-icons">autorenew</span>
        </button>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: "pcSelector",
  methods:{
      selectComputer(id){
          this.$router.push({path:'/explorer',query:{pc:id}})
      },
      refresh(){
        //refreshes
        axios.get('/api/users/pc',{
            headers:{
                authorization:`Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => {
            this.$store.commit('setComputers',res.data)
        }).catch(err => {
            console.warn(err.response)
        })

        //animates btn
        const ref = document.getElementById('pc-selector-refresh-btn')
        ref.classList.add('spin')
        setTimeout(() => {ref.classList.remove('spin')},200)
      }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    onlinePc() {
      return this.user.computers.filter((pc) => pc.socketId);
    },
    offlinePc() {
      return this.user.computers.filter((pc) => !pc.socketId);
    },
  },
};
</script>
<style lang="scss">
.pcSelector {
  div:not(.container):not(.explorer-controls){
      width: 100%;
      text-align: center;
  }

  .title {
    margin-bottom: 2rem;
  }

  details {
    text-align: center;
    width: 100%;
  }

  summary {
    cursor: pointer;
    user-select: none;
  }

  .gray {
    color: rgb(119, 119, 119);
  }
}
</style>