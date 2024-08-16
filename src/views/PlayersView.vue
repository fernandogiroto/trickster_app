
<template>
  <div class="player-view"  :style="{ backgroundColor: currentUser ? currentUser.color : '#c1c1c1' }">
    <div class="player-view__user" v-if="currentUser">
      <span class="player-view__user--player">{{ currentUser.username }}</span>
      <span class="player-view__user--current-word top-to-bottom--effect" v-if="showWord">{{ currentUser.word }}</span>
      <Button background="button__dark text-uppercase" width="100%" height="50px" @click="showWord = true"  v-if="!showWord">MOSTRAR PALAVRA</Button>
      <Button background="button-outline__dark text-uppercase" width="100%" height="50px" fontSize="13px" v-if="showWord" @click="nextUser">Esconder Palavra e Próximo</button>
    </div>
    <div class="player-view__user" v-else>
      <span class="player-view__user--finished">Todos os utilizadores foram exibidos.</span>
      <Button background="button__dark text-uppercase" width="100%" height="50px" @click="goToGame">Começar o jogo</Button>
      <Button background="button-outline__dark text-uppercase" width="100%" height="50px" fontSize="13px" @click="refreshGame">Sortear Novamente</Button>
    </div>
    <div class="return-button bottom-to-top--effect" v-if="returnPage">
     <IconArrowLeft size="20" @click="backHome" />
    </div>
  </div>
</template>

<script setup>

    import {onMounted, computed, ref} from 'vue';
    import { IconArrowLeft } from '@tabler/icons-vue';
    import { useGameStore } from '@/stores/game';
    import Button from '@/components/Button.vue';
    import wordData from '@/utils/words';
    import router from '@/router';

    const store = useGameStore();
    const words = wordData.words;
    const currentIndex = ref(0);
    const showWord = ref(false);
    const currentUser = computed(() => store.users[currentIndex.value]);
    const lastIndex = ref([]);
    const returnPage = ref(false);

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
      returnPage.value = false;
      router.push({name:'home'})
    }

    const goToGame = () => {
      router.push({name:'game'})
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

    onMounted(() => {
      const randomIndex = getRandomIndexExcludingLast();
      store.updateUserWord(words[randomIndex]);
      setTimeout(()=>{
        returnPage.value = true;
      },300)
    })

</script>

<style lang="scss">

  @import '@/scss/mixings';

  .player-view{
    @include flexbox(column,center,center);
    height: 100%; 
    overflow: hidden; 
    margin: 15px;
    border: 5px double #000;
    box-shadow: 3px 2px 11px 10px rgb(90 77 77 / 16%);
    border-radius: 10px;
    &__user{
      @include flexbox(column,center,center);
      gap: 15px;
      width: 250px;
      &--player{
        @include flexbox(column,center,center);
        width: 100%;
        padding: 0px;
        text-transform: uppercase;
        color: var(--theme-color);
      }
      &--current-word{
        @include flexbox(column,center,center);
        width: 100%;
        padding: 15px;
        border-radius: 5px;
        border: 2px dotted #000;
        text-transform: uppercase;
        background-color: var(--theme-color);
      }
    }
  }

  .return-button{
    position: absolute;
    top: 30px;
    left: 30px;
  }

</style>
  
  