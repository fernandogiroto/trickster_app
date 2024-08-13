
<template>

    <p>Palavra: {{ randomObject }}</p>
    <p>Jogadores: {{ store.users }}</p>

</template>
  
  
<script setup>

    import {ref} from 'vue';
    import { useGameStore } from '@/stores/game';
    import wordData from '@/utils/words';

    const store = useGameStore();

    const words = wordData.words;

    const getRandomObject = () => {
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex];
    };

    const randomObject = ref(getRandomObject());

</script>
  
  