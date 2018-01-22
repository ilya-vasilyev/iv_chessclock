import Vue from 'vue'
import Router from 'vue-router'
import ScreenOne from '@/components/ScreenOne'
import ScreenTwo from '@/components/ScreenTwo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/player-one',
    },
    {
      path: '/player-one',
      name: 'player-one',
      component: ScreenOne,
      props: true,
    },
    {
      path: '/player-two',
      name: 'player-two',
      component: ScreenTwo,
      props: true,
    },
  ]
})
