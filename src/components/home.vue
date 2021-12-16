<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-app>
    <v-app-bar app>
      <v-spacer></v-spacer>
      <v-card>
        <v-btn @click="logout">
          <v-icon>mdi-logout-variant</v-icon>
          退出
        </v-btn>
      </v-card>
    </v-app-bar>
    <v-navigation-drawer app v-model="drawer" :mini-variant.sync="mini" permanent>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title :title="ApplicationTitle">{{ApplicationTitle}}</v-list-item-title>
          <v-list-item-subtitle :title="ApplicationSubTitle">{{ApplicationSubTitle}}</v-list-item-subtitle>
        </v-list-item-content>
        <v-btn icon @click.stop="mini = !mini">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense nav>
        <template v-for="menu in menus">
          <v-list-group v-if="menu.children" :value="false" :prepend-icon="menu.icon">
            <template v-slot:activator>
              <v-list-item-title>{{menu.title}}</v-list-item-title>
            </template>
            <v-list-item v-for="(child,i) in menu.children" :key="i" :to="child.url">
              <v-list-item-icon>
                <v-icon v-text="child.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-title v-text="child.title"></v-list-item-title>
            </v-list-item>
          </v-list-group>
          <v-list-item v-else link :to="menu.url">
            <v-list-item-icon><v-icon>{{menu.icon}}</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{menu.title}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <!-- 给应用提供合适的间距 -->
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
<!--    <v-footer app>

    </v-footer>-->
  </v-app>
</template>
<script>
    export default {
      name: "home",
      data() {
          return {
            drawer:false,
            mini: false,
            ApplicationTitle:'自动售货机管理系统',
            ApplicationSubTitle:'Vending machine management system',
            menus: [
              { title: 'Dashboard', icon: 'mdi-monitor-dashboard',child:[{}],url:'/dashboard'},
              { title: '系统管理', icon: 'mdi-cogs',
                children:[
                  {title: '用户管理', icon: 'mdi-account-settings',url:'/system/user'},
                  {title: '菜单管理', icon: 'mdi-menu',url:'/system/menu'},
                  {title: '角色管理', icon: 'mdi-account-sync',url:'/system/role'},
                  {title: '运营商管理', icon: 'mdi-account-supervisor-circle',url:'/system/operator'},
                ],url:'#'
              },
              { title: '设备管理', icon: 'mdi-console',child:[{}],url:'/terminal'},
              { title: '商品管理', icon: 'mdi-food-fork-drink',child:[{}],url:'/product' },
              { title: '策略管理', icon: 'mdi-strategy',
                children:[
                  {title: '价格策略', icon: 'mdi-currency-usd'},
                  {title: '场地策略', icon: 'mdi-cogs'},
                ]
              },
              { title: '仓库管理', icon: 'mdi-store-settings',
                children:[
                  {title: '仓库列表', icon: 'mdi-warehouse'},
                  {title: '供应商管理', icon: 'mdi-truck-cargo-container'},
                  {title: '库存调拨', icon: 'mdi-transfer'},
                  {title: '入库单', icon: 'mdi-hoop-house'},
                  {title: '仓库盘点', icon: 'mdi-filter-check-outline'},
                ]
              },
              { title: '订单管理', icon: 'mdi-order-numeric-ascending',child:[{}],url:'' },
              { title: '广告位管理', icon: 'mdi-advertisements',child:[{}],url:'' },
            ],
            right: null,
          }
      },
      methods:{
        logout(){
          localStorage.removeItem("userInfo");
          localStorage.removeItem("token");
          this.$router.push({path:'/'})
        }
      }
    }
</script>

<style scoped>

</style>
