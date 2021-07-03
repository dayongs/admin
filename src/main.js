import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js';
import domain from './common/config/domain.js';

import axios from "axios";
axios.defaults.baseURL =domain.devUrl;
global.domain = domain;



Vue.prototype.$http=axios


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
