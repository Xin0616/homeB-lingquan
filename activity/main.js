import Vue from 'vue'
import App from './App'

// 友盟统计
// #ifdef H5
import uweb from 'vue-uweb'
Vue.prototype.$uweb = uweb
Vue.use(uweb,'1277890458')
// #endif

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
