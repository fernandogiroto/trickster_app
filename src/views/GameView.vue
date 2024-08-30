<template>
  <div class="game-view">
    <!-- GAME INTRO -->
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
    <div class="game-view__players" v-if="!showIntro">
        <Flicking :options="flickingOptions" :plugins="plugins" ref="flicking">
          <div class="flicking-panel"  v-for="(user, index) in activePlayers" :key="index">
            <div 
            :class="[
                'flicking-panel__player',
                { 'flicking-panel__player--active': index === currentIndex }
              ]"
              :style="{ backgroundColor: user.color }" > 
              <IconSpy size="22" /> 
              {{ user.username }}   
            </div>
            <span class="flicking-panel__player--active-arrow" v-if="index === currentIndex">
              <IconTriangleFilled size="14" />
            </span>
          </div>
      </Flicking>
    </div>    
    <!-- GAME DRAWING -->
    <div class="game-view__drawing" v-if="!showIntro">
      <Drawing :color="currentUser ? currentUser.color : '#000'"/>
    </div>
    <!-- GAME OPTIONS -->
    <div class="game-view__options" v-if="!impostorDiscovered && !showIntro">
      <Button padding="px" font-size="12px" @click="toggleModal">Abrir Votação</Button>
      <Button padding="0px" font-size="12px" class="button-outline__primary" @click="nextUser">Próximo</Button>
      <Button padding="0px" font-size="12px" @click="restartGame">Restart Game</Button>
    </div>
    <!-- GAME VOTING -->
    <GameVoting 
      :isOpen="isModalOpen" 
      @update:isOpen="toggleModal()"
      :activePlayers="activePlayers" >
    </GameVoting>
     <!-- CHANGE PLAYER AUDIO -->
    <audio ref="changePlayer">
      <source src="@/assets/audios/change-player.mp3" type="audio/mp3">
    </audio>
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
import { IconSpy,IconTriangleFilled } from '@tabler/icons-vue';
import Flicking from "@egjs/vue3-flicking";
import "@egjs/vue3-flicking/dist/flicking.css";

const store = useGameStore();
const router = useRouter();
const currentIndex = ref(1);
const audioPlayer = ref(null);
const changePlayer = ref(null);
const showIntro = ref(true);
const isModalOpen = ref(false);
const impostorDiscovered = ref(false);
const flicking = ref(false);

const activePlayers = computed(() => {
  return store.users.filter(user => !user.eliminated);
});
const currentUser = computed(() => {
  return activePlayers.value[currentIndex.value] || null;
});
const playersNumber = computed(() => {
  if(activePlayers.value.length <=3){
    return 2;
  }else{
    return 3;
  }
});

const flickingOptions = {
    circular: true,
    align: 'center',
    moveType: 'strict',
    panelsPerView: playersNumber.value,
    disableOnInit: true,
    defaultIndex: 1
  }
const plugins = [];

onMounted(() => {
  setTimeout(() => {
    if (audioPlayer.value) {
      audioPlayer.value.muted = true; 
    }
    showIntro.value = false; 
  }, 5000);
});


const nextUser = () => {
  currentIndex.value++;
  changePlayer.value.play(); 
  if (currentIndex.value >= activePlayers.value.length) {
    currentIndex.value = 0;
    moveToPanel(currentIndex.value)
  }else{
    moveToPanel(currentIndex.value)
  }
}

const moveToPanel = (index) => {
  if (flicking.value) {
    flicking.value.moveTo(index, 0)
  }
  changePlayer.value.stop = true; 
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

const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value
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

  &__video{
    @include flexbox(column, initial, initial);
    width: 100%;
  }
  &__players{
    @include flexbox(row, center, center);
    flex-wrap: wrap;
    width: 100%;
    padding: 0px 10px;
    &--active{
      font-weight: 900;
      border: 3px solid;
    }
  }
  &__options{
    @include flexbox(row, center, initial);
    gap: 10px;
    width: 100%;
    padding: 0px 15px;
  }
}

.flicking-viewport {
    margin-left: auto;
    margin-right: auto;
    transition: height .5s;
    width: 100%;
    overflow: hidden;
    position: relative;
}

.flicking-panel {
  @include flexbox(column,  flex-start, center);
  gap: 5px;
  box-sizing: border-box;
  height: auto;
  margin-right: 10px;
  position: relative;
  width: 50%;
    &__player {
    @include flexbox(row,  center, center);
    gap: 5px;
    padding: 5px 0px;
    width: 100%;
    border-radius: 5px;
    transition: background 0.3s, color 0.3s, border-color 0.3s;
    &--active{
      margin-top: 2px;
      border: 2px solid #000;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.3s ease, border-color 0.3s ease;
    }
  }
}



</style>
