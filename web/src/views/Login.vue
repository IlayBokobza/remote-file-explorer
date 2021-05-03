<template>
  <div class="login-signup">
      <h1 class="page-title">Login</h1>
      <div class="container">
        <form class="form" @submit.prevent="login">
            <div class="input">
                <input v-model="email" id="signup-email" placeholder=" " type="email">
                <label for="signup-email">Email</label>
            </div>
            <div class="input">
                <input v-model="password" id="signup-password" placeholder=" " type="password">
                <label for="signup-password">Password</label>
            </div>
            <p v-if="feedback" class="feedback">{{feedback}}</p>
            <button>Log in</button>
        </form>
      </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name:'signup',
    data(){
        return{
            email:null,
            password:null,
            feedback:null,
        }
    },
    methods:{
        login(){
            if(!this.email || !this.password){
                return this.feedback = 'Please fill out all fields.'
            }

            this.feedback = null
            const formData = {
                email:this.email,
                password:this.password
            }

            axios.post('/api/users/login',formData).then(res => {
                localStorage.setItem('token',res.data.token)
                this.$store.commit('setUser',res.data.user)
                this.$router.push({path:'/explorer'})     
            }).catch(err => {
                this.feedback = err.response.data.error
            })
        }
    }
}
</script>