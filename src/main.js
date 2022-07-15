import {createApp} from 'vue'
import router from './router'
import store from './store'
import myAxios from '@/request/axios'
import qs from "qs";
import HttpRequestApi from '@/api/index'
import VueAxios from 'vue-axios'
import ElementPlus from 'element-plus';
import {ElMessage} from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import "./common/css/common.css";
import App from './App.vue'

const app = createApp(App);

app.config.globalProperties.HttpRequestApi = HttpRequestApi
app.config.globalProperties.$Qs = qs
app.config.globalProperties.$Axios = myAxios

app.use(store)
    .use(router)
    .use(VueAxios,myAxios)
    .use(ElementPlus)
    .use(ElMessage)
    .use(ElementPlusIconsVue)
    .mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}