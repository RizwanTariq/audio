<template>
  <!-- Introduction -->
  <intro />

  <!-- Main Content -->
  <main-content />
</template>

<script>
import Intro from '@/components/Intro.vue';
import MainContent from '@/components/MainContent.vue';

export default {
  components: { Intro, MainContent },
  name: 'Home',
};
</script>
