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

    <div class="drawing-wrap" v-if="!showIntro">
      <Drawing :color="currentUser.color"/>
    </div>
    <div class="players">
      <ul class="user-list">
        <li 
        v-for="(user, index) in store.users"
        :key="index"
        :style="{ color: user.color}"
        :class="{ 'current-user': index === currentIndex }"
        >
          {{  user.username }}
        </li>
      </ul>
    </div>
    <div class="voting">
      <button type="button" @click="openModal">Abrir votação</button>
      <button type="button" @click="nextUser">Próximo jogador</button>

      <VotingModal :isOpen="isModalOpen" @close="closeModal">
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

const store = useGameStore();
const currentIndex = ref(0);
const currentUser = computed(() => {
  return store.users[currentIndex.value];
});
const audioPlayer = ref(null);
const showIntro = ref(true);
const isModalOpen = ref(false);

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
}

const nextUser = () => {
  currentIndex.value++;

  if (currentIndex.value >= store.users.length) {
    currentIndex.value = 0;
  }
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
