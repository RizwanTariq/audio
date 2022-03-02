<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <upload ref="upload" />
      </div>
      <div class="col-span-2">
        <my-songs :updateUnsavedFlag="updateUnsavedFlag" />
      </div>
    </div>
  </section>
</template>

<script>
import Upload from '@/components/Upload.vue';
import MySongs from '@/components/MySongs.vue';
export default {
  name: 'Manage',
  components: {
    Upload,
    MySongs,
  },
  data() {
    return {
      unsavedFlag: false,
    };
  },
  methods: {
    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.unsavedFlag) {
      if (
        confirm(
          'There are some UnSaved changes do you still want to leave the page.'
        )
      ) {
        this.unsavedFlag = false;
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   this.$refs.upload.cancelUploads();
  //   next();
  // },
  // beforeRouteEnter(to, from, next) {
  //   console.log('Component Gaurd');
  //   next();
  // },
};
</script>

<style></style>
