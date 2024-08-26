<template>
    <div class="drawing">    
      <!-- CANVAS -->
      <div class="drawing__canvas"> 
        <vue-drawing-canvas
          ref="VueCanvasDrawing"
          v-model:image="image"
          :height="400"
          :width="500"
          :lineWidth="lineWidth"
          :strokeType="strokeType"
          :fillShape="false"
          :lineCap="lineCap"
          :lineJoin="lineJoin"
          :color="color"
          saveAs="png"
          :styles="{
            border: 'solid 1px #000',
          }"
        />
      </div>  
      <!-- CONTROLS -->
      <div class="drawing__controls">
        <Button padding="0px" font-size="12px" @click.prevent="$refs.VueCanvasDrawing.undo()">
          <IconArrowBackUp size="20" /> Desfazer
        </Button>
        <Button padding="0px" font-size="12px" @click.prevent="$refs.VueCanvasDrawing.reset()">
          <IconEraser  size="20" /> Limpar
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
		strokeType:{ default:'dash',type:String},
		lineWidth:{ default:3,type:Number},
	})
  const image = ref(null);
  const lineCap = ref('square');
  const lineJoin = ref('round');
  

</script>
  
<style lang="scss">
@import '@/scss/mixings';

  .drawing {
    @include flexbox(column, center, center);
    &__canvas{
      border: none;
    }
    &__controls {
      @include flexbox(row, center, center);
      gap: 10px;
      margin-top: 20px;
    }
  }

  canvas#VueDrawingCanvas {
    border: 0 !important;
  }

</style>
  