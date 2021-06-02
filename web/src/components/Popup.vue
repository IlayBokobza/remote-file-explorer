<template>
  <div :class="{'popup-closing':closing}" class="popup">
      <div class="popup__container">
          <h2 class="popup__title">{{title||'Popup Title'}}</h2>
          <p class="popup__text">{{text||'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam, dolor. Tenetur, earum quam!'}}</p>
          <div class="popup__action-box">
              <button @click="accept">{{acceptText||'Accept'}}</button>
              <button v-if="!removeCancel" @click="closePopup">{{cancelText||'Cancel'}}</button>
          </div>
      </div>
  </div>
</template>
<script>
export default {
    name:'popup',
    props:['title','text','removeCancel','cancelText','acceptText'],
    data(){
        return {
            closing:false,
            accepted:false
        }
    },
    methods:{
        accept(){
            this.accepted = true
            this.closePopup()
        },
        closePopup(){
            this.closing = true

            setTimeout(() => {
                if(this.accepted){
                    this.$emit('accept')
                }else{
                    this.$emit('cancel')
                }

                this.$emit('closed')
            },500)
        }
    }
}
</script>
<style lang="scss">
.popup{
    position: fixed;
    background: rgba(#000,.5);
    width: 100vw;
    height: 100vh;
    display: grid;
    place-items: center;
    animation: backroundFade .7s forwards;

    &__container{
        width: 50rem !important;
        height: 30rem;
        box-shadow: 5px 4px 14px 3px rgba(#000, .3);
        background: #cecece;
        border-radius: 5px;
        animation: goDown .7s forwards;
        text-align: center;
        display: flex;
        flex-direction: column;
        padding: 1rem;

        *{
            flex: 1;
        }
    }

    &__title{
        font-size: 5rem;
        margin-bottom: 2rem;
    }

    &__text{
        font-size: 2rem;
        flex: 2;
    }

    &__action-box{
        width: 100%;
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-around;

        button{
            background: none;
            font-size: 2rem;
            transition: all .2s;
            
            &:hover{
                background:#4795AD;
                color: #cecece;
            }
        }
    }

    &-closing{
       animation: backroundUnfade .5s forwards;
        
        .popup__container{
            animation: goUp .5s forwards;
        }
    }
}

@keyframes backroundFade{
    from{
        background: rgba(#000,0);
    }to{
        background: rgba(#000,.5);
    }
}

@keyframes backroundUnfade{
    from{
        background: rgba(#000,.5);
    }to{
        background: rgba(#000,0);
    }
}
</style>