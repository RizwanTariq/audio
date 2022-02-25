<template>
  <!-- Header -->
  <app-header />
  <router-view />

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
