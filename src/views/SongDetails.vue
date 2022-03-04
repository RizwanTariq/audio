<template>
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div
      class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)"
    ></div>
    <div class="container mx-auto flex items-center">
      <button
        type="button"
        class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
      >
        <i class="fas fa-play"></i>
      </button>
      <div class="z-50 text-left ml-8">
        <div class="text-3xl font-bold">{{ song.modifiedName }}</div>
        <div>{{ song.genre }}</div>
      </div>
    </div>
  </section>

  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title">Comments ({{ commentCount }})</span>
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <div
          class="text-white text-center font-bold p-5 mb-4"
          v-if="commentShowAlert"
          :class="commentAlertVarient"
        >
          {{ commentAlertMsg }}
        </div>
        <vee-form
          @submit="handleCommentSubmit"
          :validation-schema="schema"
          v-if="userLoggedin"
        >
          <vee-field
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here..."
            name="comment"
            as="textarea"
          ></vee-field>
          <ErrorMessage class="text-red-600 block" name="comment" />
          <button
            type="submit"
            :disabled="commentInSubmition"
            class="py-1.5 px-3 rounded text-white bg-green-600"
          >
            Submit
          </button>
        </vee-form>
        <select
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          @change.prevent="sort($event)"
        >
          <option value="0">Latest</option>
          <option value="1">Oldest</option>
        </select>
      </div>
    </div>
  </section>
  <ul class="container mx-auto">
    <li
      class="p-6 bg-gray-50 border border-gray-200"
      v-for="comment in comments"
      :key="comment.id"
    >
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold">{{ comment.userName }}</div>
        <time>{{ timeDiff(comment.datePosted) }} ago</time>
      </div>

      <p>
        {{ comment.comment }}
      </p>
    </li>
  </ul>
</template>

<script>
import {
  document,
  songsCollection,
  commentsCollection,
  auth,
} from '@/plugins/firebase';
import { mapState } from 'vuex';

export default {
  name: 'SongDetails',
  data() {
    return {
      schema: {
        comment: 'required|min:3',
      },
      song: {},
      comments: [],
      id: this.$route.params.id,
      commentShowAlert: false,
      commentAlertVarient: '',
      commentAlertMsg: '',
      commentInSubmition: false,
    };
  },
  computed: {
    ...mapState(['userLoggedin']),
    commentCount() {
      return this.comments ? this.comments.length : 0;
    },
  },
  methods: {
    timeDiff(date) {
      const dt1 = new Date();
      const dt2 = new Date(date);
      var diff = (dt2.getTime() - dt1.getTime()) / 1000;
      diff /= 60;
      const time = Math.abs(Math.round(diff));
      if (time < 100) {
        return time + ' mins';
      } else {
        var num = time;
        var hours = num / 60;
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);
        return rhours + ' hrs & ' + rminutes + ' mins';
      }
    },
    sort(event) {
      const index = event ? event.target.options.selectedIndex : 0;
      let comments = [];
      if (index == 0) {
        comments = this.comments.sort((a, b) => {
          return new Date(b.datePosted) - new Date(a.datePosted);
        });
      } else if (index == 1) {
        comments = this.comments.sort((a, b) => {
          return new Date(a.datePosted) - new Date(b.datePosted);
        });
      }
      this.comments = comments;
    },
    async handleCommentSubmit(values, actions) {
      const { setDoc, doc } = document;
      this.commentShowAlert = true;
      this.commentInSubmition = true;
      this.commentAlertVarient = 'bg-blue-500';
      this.commentAlertMsg = 'Please wait! posting your comment.';

      console.log(values);
      const comment = {
        comment: values.comment,
        datePosted: new Date().toString(),
        songId: this.song.id,
        userName: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
      };
      try {
        await setDoc(doc(commentsCollection), comment);
        actions.resetForm();

        this.commentShowAlert = false;
        this.commentInSubmition = false;
        this.commentAlertVarient = 'bg-green-500';
        this.commentAlertMsg = 'Comment posted.';
        await this.getComments();
      } catch (err) {
        console.log(err);
        this.commentInSubmition = false;
        this.commentAlertVarient = 'bg-red-500';
        this.commentAlertMsg = 'Something unexpected happened.';
      }
    },
    async getSong() {
      const song = this.$store.getters.getSong(this.id);
      if (song) {
        this.song = song;
      } else {
        const { doc, getDoc } = document;
        let docSnap = await getDoc(doc(songsCollection, this.id));
        if (!docSnap.exists()) {
          this.$router.push({ name: 'Home' });
        } else {
          this.song = { id: docSnap.id, ...docSnap.data() };
        }
      }
      console.log(this.song);
    },
    async getComments() {
      const { query, where, getDocs } = document;
      const q = query(
        commentsCollection,
        where('songId', '==', `${this.song.id}`)
      );
      const querySnapshot = await getDocs(q);
      const com = [];
      querySnapshot.forEach((doc) => {
        com.push({ id: doc.id, ...doc.data() });
      });
      this.comments = com;
      this.sort();
    },
  },
  async created() {
    await this.getSong();
    await this.getComments();
  },
};
</script>

<style></style>
