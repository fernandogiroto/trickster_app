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
        }"
      />
  
      <!-- Canvas controls -->
      <div class="controls">
        <button type="button" @click.prevent="$refs.VueCanvasDrawing.undo()">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrow-counterclockwise"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"
              />
              <path
                d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"
              />
          </svg>
          Desfazer
        </button>

        <button type="button" @click.prevent="$refs.VueCanvasDrawing.reset()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-file-earmark"
            viewBox="0 0 16 16"
          >
            <path
              d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"
            />
          </svg>
          Limpar tudo
        </button>
      </div>
    </div>
  </template>
  
<script setup>
  import { ref } from 'vue';
  import VueDrawingCanvas from 'vue-drawing-canvas';
  
  const props = defineProps({
		color:{ default:'#000000',type:String},
	})
  // Estado para a imagem, linha e cor.
  const image = ref(null);
  const lineWidth = ref(2);

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
  