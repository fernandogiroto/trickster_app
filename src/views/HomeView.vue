
<template>
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
      store.addUser(username.value);
      username.value = '';
    }
  };
 
</script>

