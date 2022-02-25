import { createStore } from 'vuex';
import {
  authenticate,
  auth,
  usersCollection,
  document,
} from '@/plugins/firebase';

export default createStore({
  state: {
    authShow: false,
    userLoggedin: false,
  },
  mutations: {
    toggleAuth: (state) => {
      state.authShow = !state.authShow;
      //Testing
      console.log('Toggled AuthShow Property', state.authShow);
    },
    toggleLoggedIn: (state) => {
      state.userLoggedin = !state.userLoggedin;
      //Testing
      console.log('Toggled UserLoggedIn Property', state.userLoggedin);
    },
  },
  actions: {
    // User Register Action

    async registerUser(context, payload) {
      const { doc, setDoc } = document;
      const { updateProfile, createUserWithEmailAndPassword } = authenticate;
      let userCred = null;

      userCred = await createUserWithEmailAndPassword(
        auth,
        payload.email,
        payload.password
      );
      await setDoc(doc(usersCollection, userCred.user.uid), {
        name: payload.name,
        email: payload.email,
        age: payload.age,
        country: payload.country,
      });
      await updateProfile(userCred.user, {
        displayName: payload.name,
      });

      context.commit('toggleLoggedIn');
      //Testing
      console.log('Authentication', userCred);
    },

    //Initiate login on first App Load Action

    initLogin(context) {
      const user = auth.currentUser;
      if (user) {
        context.commit('toggleLoggedIn');
      }
    },

    // User Login Action

    async loginUser(context, payload) {
      const { signInWithEmailAndPassword } = authenticate;

      let userCred = null;

      userCred = await signInWithEmailAndPassword(
        auth,
        payload.email,
        payload.password
      );
      if (userCred) {
        context.commit('toggleLoggedIn');
        //Testing
        console.log('Authentication', userCred);
      }
    },

    //UserLogout Action

    async logoutUser(context) {
      console.log('Logout');
      const { signOut } = authenticate;
      await signOut(auth);
      context.commit('toggleLoggedIn');
    },
  },
  modules: {},
  getters: {
    // authShow: (state) => state.authShow,
  },
});
