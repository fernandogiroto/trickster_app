<template>
  <Teleport to="#app">
    <div v-if="isOpen" class="backdrop" @click="toggleModal"></div>
      <div class="modal" v-if="isOpen">
        <div class="modal-results top-to-bottom--effect" v-if="showResult">
          <div @click="toggleModal" class="modal-results--close">
            <IconX size="22" />
          </div>
          <!-- WRONG IMPOSTOR -->
          <div class="modal-results__wrong-impostor">
            <div class="modal-results__wrong-impostor--title">
              <span>FERNANDO</span>
              <span>NAO ERA O IMPOSTOR</span>
            </div>
            <video autoplay muted playsinline class="modal-results__wrong-impostor--video"> 
              <source src="@/assets/videos/trickster_wrong.mp4" type="video/mp4">
            </video>
            <audio ref="audioPlayer" autoplay>
              <source src="@/assets/audios/trickster_wrong.mp3" type="audio/mp3">
            </audio>
          </div>


          <!-- <div v-if="userEliminated.username" class="has-eliminated">
            <h3 v-if="!isImpostor">{{  userEliminated.username }} não é impostor...</h3>
            <h3 v-if="isImpostor">{{ userEliminated.username }} é o impostor!</h3>
          </div>
          <div v-if="!userEliminated.username" class="no-eliminated">
            <h3>Ninguém foi eliminado!</h3>
          </div>
          <div v-if="impostorWin">
            {{  store.users.find(user => user.word === 'impostor').username }} era o impostor!
            O impostor venceu!
          </div> -->


        </div>
        <div class="modal-content top-to-bottom--effect" v-if="!showResult">
          <div class="modal-content__header">
            <div @click="toggleModal" class="modal-content__header--close">
              <IconX size="22" />
            </div>
          </div>
          <div class="modal-content__voting" v-if="!showResult">
            <div class="modal-content__voting--active-player">
              Jogador a votar: <span :style="{ color:currentUser.color }">{{ currentUser.username }}</span>
            </div>
            <div class="modal-players">
              <div class="modal-players__player" v-for="(user, index) in activePlayers" :key="index">
                <div class="modal-players__player--votes">
                  <span :style="{ color: user.color }">{{ user.username }}</span>
                  <div class="modal-players__player--votes--voted" v-for="votes in votingHistory[user.username]">
                    <IconSpy size="20" :color="votes.color" stroke="2.2" /> 
                  </div>
                </div>
                <Button widthMobile="65px" height="20px" padding="0px" font-size="12px" @click="vote(user)" :disabled="user.username == currentUser.username">Votar</Button>  
                </div>
            </div>
            <div class="modal-content__voting--actions">
              <Button padding="0px" font-size="12px"  @click="changeUser">Próximo Voto</Button>
              <Button class="button-outline__primary" padding="0px" font-size="12px" @click="endVoting"  :disabled="votingCount < props.activePlayers.length">Encerrar Votação</Button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
</template>

<script setup>
import { computed, ref  } from 'vue';
import { useGameStore } from '@/stores/game';
import { IconSpy,IconX } from '@tabler/icons-vue';
import Button from '@/components/Button.vue';
import {  watch } from 'vue'

const props = defineProps({
    isOpen: Boolean,
    activePlayers: Array,
    isOpen: { type: Boolean, default: false },
    width: { type: String, default: '400px' },
    widthMobile: { type: String, default: '85%' },
    title: { type: String }
});

const store = useGameStore();
const emit = defineEmits(['update:isOpen']);
const votingHistory = ref({}); 
const votingCount = ref(1);
const currentIndex = ref(0); 
const isLastUser = computed(() => currentIndex.value >= props.activePlayers.length - 1);
const isImpostor = ref(false);
const isOpen = ref(props.isOpen)
const showResult = ref(false);
const userEliminated = ref([]);
const impostorWin = ref(false);

const resetVote = () => {
  isImpostor.value = false;
  showResult.value = false;
  userEliminated.value = [];
}

store.users.forEach(user => {
  votingHistory.value[user.username] = [];
});

const currentUser = computed(() => {
  let validUser = store.users[currentIndex.value];

  while (validUser && validUser.eliminated) {
    currentIndex.value++;
    if (currentIndex.value >= store.users.length) {
      currentIndex.value = 0;
    }
    validUser = store.users[currentIndex.value];
  }

  return validUser;
});

