import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import Manage from '@/views/Manage.vue';
import store from '@/store';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/manage-music',
    // alias: '/manage',
    name: 'Manage',
    component: Manage,
    meta: {
      requiresAuth: true,
    },

    // beforeEnter: (to, from, next) => {
    //   // console.log('Manage Executed', store.state.userLoggedin);
    //   if (store.state.userLoggedin) {
    //     next();
    //   } else {
    //     next({ name: 'Home' });
    //   }
    // },
  },
  {
    path: '/manage',
    redirect: { name: 'Manage' },
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'Home' },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'text-green-500',
});

router.beforeEach((to, from, next) => {
  if (!to.matched.some((record) => record.meta.requiresAuth)) {
    next();
    return;
  } else {
    if (!store.state.userLoggedin) {
      next({ name: 'Home' });
    } else {
      next();
    }
  }
});

export default router;
