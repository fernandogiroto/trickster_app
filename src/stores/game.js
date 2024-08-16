import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGameStore = defineStore('game', () => {
  const users = ref([]);
  const colors = ref(['#f95959','#42b883','#8594e4','#0092ca','#c7b198','#ff9c6d','#ffb5b5','#facf5a','#3baea0']);

  function addUser(username) {
    users.value.push(
      { 
        username,  
        word: '',
        color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
      }
    );
    saveUsersToLocalStorage();
  }

  function updateUserWord(word) {
    if (users.value.length === 0) return;

    // Choose a random user to be the impostor.
    const impostorIndex = Math.floor(Math.random() * users.value.length);

    // Update all users with the word.
    users.value.forEach((user, index) => {
      if (index === impostorIndex) {
        user.word = 'impostor';
      }
      else {
        user.word = word;
      }
    });

    saveUsersToLocalStorage();
  }

  function removeUser(username) {
    users.value = users.value.filter(user => user.username !== username);
    saveUsersToLocalStorage(); 
  }

  function clearUsers() {
    users.value = [];
    saveUsersToLocalStorage();
  }

  function saveUsersToLocalStorage() {
    localStorage.setItem('gameUsers', JSON.stringify(users.value));
  }

  function loadUsersFromLocalStorage() {
    const usersFromStorage = localStorage.getItem('gameUsers');
    if (usersFromStorage) {
      users.value = JSON.parse(usersFromStorage);
    }
  }

  loadUsersFromLocalStorage();

  return {
    users,
    addUser,
    updateUserWord,
    removeUser,
    clearUsers
  };
}, {
  persist: true
});
