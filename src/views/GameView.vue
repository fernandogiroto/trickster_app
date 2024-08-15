
<template>
    <div class="game-view"  :style="{ backgroundColor: userColor }">
    <div class="game-view__user" v-if="currentUser">
      <h2>{{ currentUser.username }}</h2>
      <p v-if="showWord">{{ currentUser.word }}</p>
      <button class="button button__dark"  v-if="!showWord" @click="showWord = true">Mostrar Palavra</button>
      <button v-if="showWord" @click="nextUser">Esconder Palavra e Próximo</button>
    </div>
    <div v-else>
      <p>Todos os utilizadores foram exibidos.</p>
      <button>Começar o jogo</button>
      <button @click="refreshGame">Sortear Novamente</button>
    </div>
    <button @click="backHome">Voltar</button>
  </div>
</template>
  
  
<script setup>

    import {onMounted, computed, ref} from 'vue';
    import { useGameStore } from '@/stores/game';
    import wordData from '@/utils/words';
    import router from '@/router';

    const store = useGameStore();
    const words = wordData.words;
    const currentIndex = ref(0);
    const showWord = ref(false);
    const currentUser = computed(() => store.users[currentIndex.value]);
    const lastIndex = ref([]);
    const userColor = ref('');

    const getRandomIndexExcludingLast = () => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * words.length);
      } 
      while (lastIndex.value.includes(randomIndex));
      lastIndex.value.push(randomIndex);
      if (lastIndex.value.length > 10) {
        lastIndex.value.shift();
      }
      return randomIndex;
    }

    const backHome = () => {
      router.push({name:'home'})
    }

    const nextUser = () => {
        showWord.value = false;
        currentIndex.value++;
    }

    const refreshGame = () => {
        currentIndex.value = 0; 
        const randomIndex = getRandomIndexExcludingLast();
        store.updateUserWord(words[randomIndex]); 
        showWord.value = false;
    };

    const generateColor = () => {
      let cor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      return cor;
    }

    onMounted(() => {
        const randomIndex = getRandomIndexExcludingLast();
        store.updateUserWord(words[randomIndex]);
        userColor.value = generateColor()
    })

</script>

<style lang="scss">

  @import '@/scss/mixings';

  .game-view{
    @include flexbox(column,center,center);
    height: 100%; 
    overflow: hidden; 
    overflow: hidden;
    margin: 15px;
    border: 5px double #000;
    box-shadow: 3px 2px 11px 10px rgb(90 77 77 / 16%);
    border-radius: 10px;
    &__user{
      padding: 20px;
    }
  }

</style>
  
  