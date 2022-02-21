import { createStore } from 'vuex';

export default createStore({
  state: {
    authShow: false,
  },
  mutations: {
    toggleAuth: (state) => {
      state.authShow = !state.authShow;
      console.log(state.authShow);
    },
  },
  actions: {},
  modules: {},
  getters: {
    // authShow: (state) => state.authShow,
  },
});
