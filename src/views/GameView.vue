<template>
  <div class="game-view">
    <transition name="game" @before-leave="beforeLeave" @leave="onLeave">
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
    </transition>

    <div v-if="!showIntro" class="game-view">
      <div class="drawing-wrap" >
        <Drawing :color="currentUser.color"/>
      </div>

      <div v-if="!impostorDiscovered" class="players">
        <ul class="user-list">
          <li 
          v-for="(user, index) in activePlayers"
          :key="index"
          :style="{ color: user.color}"
          :class="{ 'current-user': index === currentIndex }"
          >
            {{  user.username }}
          </li>
        </ul>
      </div>

      <div v-if="!impostorDiscovered" class="voting">
        <button type="button" @click="openModal">Abrir votação</button>
        <button type="button" @click="nextUser">Próximo jogador</button>
      </div>

      <div v-if="impostorDiscovered" class="restart">
        <button type="button" @click="restartGame">Restart game</button>
      </div>


      <VotingModal 
        :isOpen="isModalOpen" 
        @close="closeModal" 
        :activePlayers="activePlayers" 
        @finalize-voting="finalizeVoting"
      >
        <p>Conteúdo do slot</p>
      </VotingModal>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useGameStore } from '@/stores/game';
import TricksterLogo from '@/components/TricksterLogo.vue';
import AnimatedText from '@/components/AnimatedText.vue';
import Drawing from '@/components/Drawing.vue';
import VotingModal from '@/components/VotingModal.vue';
import { useRouter } from 'vue-router';

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

function beforeLeave(el) {
  el.style.opacity = 1;
}

function onLeave(el, done) {
  el.offsetHeight; 
  el.style.transition = 'opacity 0.5s ease';
  el.style.opacity = 0;
  el.addEventListener('transitionend', done, { once: true });
}

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
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  &__video {
    @include flexbox(column, initial, initial);
    width: 100%;
  }
}

.user-list {
  display: flex;
}

.user-list li {
  margin: 5px;
}

.current-user {
  text-decoration: underline;
  font-weight: bold;
}

</style>
