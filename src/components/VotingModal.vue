<template>
    <div class="modal-overlay" v-if="isOpen">
        <div class="modal">
            <div class="modal-header">
                <h3>VOTAÇÃO</h3>
                <button @click="closeModal">X</button>
            </div>
            <div class="modal-body">
                <ul class="user-list">
                    <li v-for="(user, index) in activePlayers" 
                      :key="index" 
                      :style="{ color: user.color }">
                        {{ user.username }}
                        <button v-if="user.username !== currentUser.username" @click="vote(user)">
                        Votar
                        </button>
                        <span v-if="votingHistory[user.username].length > 0">
                        Votado por: {{ votingHistory[user.username].join(', ') }}
                        </span>
                    </li>
                </ul>
                Jogador a votar: <span :style="{ color:currentUser.color }">{{ currentUser.username }}</span>
                <button @click="changeUser" :disabled="isLastUser">Próximo voto</button>
                <button @click="endVoting">Encerrar Votação</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref  } from 'vue';
import { useGameStore } from '@/stores/game';

const props = defineProps({
    isOpen: Boolean,
    activePlayers: Array
});
const store = useGameStore();
const emit = defineEmits(['close']);
const votingHistory = ref({}); 
const currentIndex = ref(0); 
const isLastUser = computed(() => currentIndex.value >= store.users.length - 1);

const closeModal = () => {
    emit('close');
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
  const previousVote = store.users.find(u => votingHistory.value[u.username].includes(currentUser.value.username));
  if (previousVote) {
    votingHistory.value[previousVote.username] = votingHistory.value[previousVote.username].filter(voter => voter !== currentUser.value.username);
  }

  votingHistory.value[user.username].push(currentUser.value.username);
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
  }

  props.activePlayers.forEach(user => votingHistory.value[user.username] = []);
  currentIndex.value = 0;

  emit('close');
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