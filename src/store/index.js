import { createStore } from 'vuex'
import router from "@/router";

export default createStore({
  state: {
    menuTree:JSON.parse(sessionStorage.getItem("menus")),
    loginUser:JSON.parse(sessionStorage.getItem("loginUser"))
  },
  getters: {
  },
  mutations: {
    initMenu(state,menus){
      state.menuTree = menus
      sessionStorage.setItem("menus",JSON.stringify(menus))
    },
    initLoginUser(state,loginUser){
      state.loginUser = loginUser
      sessionStorage.setItem("loginUser",JSON.stringify(loginUser))
    }
  },
  actions: {

  },
  modules: {
  },
  computed: {
    getMenuTree(){
      return this.$store.state.menuTree;
    },
    getLoginUser(){
      if (this.$store.state.loginUser){
        router.push("/login")
      }else {
        return this.$store.state.loginUser;
      }
    }
  },
})
