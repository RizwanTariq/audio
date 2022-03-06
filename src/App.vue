<template>
  <!-- Header -->
  <app-header />

  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>

  <!-- Player -->
  <player />

  <!-- Auth Modal -->
  <auth />
</template>

<script>
import AppHeader from '@/components/AppHeader.vue';
import Auth from '@/components/Auth.vue';
import Player from '@/components/Player.vue';
export default {
  components: {
    AppHeader,
    Auth,
    Player,
  },
  created() {
    this.$store.dispatch('initLogin');
  },
};
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.5s linear;
}
.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>
