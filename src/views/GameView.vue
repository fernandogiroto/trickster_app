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
    <div v-if="!showIntro">
      CANVAS
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import TricksterLogo from '@/components/TricksterLogo.vue';
import AnimatedText from '@/components/AnimatedText.vue';

const audioPlayer = ref(null);
const showIntro = ref(true);

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

</style>
