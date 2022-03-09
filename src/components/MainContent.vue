<template>
  <section class="container mx-auto">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title">{{ $t('mainContent.title') }}</span>
        <i class="fa fa-headphones-alt float-right text-green-400 text-2xl"></i>
      </div>
      <!-- Playlist -->
      <ol id="playlist">
        <li
          v-for="song in allSongs"
          :key="song.id"
          class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
        >
          <div>
            <router-link
              :to="{ name: 'SongDetails', params: { id: song.id } }"
              class="font-bold block text-gray-600"
              >{{ song.modifiedName }}</router-link
            >
            <span class="text-gray-500 text-sm">{{ song.displayName }}</span>
          </div>

          <div class="text-gray-600 text-lg">
            <router-link
              custom
              :to="{
                name: 'SongDetails',
                params: { id: song.id },
                hash: '#comments',
              }"
              v-slot="{ navigate }"
            >
              <span class="comments" @click.prevent="navigate">
                <i class="fa fa-comments text-gray-600"></i>
                12
              </span>
            </router-link>
          </div>
        </li>
      </ol>
      <!-- .. end Playlist -->
    </div>
  </section>
</template>

<script>
export default {
  name: 'MainContent',
  props: {
    allSongs: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style></style>
