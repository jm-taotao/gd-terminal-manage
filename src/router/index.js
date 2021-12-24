import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import dashboard from '@/components/dashboard'
import home from '@/components/home'
import user from '@/components/system/user'
import menu from '@/components/system/menu'
import role from '@/components/system/role'
import operator from '@/components/system/operator'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },{
      path: '/home',
      name: 'home',
      component: home,
      children:[
        {
          path: '/dashboard',
          name: 'dashboard',
          component: dashboard
        },
        {
          path: '/system/user',
          name: 'user',
          component: user
        },
        {
          path: '/system/menu',
          name: 'menu',
          component: menu
        },
        {
          path: '/system/role',
          name: 'role',
          component: role
        },
        {
          path: '/system/operator',
          name: 'operator',
          component: operator
        }
      ]
    }
  ]
})
