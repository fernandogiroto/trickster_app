<template>
  <div class="game-view">
    <!-- VIDEO GAME INTRO -->
    <div class="game-view__video" v-if="showIntro">
      <TricksterLogo border="none" :animatedTitle="false">
        <template #video>
          <source src="@/assets/videos/trickster_intro.mp4" type="video/mp4">
        </template>
      </TricksterLogo>
      <AnimatedText :title="'O IMPOSTOR'" />
      <audio ref="audioPlayer" autoplay>
        <source src="@/assets/audios/trickster_intro.mp3" type="audio/mp3">
      </audio>
    </div>
    <!-- GAME PLAYERS -->
    <ul class="game-view__players" v-if="!showIntro">
      <li  v-for="(user, index) in activePlayers" :key="user"
      :style="{
            color: user.color,
            border: `2px solid ${user.borderColor}`,
            boxShadow: `0 0 0 3px ${user.borderColor}`
        }"
      :class="[{ 'game-view__players--active' : index === currentIndex }]">
        <IconSpy size="25" /> {{  user.username }}
      </li>
    </ul> 
    <!-- GAME DRAWING -->
    <div class="game-view__drawing" v-if="!showIntro">
      <Drawing :color="currentUser.color"/>
    </div>
    <!-- GAME OPTIONS -->
    <div class="game-view__options" v-if="!impostorDiscovered && !showIntro">
      <Button padding="0px" font-size="12px" @click="openModal">Abrir Votação</Button>
      <Button padding="0px" font-size="12px" class="button-outline__primary" @click="nextUser">Próximo</Button>
      <Button padding="0px" font-size="12px" @click="restartGame">Restart Game</Button>
    </div>
    <!-- GAME VOTING -->
    <GameVoting 
      :isOpen="isModalOpen" 
      @close="closeModal" 
      :activePlayers="activePlayers" 
      @finalize-voting="finalizeVoting">
    </GameVoting>
  </div>

</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useGameStore } from '@/stores/game';
import TricksterLogo from '@/components/TricksterLogo.vue';
import AnimatedText from '@/components/AnimatedText.vue';
import Drawing from '@/components/Drawing.vue';
import Button from '@/components/Button.vue';
import GameVoting from '@/components/Modal.vue';
import { useRouter } from 'vue-router';
import { IconSpy } from '@tabler/icons-vue';

const store = useGameStore();
const router = useRouter();
const currentIndex = ref(0);
const audioPlayer = ref(null);
const showIntro = ref(true);
const isModalOpen = ref(false);
const impostorDiscovered = ref(false);
const activePlayers = computed(() => {
  return store.users.filter(user => !user.eliminated);
});
const currentUser = computed(() => {
  return activePlayers.value[currentIndex.value] || null;
});

onMounted(() => {
  setTimeout(() => {
    if (audioPlayer.value) {
      audioPlayer.value.muted = true; 
    }
    showIntro.value = false; 
  }, 5000);
});

const openModal = () => {
  isModalOpen.value = true;
}

const closeModal = () => {
  isModalOpen.value = false;

  if (!activePlayers.value[currentIndex]) {
    nextUser();
  }
}

const nextUser = () => {
  currentIndex.value++;
  if (currentIndex.value >= activePlayers.value.length) {
    currentIndex.value = 0;
  }
}

const finalizeVoting = (eliminatedPlayer) => {
  if (eliminatedPlayer) {
    impostorDiscovered.value = true;
  }
};

const restartGame = () => {
  router.push({
    name:'players',
    query: { refresh: 'true'}
  })
}
</script>

<style lang="scss">
@import '@/scss/mixings';

.game-view {
  @include flexbox(column, center, center);
  gap: 15px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  padding: 15px 10px;

  &__video{
    @include flexbox(column, initial, initial);
    width: 100%;
  }
  &__players{
    @include flexbox(row, center, center);
    flex-wrap: wrap;
    gap: 10px;

    li{
      @include flexbox(row, flex-start, center);
      gap: 8px;
      border-radius: 5px;
      padding: 8px 10px;
      background: #000;
      transition: background 0.3s, color 0.3s, border-color 0.3s;
    }
    &--active{
      font-weight: 900;
      border: 3px solid;
    }
  }
  &__options{
    @include flexbox(row, center, initial);
    gap: 10px;
    width: 100%;
  }
}



</style>
