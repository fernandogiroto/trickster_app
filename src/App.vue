<template>
  <main>
    <section>
      <router-view v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="Component" ref="ViewPageTransition" />
        </Transition>
      </router-view>
    </section>
  </main>
</template>

<script setup lang="ts">

  import { RouterView } from 'vue-router'
</script>

<style>

  @import '@/scss/theme.scss';

</style>