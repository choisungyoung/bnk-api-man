import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueCookies from "vue-cookies";

Vue.config.productionTip = false;

//쿠키를 사용한다.
Vue.use(VueCookies);

//쿠키의 만료일은 7일이다. (글로벌 세팅)
Vue.$cookies.config("7d");

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
/*
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/moneynode.db');
*/