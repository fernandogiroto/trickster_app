<template>
    <div class="drawing-container">
      <h2>Cada jogador desenha um pouco:</h2>
      
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
          width: '100%',
        }"
      />
  
      <!-- Canvas controls -->
      <div class="controls">
        <button type="button" @click.prevent="$refs.VueCanvasDrawing.undo()">
          Desfazer
        </button>
        <button type="button">Abrir votação</button>
      </div>
    </div>
  </template>
  
<script setup>
  import { ref } from 'vue';
  import VueDrawingCanvas from 'vue-drawing-canvas';
  
  // Estado para a imagem, linha e cor.
  const image = ref(null);
  const lineWidth = ref(2);
  const color = ref('#000000');

</script>
  
<style>
  .drawing-container {
    text-align: center;
    margin: 20px;
  }

  .controls {
    margin-top: 20px;
  }

  button {
    margin: 0 10px;
    padding: 5px 10px;
  }
</style>
  