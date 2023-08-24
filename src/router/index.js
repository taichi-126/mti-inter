import {createRouter, createWebHashHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Diary from '../views/Diary.vue'
import Record from '../views/Record.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: 'Home'
      }
    },
    {
      path: "/diary",
      name: "Diary",
      component: Diary,
      meta: {
        title: "Diary"
      }
    },
    {
      path: "/record",
      name: "Record",
      component: Record,
      meta: {
        title: "Record"
      }
    }
  ]
})

const DEFAULT_TITLE = 'TITLE';

router.afterEach((to) => {
  document.title = to.meta.title ?? DEFAULT_TITLE
})

export default router
