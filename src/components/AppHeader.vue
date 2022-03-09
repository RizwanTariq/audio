<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'Home' }"
        active-class="no-active"
        >{{ $t('header.music') }}</router-link
      >

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <router-link class="px-2 text-white" :to="{ name: 'About' }">
              {{ $t('header.about') }}
            </router-link>
          </li>
          <li v-if="!userLoggedin">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuth">
              {{ $t('header.log') }}</a
            >
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-white" :to="{ name: 'Manage' }">
                {{ $t('header.manage') }}</router-link
              >
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="signOut">
                {{ $t('header.logout') }}</a
              >
            </li>
          </template>
        </ul>
        <ul class="flex flex-row mt-1 ml-auto">
          <li>
            <a class="px-2 text-white" href="#" @click.prevent="changeLocale">
              {{ currentLocale }}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';
export default {
  name: 'AppHeader',
  computed: {
    ...mapState(['userLoggedin']),
    currentLocale() {
      if (this.$i18n.locale === 'ur') {
        return 'اردو';
      } else if (this.$i18n.locale === 'en') {
        return 'English';
      } else {
        return 'français';
      }
    },
  },
  methods: {
    ...mapMutations(['toggleAuth']),
    // ...mapActions(['logoutUser']),
    // toggleAuth() {
    //   this.$store.commit('toggleAuth');
    // },
    signOut() {
      this.$store.dispatch('logoutUser');

      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: 'Home' });
      }
      // window.location.reload();
    },
    changeLocale() {
      if (this.$i18n.locale === 'ur') {
        this.$i18n.locale = 'fr';
      } else if (this.$i18n.locale === 'en') {
        this.$i18n.locale = 'ur';
      } else {
        this.$i18n.locale = 'en';
      }
    },
  },
};
</script>

<style></style>
