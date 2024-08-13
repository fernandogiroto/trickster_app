<template>
  
  <div class="trickster-video">
    <video autoplay muted playsinline loop>
      <source src="@/assets/videos/trickster.mov" type="video/mp4">
      Seu navegador não suporta o elemento de vídeo.
    </video>
    <Logo></Logo>
  </div>
  <div class="game-start">
    <input type="text"  v-model="username">
  <button @click="addUser(username)">Adicionar Usuário</button>
  <button @click="newGame()">Começar Jogo</button>
  </div>

  

</template>


<script setup>

  import {ref} from 'vue';
  import { useGameStore } from '@/stores/game';
  import Logo from '@/components/Logo.vue';
  import router from '@/router';
  const store = useGameStore();

  const username = ref('');

  const newGame = () => {
    router.push({name:'game'})
};

  const addUser = () => {
    if (username.value) {
      store.addUser(username.value, '');
      username.value = '';
    }
  };
 
</script>

<style>
.trickster-video {
  width: 100%; /* Ajusta a largura do contêiner pai */
  height: 100%; /* Ajusta a altura do contêiner pai */
  overflow: hidden; /* Garante que nada saia do contêiner */
  position: relative; /* Necessário para posicionamento absoluto do vídeo */
  display: flex;
  flex-direction: column;
}

video {
  top: 0; /* Alinha o vídeo ao topo do contêiner pai */
  left: 0; /* Alinha o vídeo à esquerda do contêiner pai */
  width: 100%; /* Faz com que o vídeo ocupe 100% da largura do contêiner pai */
  height: 100%; /* Faz com que o vídeo ocupe 100% da altura do contêiner pai */
  object-fit: cover; /* Faz com que o vídeo cubra o contêiner, mantendo a proporção */
}
</style>