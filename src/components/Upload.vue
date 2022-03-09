<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">{{ $t('upload.title') }}</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{
          'text-white bg-green-400 border-green-400 border-solid': isDragOver,
        }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="dragLeave"
        @dragover.prevent.stop="dragOver"
        @dragenter.prevent.stop="dragOver"
        @dragleave.prevent.stop="dragLeave"
        @drop.prevent.stop="upload"
      >
        <h5>{{ $t('upload.drop') }}</h5>
      </div>
      <input type="file" multiple @change.prevent="upload" />
      <hr class="my-6" />
      <div v-for="file in uploadings" :key="file.name" class="mb-4">
        <div class="font-bold text-sm" :class="file.textClass">
          <i :class="file.icon"></i><span> </span> {{ file.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <div
            :class="file.varient"
            :style="{ width: `${file.progressBar}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  firebaseStorage,
  auth,
  songsCollection,
  document,
} from '../plugins/firebase';
import { uniqueName } from '../utils/generateUniqueName';
export default {
  name: 'Upload',
  data() {
    return {
      isDragOver: false,
      uploadings: [],
    };
  },
  methods: {
    dragOver() {
      this.isDragOver = true;
    },
    dragLeave() {
      this.isDragOver = false;
    },
    upload(event) {
      const { storage, sRef, uploadAudio, getDownloadURL } = firebaseStorage;
      const { doc, setDoc } = document;
      this.isDragOver = false;
      const files = event.dataTransfer
        ? [...event.dataTransfer.files]
        : [...event.target.files];

      files.forEach((file) => {
        if (
          !auth ||
          file.type !== 'audio/mpeg' ||
          file.size > 10 * 1024 * 1024
        ) {
          return null;
        }

        if (!window.navigator.onLine) {
          this.uploadings.push({
            task: {},
            progressBar: 100,
            name: file.name,
            varient: 'bg-red-400',
            textClass: 'text-red-400',
            icon: 'fas fa-times',
          });
          return;
        }

        const songsRef = sRef(storage, `songs/${uniqueName(file.name)}`);
        const uploadTask = uploadAudio(songsRef, file);
        const uploadingIndex = this.uploadings.push({
          name: file.name,
          task: uploadTask,
          progressBar: 0,
          icon: 'fas fa-spinner fa-spin',
          varient: 'transition-all progress-bar bg-blue-400',
          textClass: '',
        });

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.uploadings[uploadingIndex - 1].progressBar = progress;
            // if (this.uploadings[uploadingIndex - 1].progressBar === 100) {
            //   this.uploadings[uploadingIndex - 1].varient = 'bg-green-400';
            //   this.uploadings[uploadingIndex - 1].icon = '';
            //   this.uploadings[uploadingIndex - 1].textClass = 'text-green-400';
            // }
          },
          (err) => {
            this.uploadings[uploadingIndex - 1].varient = 'bg-red-400';
            this.uploadings[uploadingIndex - 1].icon = 'fas fa-times';
            this.uploadings[uploadingIndex - 1].textClass = 'text-red-400';
            console.error(err);
          },
          async () => {
            const songDetails = {
              uid: auth.currentUser.uid,
              displayName: auth.currentUser.displayName,
              originalName: uploadTask.snapshot.ref.name,
              modifiedName: uploadTask.snapshot.ref.name,
              genre: '',
              commentCount: 0,
            };
            songDetails.url = await getDownloadURL(uploadTask.snapshot.ref);

            // console.log(songDetails);
            await setDoc(doc(songsCollection), songDetails);

            this.$store.dispatch('mySongsAction', { method: 'upload' });
            this.uploadings[uploadingIndex - 1].varient = 'bg-green-400';
            this.uploadings[uploadingIndex - 1].icon = 'fas fa-check';
            this.uploadings[uploadingIndex - 1].textClass = 'text-green-400';
          }
        );
      });
    },

    //Will be called in ref of parent
    // cancelUploads() {
    //   this.uploadings.forEach((upload) => upload.task.cancel());
    // },
  },
  //Before Unmount Lifecycle Method
  beforeUnmount() {
    this.uploadings.forEach((upload) => upload.task.cancel());
  },
};
</script>

<style></style>
