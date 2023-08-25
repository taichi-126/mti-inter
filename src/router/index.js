import {createRouter, createWebHashHistory} from 'vue-router'

import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Profile from '../views/Profile.vue';
import User from '../views/User.vue';
import Diary from '../views/Diary.vue';
import Record from '../views/Record.vue';
import FoodRecord from '../views/FoodRecord.vue';
import Chat from "../views/Chat.vue"

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
      path:'/Login',
      name:'Login',
      component: Login,
      meta:{
        title:'Login'
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta:{
        title:'Profile'
      }
    },
    {
      path: '/user',
      name: 'user',
      component:User,
      meta:{
        title:'User'
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
    },
    {
      path: "/foodRecord",
      name: "FoodRecord",
      component: FoodRecord,
      meta: {
        title: "FoodRecord"
      }
    },
{
      path: "/chat",
      name: "Chat",
      component: Chat,
      meta: {
        title: "Chat"
      }
    }
    
  ]
})

const DEFAULT_TITLE = 'TITLE';

router.afterEach((to) => {
  document.title = to.meta.title ?? DEFAULT_TITLE
})

export default router
