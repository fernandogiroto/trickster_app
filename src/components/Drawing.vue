<template>
    <div class="drawing">      
      <!-- Vue Drawing Canvas -->
      <vue-drawing-canvas
        ref="VueCanvasDrawing"
        v-model:image="image"
        :height="400"
        :width="700"
        :lineWidth="lineWidth"
        :color="color"
        saveAs="png"
        :styles="{
          border: 'solid 1px #000',
        }"
      />
      <!-- Canvas controls -->
      <div class="controls">
        <Button padding="0px" font-size="12px" @click.prevent="$refs.VueCanvasDrawing.undo()">
          <IconArrowBackUp size="20" /> Desfazer
        </Button>
        <Button padding="0px" font-size="12px" @click.prevent="$refs.VueCanvasDrawing.reset()">
          <IconEraser size="20" /> Limpar
        </Button>
      </div>
    </div>
  </template>
  
<script setup>
  import { ref } from 'vue';
  import VueDrawingCanvas from 'vue-drawing-canvas';
  import { IconArrowBackUp,IconEraser  } from '@tabler/icons-vue';
  import Button from '@/components/Button.vue';
  
  const props = defineProps({
		color:{ default:'#000000',type:String},
	})
  const image = ref(null);
  const lineWidth = ref(2);

</script>
  
<style lang="scss">
@import '@/scss/mixings';

  .drawing {
    @include flexbox(column, center, center);
  }

  .controls {
    @include flexbox(row, center, center);
    gap: 10px;
    margin-top: 20px;
  }

  canvas#VueDrawingCanvas {
    width: 100%;
    height: 400px;
}


</style>
  