import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'
import VueCookies from "vue-cookies";
import JsonViewer from 'vue-json-viewer'

Vue.config.productionTip = false;

//쿠키를 사용한다.
Vue.use(VueCookies);

// jsonview
Vue.use(JsonViewer);

//쿠키의 만료일은 7일이다. (글로벌 세팅)
Vue.$cookies.config("7d");

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

