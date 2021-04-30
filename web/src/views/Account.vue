<template>
  <div class="account">
      <h1 class="page-title">Account</h1>
      <div class="container">
          <span class="field"><span class="bold">Name: </span>{{user.name}}</span>
          <span class="field"><span class="bold">Email: </span>{{user.email}}</span>
          <span class="field"><span class="bold">Code: </span>"{{user.code}}"</span>
      </div>
  </div>
</template>

<script>
export default {
    name:'account',
    created(){
        console.log(this.user)
    },
    computed:{
        user(){
            return this.$store.state.user
        }
    },
}
</script>
<style lang="scss">
.account{
    .container{
        height: 25vh;
        font-size: 3.5rem;
        align-items: flex-start;
    }

    .field{
        margin-bottom: 1.4rem;
    }
}
</style>