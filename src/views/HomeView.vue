<template>
    <el-container>
      <el-aside class="el-aside">
        <el-menu :router="true"
                 mode="vertical"
                 background-color="#545c64"
                 text-color="#ffffff"
                 active-text-color="#ffd04b"
                 :default-active="defaultActive"
                 :collapse="isCollapse"
                 class="aside-menu-style"
                 :unique-opened="true"
        >

          <el-menu-item style="justify-content: center;height: 60px;font-size: 18px">
            <img src="../common/images/terminal.png" width="30" height="30">
<!--            <el-icon><HomeFilled /></el-icon>-->
            <span>管理平台</span>
          </el-menu-item>
          <template v-for="(menu,i) in menuList"
                    v-bind:key="menu.id">
            <el-sub-menu v-if="menu.children" :index="i.toString()">
              <template #title>
                <el-icon>
                  <component :is="menu.icon"/>
                </el-icon>
                <span>{{ menu.name }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="(child,ci) in menu.children" v-bind:key="child.id"
                              :index="i.toString()+'-'+ci.toString()" :route="child.url">
                  <el-icon>
                    <component :is="child.icon"/>
                  </el-icon>
                  <span>{{ child.name }}</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-menu-item v-else :index="i.toString()" :route="menu.url" v-bind:aa="menu.url">
              <el-icon>
                <component :is="menu.icon"/>
              </el-icon>
              <span>{{ menu.name }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>


      <el-container>
        <el-header class="header-style">
          <el-row class="row-style">
            <el-col :span="1">
              <div style="color: #fff;font-size: 18px;font-weight: bold;display: flex;align-items: center;">
<!--                <span>管理平台</span>-->
                <el-icon @click="collapse">
                  <Fold/>
                </el-icon>
              </div>
            </el-col>
            <el-col :span="4">
              <Breadcrumb></Breadcrumb>
            </el-col>
<!--            <el-col :span="4">-->
<!--              <el-page-header @back="goBack" content="Home"/>-->
<!--            </el-col>-->
            <el-col :span="8" :offset="10" :style="['textAlign:right;fontSize:18px']">
              <el-popover placement="bottom" :width="300" trigger="click">
                <template #reference>
                  <el-button type="info">
                    <el-icon>
                      <UserFilled/>
                    </el-icon>
                    <span>{{ loginUser.loginName }}</span>
                  </el-button>
                </template>
                <el-row>
                  <el-col>
                    <el-card :body-style="{ padding: '0px' }">
                      <img
                          src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                          class="image"/>
                      <div style="padding: 14px">
                        <span>{{ loginUser.loginName }}</span>
                        <div class="bottom">
                          <time class="time">{{ currentDate }}</time>
                        </div>
                      </div>
                    </el-card>
                  </el-col>
                  <el-col class="login-user-style">
                    <!--                      <el-col :span="12"><el-button>成为运营商</el-button></el-col>-->
                    <!--                      <el-col :span="12"><el-button>切换运营商</el-button></el-col>-->
                    <el-col :span="12">
                      <el-button>
                        <el-icon>
                          <Edit/>
                        </el-icon>
                        个人中心
                      </el-button>
                    </el-col>
                    <el-col :span="12">
                      <el-button @click="logOut">
                        <el-icon>
                          <SwitchButton/>
                        </el-icon>
                        退出登录
                      </el-button>
                    </el-col>
                  </el-col>
                </el-row>
              </el-popover>
            </el-col>
          </el-row>
        </el-header>
        <el-main class="main-style">
          <router-view/>
        </el-main>
        <el-footer class="foot-style">

        </el-footer>
      </el-container>
    </el-container>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";

export default {
  name: 'HomeView',
  components:{
    Breadcrumb
  },
  data() {
    return {
      loginUser: this.$store.state.loginUser,
      menuList: [],
      isCollapse: false,
      currentDate: new Date(),
      defaultActive: '0',
    }
  },
  created() {
    var item = sessionStorage.getItem("menuTree");
    if (item != null && item != undefined && item.length > 0) {
      return;
    }
    this.axios.post(this.HttpRequestApi.terminal_menuTree)
        .then((response) => {
          if (response.data.code == '100000') {
            this.menuList=response.data.data;
            this.$store.commit('initMenu', response.data.data);
          }
        })
        .catch(error => {
          this.$message({
            message: error,
            type: 'success',
            center: true,
            duration: 1500
          })
        })
  },
  methods: {
    goBack() {
      history.go(-1)
    },
    collapse() {
      if (this.isCollapse) {
        this.isCollapse = false;
      } else {
        this.isCollapse = true;

      }
    },
    logOut() {
      this.axios.post(this.HttpRequestApi.terminal_logout).then((response) => {
        if (response.data.code == '100000') {
          this.$store.commit('initLoginUser', null);
          this.router.push(this.HttpRequestApi.terminal_login);
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
}

</script>

<style scoped>

.el-container{
  height: 100%;
}

.el-aside:not(.el-menu--collapse){
  width:auto;
  height: 100%;
  overflow-y: hidden;
}

.header-style {
  color: #fff;
  height: 60px;
  font-size: 18px;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  background-color: #545c64;
}

.row-style {
  width: 100%;
  display: flex;
  align-items: center;
}

.login-user-style {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
}

.login-user-style > div > button {
  width: 100px;
  margin-bottom: 10px;
}
.aside-menu-style {
  height: 100%;
  border: none;
  overflow-x: hidden;

}

.aside-menu-style:not(.el-menu--collapse) {
  width: 200px;
  background-color: #545c64;
  height: 100%;
}
.main-style {
  background-color: #dcdfe6
}

.foot-style {
  text-align: center;
  /*border-top: solid 1px #dcdfe6;*/
}
.image {
  width: 100%;
}

</style>
