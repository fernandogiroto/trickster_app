<template>
  <div class="home-view">
    <div class="home-view__video">
      <TricksterLogo height="178px">
        <template #video>
          <source src="@/assets/videos/trickster.mov" type="video/mp4">
        </template>
      </TricksterLogo>
    </div>
    <div class="game-start">
      <div class="game-start__add-user">
        <input type="text" class="input" v-model="username" placeholder="Nome do jogador" />
        <Button background="button-outline__dark" width="85%" height="40px" @click="addUser(username)">ADICIONAR</Button>
      </div>
      <Button background="button__dark" @click="newGame()"  :disabled="store.users.length < 3">COMEÇAR O JOGO</Button>
        <span class="game-start__title">JOGADORES:</span>
        <div class="game-start__users">
          <TransitionGroup name="list" tag="ul" class="game-users">
            <li class="game-users__list" v-for="(user,index) in store.users" :key="user">
              <div class="game-users__list--player">
                <span>#0{{index+1}}</span>
                <div class="color-circle" :style="{ backgroundColor: user.color }"></div>
                <span>{{ user.username }} </span>
              </div>
              <IconTrash class="pointer" size="20" color="var(--error-70)" @click="removeUser(user.username)"/>
            </li>
          </TransitionGroup>
        </div>
    </div>
    <div class="rules pointer">
      <IconQuestionMark size="25" color="#FFFFFF" />
    </div>
  </div>
</template>

<script setup>

  import {ref} from 'vue';
  import { useGameStore } from '@/stores/game';
  import TricksterLogo from '@/components/TricksterLogo.vue';
  import Button from '@/components/Button.vue';

  import { IconTrash,IconQuestionMark } from '@tabler/icons-vue';
  import router from '@/router';
  const store = useGameStore();

  const username = ref('');

  const newGame = () => {
    router.push({name:'players'})
  };

  const addUser = () => {
    if (username.value) {
      store.addUser(username.value);
      username.value = '';
    }
  };

  const removeUser = (name) => {
    store.removeUser(name);
  }

</script>

<style lang="scss">

  @import '@/scss/mixings';

  .home-view{
    @include flexbox(column,center,center);
    width: 100%; 
    height: 100%; 
    overflow: hidden; 
    position: relative;
    &__video{
      @include flexbox(column,initial,initial);
      width: 100%;
      border: 5px solid #FFFFFF;
    }
  }

  .game-start{
    @include flexbox(column,space-between,initial);
    gap: 15px;
    width: 345px;
    &__users{
      @include flexbox(column,space-between,initial);
      gap: 15px;
      border: 1px solid;
      padding: 10px;
      border-radius: 5px;
      box-shadow: 3px 2px 11px 10px rgb(90 77 77 / 16%);
      height: 150px;
      overflow-y: scroll;
      overflow-x: hidden; 
      scrollbar-width: none; 
      -ms-overflow-style: none; 
      &::-webkit-scrollbar {
        display: none; 
      }
    }
    &__title{
      padding-top: 10px
    }
    &__add-user{
      @include flexbox(row,initial,initial);
      width: 100%;
      gap: 10px;
    }
  }

  .game-users{
    @include flexbox(column,space-between,initial);
    gap: 10px;
    &__list{
      @include flexbox(row,space-between,center);
      &--player{
        @include flexbox(row,space-between,center);
        gap: 5px;
      }
    }
  }

  input{
    border-radius: 8px;
    padding: 10px;
    width: 100%;
    &:focus {
      border-color: 000; 
      outline: none; 
    }
  }

  .color-circle {
    width: 20px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid #000; 
  }

  .rules{
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 5px;
    border: 2px solid #000;
    border-radius: 50%;
    background-color: #000;
  }

</style>