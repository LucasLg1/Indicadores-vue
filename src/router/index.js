import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Dados from '../views/DadosView.vue'
import Graficos from '../views/GraficosView.vue'
import Teste from '../views/TesteView.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
  path: '/dados',
  name: 'Dados',
  component: Dados
},
{
  path: '/graficos',
  name: 'Graficos',
  component: Graficos
},
{
  path: '/teste',
  name: 'Teste',
  component: Teste
},


]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
