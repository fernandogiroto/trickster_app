
<template>
  <video autoplay muted playsinline>
      <source src="@/assets/videos/trickster.mov" type="video/mp4">
      Seu navegador não suporta o elemento de vídeo.
    </video>
  Artista Impostor
  <input type="text"  v-model="username">
  <button @click="addUser(username)">Adicionar Usuário</button>
  <button @click="newGame()">Começar Jogo</button>
</template>


<script setup>

  import {ref} from 'vue';
  import { useGameStore } from '@/stores/game';
  import router from '@/router';
  const store = useGameStore();

  const username = ref('');

  const newGame = () => {
    router.push({name:'game'})
};

  const addUser = () => {
    if (username.value) {
      store.addUser(username.value, 'impostor');
      username.value = '';
    }
  };
 
</script>

