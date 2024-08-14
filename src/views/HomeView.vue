<template>
  <div class="trickster-video">
    <video autoplay muted playsinline loop>
      <source src="@/assets/videos/trickster.mov" type="video/mp4">
      Seu navegador não suporta o elemento de vídeo.
    </video>
    <AnimatedText title="O IMPOSTOR"/>
  </div>
  <div class="game-start">
    <input type="text"  v-model="username">
    <button @click="addUser(username)">Adicionar Usuário</button>
    <button @click="newGame()">Começar Jogo</button>

    <div class="users">
      <h3>Lista de jogadores:</h3>
      <ul>
        <li v-for="user in store.users">
          {{  user.username }}
          <button @click="removeUser(user.username)">Remover</button>
        </li>
      </ul>

      <button @click="clearUsers()">Remover todos os jogadores</button>
    </div>
  </div>
</template>

<script setup>

  import {ref} from 'vue';
  import { useGameStore } from '@/stores/game';
  import AnimatedText from '@/components/AnimatedText.vue';
  import router from '@/router';
  const store = useGameStore();

  const username = ref('');

  const newGame = () => {
    router.push({name:'game'})
};

  const addUser = () => {
    if (username.value) {
      store.addUser(username.value);
      username.value = '';
    }
  };

  const removeUser = (name) => {
    store.removeUser(name);
  }

  const clearUsers = () => {
    store.clearUsers();
  }
 
</script>

<style lang="scss">

  @import '@/scss/mixings';

  .trickster-video {
    @include flexbox(column,initial,initial);
    width: 100%; 
    height: 100%; 
    overflow: hidden; 
    position: relative; 
  }

  video {
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100%;
    object-fit: cover; 
  }

</style>