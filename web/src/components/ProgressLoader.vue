<template>
    <div class="loader">
      <div :style="`transform: translateX(-${100-stage}%);`" class="loader__bg"></div>
    </div>
</template>
<script>
export default {
    name:'ProgressLoader',
    props:['stage']
}
</script>
<style lang="scss" scoped>
@import "../sass/mixins";
.loader {
  width: 75%;
  height: 4rem;
  border:solid #777777 .2rem;
  border-radius: 2rem;
  overflow: hidden;
  @include center;

  &__bg{
    transition: all .3s;
    transform: translateX(-100%);
    width: 100%;
    height: 100%;
    background-image: linear-gradient(90deg, rgba(71,149,173,1) 0%, rgba(51,196,170,1) 100%);
  }
}
</style>