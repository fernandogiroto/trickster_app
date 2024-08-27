<template>
    <div class="modal-overlay" v-if="isOpen">
        <div class="modal">
            <div class="modal-header">
                <h3>VOTAÇÃO</h3>
                <button @click="closeModal">X</button>
            </div>
            <div class="modal-body">
              <div v-if="!showResult" class="vote">
                <ul class="user-list">
                    <li v-for="(user, index) in activePlayers" 
                      :key="index" 
                      :style="{ color: user.color }">
                        {{ user.username }}
                        <button v-if="user.username !== currentUser.username" @click="vote(user)">
                        Votar
                        </button>
                        <span v-if="votingHistory[user.username].length > 0">

                          <IconUserFilled 
                            v-for="votes in votingHistory[user.username]" 
                            size="20" 
                            :color="votes.color" /> 
                        </span>
                    </li>
                </ul>
                Jogador a votar: <span :style="{ color:currentUser.color }">{{ currentUser.username }}</span>
                <button @click="changeUser">Próximo voto</button>
                <button @click="endVoting" :disabled="!isLastUser">Encerrar Votação</button>
              </div>
              <div v-if="showResult" class="result">
                <div v-if="userEliminated.username" class="has-eliminated">
                  <h3 v-if="!isImpostor">{{  userEliminated.username }} não é impostor...</h3>
                  <h3 v-if="isImpostor">{{ userEliminated.username }} é o impostor!</h3>
                </div>
                <div v-if="!userEliminated.username" class="no-eliminated">
                  <h3>Ninguém foi eliminado!</h3>
                </div>
                <div v-if="impostorWin">
                  {{  store.users.find(user => user.word === 'impostor').username }} era o impostor!
                  O impostor venceu!
                </div>
              </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref  } from 'vue';
import { useGameStore } from '@/stores/game';
import { IconUserFilled } from '@tabler/icons-vue';

const props = defineProps({
    isOpen: Boolean,
    activePlayers: Array,
});
const store = useGameStore();
const emit = defineEmits(['close']);
const votingHistory = ref({}); 
const currentIndex = ref(0); 
const isLastUser = computed(() => currentIndex.value >= props.activePlayers.length - 1);
const isImpostor = ref(false);
const showResult = ref(false);
const userEliminated = ref([]);
const impostorWin = ref(false);

const closeModal = () => {
    emit('close');
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

    // if (props.activePlayers.length === 3 && userToEliminate.word !== 'impostor') {
    //   impostorWin.value = true;
    // }
  }

  showResult.value = true;
  props.activePlayers.forEach(user => votingHistory.value[user.username] = []);
  currentIndex.value = 0;
};

</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  margin-top: 10px;
}

.voting-modal {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.user-list {
  list-style: none;
  padding: 0;
  flex-direction: column;
}

.user-list li {
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.eliminated {
  text-decoration: line-through;
  color: #ccc;
}
</style>