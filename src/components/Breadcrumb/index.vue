<template>
  <el-row>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="index == levelList.length - 1 || item.redirect=='noRedirect'" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </el-row>
</template>

<script>
export default {
  name: "My-Breadcrumb",
  data(){
    return{
      levelList:[]
    }
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb();
  },
  methods:{
    getBreadcrumb() {
      // only show routes with meta.title
      // let matched = this.$route.matched.filter(item => {item.meta && item.meta.title })
      let matched = this.$route.matched;
      // console.log(matched)
      // let matched = this.$route.matched.filter(item => {item.meta.title })
      // let matched = this.$route.matched
      const first = matched[0]

      if (!this.isDashboard(first)) {
        matched = [{ path: '/index', meta: { title: '首页' }}].concat(matched)
      }
      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
      // console.log(this.levelList)
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim() === 'index'
    },
    handleLink(item){
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(path)
    }
  }
}
</script>

<style scoped>
.el-breadcrumb{
  font-size: 18px;
}
.no-redirect {
  color: #97a8be;
  cursor: text;
}
.el-breadcrumb__inner a, .el-breadcrumb__inner.is-link {
  font-weight: 700;
  text-decoration: none;
  transition: var(--el-transition-color);
  color: #97a8be;
}
</style>