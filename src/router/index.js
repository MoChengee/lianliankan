import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';                 
import BasicMode from '../modes/BasicMode.vue';   
import RelaxMode from '../modes/RelaxMode.vue';
import LevelMode from '../modes/LevelMode.vue';
const routes = [
  { path: '/', component: Home },
  { path: '/basic', component: BasicMode },
  { path: '/relax', component: RelaxMode },
  { path: '/level', component: LevelMode },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;