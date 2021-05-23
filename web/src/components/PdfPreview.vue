<template>
  <div class="pdf-preview">
      <iframe :src="`data:application/pdf;base64, ${base64}`" frameborder="0" class="explorer__pdf"></iframe>
  </div>
</template>

<script>
export default {
    name:'PdfPreview',
    props:['base64']
}
</script>

<style lang="scss">
@import "../sass/mixins";
.pdf-preview{
    iframe{
        @include center;
        position: fixed;
        min-height: 100%;
        width: 100%;
    }
}
</style>