const vote = (user) => {
  const previousVote = props.activePlayers.find(u =>
    votingHistory.value[u.username].some(voter => voter.username === currentUser.value.username)
  );
  
  if (previousVote) {
    votingHistory.value[previousVote.username] = votingHistory.value[previousVote.username].filter(voter => voter.username !== currentUser.value.username);
  }

  votingHistory.value[user.username].push({
    username: currentUser.value.username,
    color: currentUser.value.color,
    id: currentUser.value.id,
  });
};

const changeUser = () => {
  do {
    currentIndex.value++;
    votingCount.value++;
    if (currentIndex.value >= store.users.length) {
      currentIndex.value = 0;
    }
  } while (store.users[currentIndex.value].eliminated);
}

const endVoting = () => {
  let maxVotes = 0;
  let userToEliminate = null;

  props.activePlayers.forEach(user => {
    if (votingHistory.value[user.username].length > maxVotes) {
      maxVotes = votingHistory.value[user.username].length;
      userToEliminate = user;
    } else if (votingHistory.value[user.username].length === maxVotes) {
      userToEliminate = null; 
    }
  });

  if (userToEliminate) {
    userToEliminate.eliminated = true;
    userEliminated.value = userToEliminate;

    if (userToEliminate.word === 'impostor') {
      emit('finalize-voting', true);
      isImpostor.value = true;
    }

    if (props.activePlayers.length === 3 && userToEliminate.word !== 'impostor') {
      impostorWin.value = true;
    }
  }

  showResult.value = true;
  props.activePlayers.forEach(user => votingHistory.value[user.username] = []);
  currentIndex.value = 0;
  votingCount.value = 1;

  showResult.value = true;
};

watch(() => props.isOpen, (newVal) => {
  isOpen.value = newVal;
})

const toggleModal = () => {
  resetVote();
  isOpen.value = !isOpen.value
  emit('update:isOpen', isOpen.value)
}

</script>

<style lang="scss" scoped>

  @import '@/scss/mixings';

  .modal {
    @include flexbox(row, center, center);
    width: 100dvw;
    height: 90dvh;
    position: fixed;
    z-index:200;
    &-content {
      @include flexbox(column, flex-start, flex-start);
      padding:15px;
      width: 80%;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.15);
      &__header{
        @include flexbox(row, flex-end, center);
        width: 100%;
        margin-top: -25px;
        &--close{
          background: #FFF;
          border-radius: 50%;
          padding: 5px;
        }
      }
      &__voting{
        @include flexbox(column, space-between, initial);
        gap: 40px;
        width: 100%;
        &--active-player{
          @include flexbox(row, flex-start, initial);
          gap: 5px;
        }
        &--actions{
          @include flexbox(row, center, initial);
          gap: 15px;
   
        }
      }
    }
    &-results{
      @include flexbox(column, center, end);
      gap: 5px;
      width: 80%;
      position: relative;
      &__wrong-impostor {
        width: 100%;
        border-radius: 8px;
        position: relative;
        &::after {
          content: "";
          position: absolute;
          border-radius: 8px;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #000;
          opacity: 0;
          pointer-events: none;
          animation: impostorFade 5.7s ease-in-out forwards; 
        }
        &--video{
          border-radius: 8px;
          margin-bottom: -4px;
          width: 100%;
        }
        &--title{
          @include flexbox(column, center, center);
          gap: 5px;
          position: absolute;
          height: 100%;
          width: 100%;
          z-index: 1000;
          color: #FFF;
          animation: impostorFade 8.7s ease-in-out forwards; 
        }
      }
      &--close{
        @include flexbox(row, flex-end, center);
        background: #FFF;
        padding: 5px;
        border-radius: 50%;
        animation: impostorFade 8.7s ease-in-out forwards; 
      }
    }
  }


  .modal-players{
    @include flexbox(column, flex-start, initial);
    gap: 15px;
    &__player{
     @include flexbox(row, space-between, center);
     &--votes{
        @include flexbox(row, space-between, inherit);
        height: 25px;
        gap: 5px;
        &--voted{
          @include flexbox(column, flex-start, initial);
          padding: 3px;
          background: #000;
          border-radius: 5px;
          
        }
      }
    }
  }

</style>