<template>
    <div class="homepage">
        <h1 class="title">Connect <span class="sub">Remotely Access Any Computer's Files.</span></h1>
        <footer>
            <router-link to="/signup">Sign up!</router-link>
        </footer>
    </div>
</template>
<script>
export default {
    name:'homepage'
}
</script>
<style lang="scss">
.homepage{
    .title{
        text-align: center;
        color: #fff;
        font-size: 10rem;
        animation: fadeIn .7s ease-in;
        margin-top: 2rem;

        .sub{
            display: block;
            color: #fff;
            margin-top: 1rem;
            font-size: 3rem;
        }
    }

    //footer
    footer{
        width: 100vw;
        background-color: rgb(78, 78, 78);
        height: 20rem;
        position: absolute;
        bottom: 0;
        display: grid;
        place-items: center;

        a{
            font-size: 5rem;
            background: rgb(207, 207, 207);
            padding: 1rem 2rem;
            border-radius: 20px;
            transition: all .2s;
            box-shadow: .7rem .5rem .3rem rgba(#000,.5);

            &:hover{
                transform: translateY(-1rem);
                box-shadow: 1rem 1rem .3rem rgba(#000,.5);
            }

            &:active{
                transform: translateY(-.5rem);
                box-shadow: .5rem .5rem .2rem rgba(#000,.5);
            }
        }
    }
}
</style>