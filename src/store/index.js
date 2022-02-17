import { createStore } from 'vuex';

export default createStore({
  state: {
    authShow: true,
  },
  mutations: {
    toggleAuth: (state) => {
      state.authShow = !state.authShow;
      console.log(state.authShow);
    },
  },
  actions: {},
  modules: {},
});
