<template>
  <div class="login-signup">
      <h1 class="page-title">Signup</h1>
      <div class="container">
        <form class="form" @submit.prevent="signup">
            <div class="input">
                <input v-model="name" id="signup-name" placeholder=" " type="name">
                <label for="signup-name">Name</label>
            </div>
            <div class="input">
                <input v-model="email" id="signup-email" placeholder=" " type="email">
                <label for="signup-email">Email</label>
            </div>
            <div class="input">
                <input v-model="password" id="signup-password" placeholder=" " type="password">
                <label for="signup-password">Password</label>
            </div>
            <div class="input">
                <input v-model="rePassword" id="signup-rePassword" placeholder=" " type="password">
                <label for="signup-rePassword">Password</label>
            </div>
            <p v-if="feedback" class="feedback">{{feedback}}</p>
            <button>Sign Up</button>
        </form>
      </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
    name:'signup',
    data(){
        return{
            name:null,
            email:null,
            password:null,
            rePassword:null,
            feedback:null,
        }
    },
    methods:{
        signup(){
            //check for all fields
            if(!this.name || !this.email || !this.password || !this.rePassword){
                return this.feedback = 'Please fill out all fields.'
            }
            
            //checks passwords
            if(this.password !== this.rePassword){
                return this.feedback = 'Passwords are not the same.'
            }

            this.feedback = null
            const formData = {
                name:this.name,
                email:this.email,
                password:this.password,
                tempRePassword:this.rePassword
            }

            //send req
            axios.post('/api/users/signup',formData).then(res => {
                localStorage.setItem('token',res.data.token)
                this.$store.commit('setUser',res.data.user)
                location.reload()
            }).catch(err => {
                this.feedback = err.response.data
            })
        }
    },
}
</script>