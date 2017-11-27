// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vueInfiniteScroll from  'vue-infinite-scroll'
import axios from 'axios';
import {currency} from './util/currency'
axios.defaults.withCredentials = true;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
Vue.use(vueInfiniteScroll);
Vue.filter("currency", currency);
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {App}
})
