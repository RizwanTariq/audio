<template>
  <!-- Introduction -->
  <intro />

  <!-- Main Content -->
  <main-content :allSongs="allSongs" />
</template>

<script>
import Intro from '@/components/Intro.vue';
import MainContent from '@/components/MainContent.vue';
import {
  songsCollection,
  document as firebaseDocument,
} from '../plugins/firebase';
import { startAfter } from '@firebase/firestore';

export default {
  components: { Intro, MainContent },
  name: 'Home',
  data() {
    return {
      allSongs: [],
      maxPerPage: 5,
      lastVisible: {},
      pendingRequest: false,
    };
  },
  async created() {
    this.getSongs();

    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;
      const bottomOfWindow =
        Math.floor(scrollTop) + innerHeight === offsetHeight;
      if (bottomOfWindow) {
        this.getSongs();
        console.log('BottomOfWindow');
      }
    },
    async getSongs() {
      if (this.pendingRequest) {
        return;
      }
      this.pendingRequest = true;
      const { getDocs, query, orderBy, limit, getDoc } = firebaseDocument;
      let q;

      if (this.allSongs.length) {
        // const lastDoc = await getDoc(
        //   songsCollection,
        //   this.allSongs[this.allSongs.length - 1].id
        // );
        if (!this.lastVisible) {
          return;
        }

        q = query(
          songsCollection,
          orderBy('modifiedName'),
          startAfter(this.lastVisible),
          limit(this.maxPerPage)
        );
      } else {
        q = query(
          songsCollection,
          orderBy('modifiedName'),
          limit(this.maxPerPage)
        );
      }
      const querySnapshot = await getDocs(q);
      this.lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      querySnapshot.forEach((doc) => {
        this.allSongs.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      this.pendingRequest = false;
    },
  },
};
</script>
