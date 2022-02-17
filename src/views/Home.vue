<template>
  <!-- Introduction -->
  <intro />

  <!-- Main Content -->
  <main-content />

  <!-- Player -->
  <player />

  <!-- Auth Modal -->
  <auth />
</template>

<script>
import Intro from '@/components/Intro.vue';
import Player from '@/components/Player.vue';
import MainContent from '@/components/MainContent.vue';
import Auth from '@/components/Auth.vue';

export default {
  components: { Intro, Player, MainContent, Auth },
  name: 'Home',
};
</script>
