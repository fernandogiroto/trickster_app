import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGameStore = defineStore('game', () => {
  const users = ref([]);

  function addUser(username) {
    users.value.push({ username });
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
    removeUser,
    clearUsers
  };
}, {
  persist: true
});
