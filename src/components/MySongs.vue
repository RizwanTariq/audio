<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">My Songs</span>
      <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <div
        v-for="song in mySongs"
        :key="song.id"
        class="border border-gray-200 p-3 mb-4 rounded"
      >
        <div class="my-2">
          <button
            class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
            :disabled="deleteSongInSubmition"
            @click.prevent="handleSongDelete(song)"
          >
            <i class="fa fa-times"></i>
          </button>
          <button
            class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
            @click.prevent="song.showForm = !song.showForm"
          >
            <i class="fa fa-pencil-alt"></i>
          </button>
          <h4 class="inline-block text-2xl font-bold">
            {{ song.data.modifiedName }}
          </h4>
        </div>

        <!-- // -->

        <div v-show="song.showForm == true">
          <div
            class="text-white text-center font-bold p-5 mb-4"
            v-if="editSongShowAlert"
            :class="editSongAlertVarient"
          >
            {{ editSongAlertMsg }}
          </div>
          <vee-form
            class="mt-5"
            :validation-schema="schema"
            :initialValues="{
              modifiedName: song.data.modifiedName,
              genre: song.data.genre,
            }"
            @submit="handleSongEdit(song)"
          >
            <div class="mb-3">
              <vee-field
                type="text"
                name="modifiedName"
                v-model="modifiedName"
                @keydown="updateUnsavedFlag(true)"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter New Song Title"
              />
              <ErrorMessage class="text-red-600" name="modifiedName" />
            </div>
            <div class="mb-3">
              <vee-field
                type="text"
                name="genre"
                v-model="genre"
                @keydown="updateUnsavedFlag(true)"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Song Genre"
              />
              <ErrorMessage class="text-red-600" name="genre" />
            </div>
            <button
              type="submit"
              :disabled="editSongInSubmition"
              class="py-1.5 px-3 rounded text-white bg-green-600 m-1"
            >
              Submit
            </button>
            <!-- <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-gray-600 m-1"
            >
              Go Back
            </button> -->
          </vee-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  songsCollection,
  auth,
  firebaseStorage,
  document,
} from '@/plugins/firebase';
import { deleteObject } from '@firebase/storage';
import { mapState } from 'vuex';
export default {
  name: 'MySongs',
  props: ['updateUnsavedFlag'],
  data() {
    return {
      modifiedName: '',
      genre: '',
      songs: [],
      schema: {
        modifiedName: 'song_required',
        genre: 'alpha_spaces|min:2|max:15',
      },
      editSongShowAlert: false,
      editSongInSubmition: false,
      editSongAlertVarient: '',
      editSongAlertMsg: '',
      // deleteSongShowAlert: false,
      deleteSongInSubmition: false,
      // deleteSongAlertVarient: '',
      // deleteSongAlertMsg: '',
    };
  },
  computed: {
    ...mapState(['mySongs']),
  },
  created() {
    this.$store.dispatch('mySongsAction');
  },
  // async created() {
  //   const { query, where, getDocs, setDoc, doc } = document;
  //   const q = query(songsCollection, where('uid', '==', auth.currentUser.uid));
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     this.songs.push({
  //       id: doc.id,
  //       data: doc.data(),
  //       showForm: false,
  //     });
  //   });
  // },
  methods: {
    async handleSongEdit(song) {
      this.updateUnsavedFlag(false);
      //setting Alert Values
      this.editSongShowAlert = true;
      this.editSongInSubmition = true;

      this.editSongAlertVarient = 'bg-blue-500';
      this.editSongAlertMsg = 'Please wait edit operation is in progress';

      const { setDoc, doc } = document;

      //Checking if User entered nothing
      this.modifiedName = this.modifiedName
        ? this.modifiedName
        : song.data.modifiedName;
      this.genre = this.genre ? this.genre : song.data.genre;

      //Creating new Song Object
      const newSong = {
        id: song.id,
        data: {
          ...song.data,
          modifiedName: this.modifiedName.includes(
            '.mp3',
            this.modifiedName.length - 5
          )
            ? this.modifiedName
            : `${this.modifiedName}.mp3`,
          genre: this.genre,
        },
        showForm: false,
      };

      //Saving new Song Object in DataBase
      try {
        // throw new Error('This is error'); //For Testing

        await setDoc(doc(songsCollection, newSong.id), newSong.data, {
          merge: true,
        });

        //Reseting Alert Values and setting new array of songs in state
        this.editSongAlertMsg = 'Song name is successfully edited.';
        this.editSongAlertVarient = 'bg-green-500';
        this.editSongInSubmition = false;

        this.$store.dispatch('mySongsAction', {
          method: 'edit',
          song: newSong,
        });
        setTimeout(() => {
          this.editSongShowAlert = false;
        }, 1000);
        // this.songs = this.songs.map((s) => {
        //   if (s.id === newSong.id) {
        //     return newSong;
        //   } else {
        //     return s;
        //   }
        // });
      } catch (error) {
        //Reseting Alert Values and setting new array of songs in state
        this.editSongAlertMsg =
          'Some Unexpected error has occured. Please try again.';
        this.editSongAlertVarient = 'bg-red-500';
        this.editSongShowAlert = true;
        this.editSongInSubmition = false;
      }
    },
    async handleSongDelete(song) {
      console.log('first');
      // this.deleteSongShowAlert = true;
      this.deleteSongInSubmition = true;
      // this.deleteSongAlertVarient = 'bg-blue-500';
      // this.deleteSongAlertMsg = 'Please wait delete operation is in progress';
      const { doc, deleteDoc } = document;
      const { storage, sRef } = firebaseStorage;

      try {
        const songRef = sRef(storage, `songs/${song.data.originalName}`);
        await deleteDoc(doc(songsCollection, song.id));
        await deleteObject(songRef);
        // this.songs = this.songs.filter((s) => s.id !== song.id);
        this.$store.dispatch('mySongsAction', { method: 'delete', song });
        // this.deleteSongShowAlert = false;
        this.deleteSongInSubmition = false;
        // this.deleteSongAlertVarient = 'bg-green-500';
        // this.deleteSongAlertMsg = 'Successfully deleted';
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style></style>
