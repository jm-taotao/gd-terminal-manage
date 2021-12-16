import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state:{
    token:'',
    userInfo:'',
    menu:'',
  },
  mutations:{
    setToken:(token) => state.token = token,
    setUserInfo:(userInfo) => state.userInfo = userInfo,
    setMenu:(menu) => state.menu = menu,
  },
  modules:{

  },
  actions:{

  }
})

