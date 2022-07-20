import {createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "about" */ '../views/LogIn'),
    },
    {
        path: '/index',
        name: 'Index',
        component: () => import(/* webpackChunkName: "about" */ '../views/HomeView'),
        children: [
            {
                path: '/systemManage',
                name: 'SystemManage',
                redirect:'noRedirect',
                meta: {title: '系统管理'},
                children: [
                    {
                        path: '/dashBoard',
                        name: 'DashBoard',
                        component: () => import(/* webpackChunkName: "about" */ '../views/DashBoard'),
                        meta: {title: 'DashBoard'}
                    },
                    {
                        path: '/system',
                        name: 'System',
                        meta: {title: '系统列表'},
                        component: () => import(/* webpackChunkName: "about" */ '../views/system/system/SystemList')
                    },
                    {
                        path: '/user',
                        name: 'User',
                        meta: {title: '用户管理'},
                        component: () => import(/* webpackChunkName: "about" */ '../views/system/user/UserList')
                    },
                    {
                        path: '/menu',
                        name: 'Menu',
                        meta: {title: '菜单管理'},
                        component: () => import(/* webpackChunkName: "about" */ '../views/system/menu/MenuList')
                    },
                    {
                        path: '/role',
                        name: 'Role',
                        meta: {title: '角色管理'},
                        component: () => import(/* webpackChunkName: "about" */ '../views/system/role/RoleList')
                    },
                    {
                        path: '/operate',
                        name: 'Operate',
                        meta: {title: '运营商管理'},
                        component: () => import(/* webpackChunkName: "about" */ '../views/system/operate/OperateList')
                    },
                    {
                        path: '/power',
                        name: 'Power',
                        meta: {title: '权限管理'},
                        component: () => import(/* webpackChunkName: "about" */ '../views/system/PowerManage')
                    },
                ]
            },{
                path: '/productManage',
                name: 'ProductManage',
                meta: {title: '商品管理'},
                children: [
                    {
                        path: '/productList',
                        name: 'ProductList',
                        meta: {title: '商品列表'},
                        component: () => import(/* webpackChunkName: "about" */ '../views/product/ProductList')
                    },
                    {
                        path: '/productTypeList',
                        name: 'ProductTypeList',
                        meta: {title: '商品列表'},
                        component: () => import(/* webpackChunkName: "about" */ '../views/product/ProductTypeList')
                    }
                ]
            },
        ]
    },
    // {
    //     path: '/productManage',
    //     name: 'ProductManage',
    //     meta: {title: '商品管理'},
    //     component: () => import(/* webpackChunkName: "about" */ '../views/HomeView'),
    //     children: [
    //         {
    //             path: '/productList',
    //             name: 'ProductList',
    //             meta: {title: '商品列表'},
    //             component: () => import(/* webpackChunkName: "about" */ '../views/product/ProductList')
    //         }
    //     ]
    // },
    {
        path: '/about',
        name: 'About',
        meta: {title: '关于'},
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    }
]

const router = createRouter({
    // history: createWebHistory(),
    history: createWebHistory(),
    routes
})
router.beforeEach((to, from, next) => {
    const loginUser = sessionStorage.getItem("loginUser");
    if (to.name !== 'Login' && loginUser == 'null') {
        next({name: 'Login'});
    } else next()
})
export default router
