
<template>
    <div>
    <div v-if="currentUser">
      <h2>{{ currentUser.username }}</h2>

      <p v-if="showWord">{{ currentUser.word }}</p>

      <button v-if="!showWord" @click="showWord = true">Mostrar Palavra</button>
      <button v-if="showWord" @click="nextUser">Esconder Palavra e Próximo</button>
    </div>
    <div v-else>
      <p>Todos os utilizadores foram exibidos.</p>
      <button @click="refreshGame">Sortear Novamente</button>
    </div>
  </div>
</template>
  
  
<script setup>

    import {onMounted, computed, ref} from 'vue';
    import { useGameStore } from '@/stores/game';
    import wordData from '@/utils/words';

    const store = useGameStore();
    const words = wordData.words;
    const currentIndex = ref(0);
    const showWord = ref(false);
    const currentUser = computed(() => store.users[currentIndex.value]);

    const nextUser = () => {
        showWord.value = false;
        currentIndex.value++;
    }

    const refreshGame = () => {
        currentIndex.value = 0; 
        const randomIndex = Math.floor(Math.random() * words.length);
        store.updateUserWord(words[randomIndex]); 
        showWord.value = false;
    };

    onMounted(() => {
        const randomIndex = Math.floor(Math.random() * words.length);
        store.updateUserWord(words[randomIndex]);
    })

</script>
  
  