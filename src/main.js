import Vue from 'vue';
import App from './App.vue';
import store from './store';
import vuetify from './plugins/vuetify';
import VueCookies from "vue-cookies";
import '../node_modules/material-icons/iconfont/material-icons.scss'
import Toasted from 'vue-toasted';
import VueLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import VuetifyDialog from 'vuetify-dialog'
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles

Vue.component('PrismEditor', PrismEditor);

Vue.config.productionTip = false;

//쿠키를 사용한다.
Vue.use(VueCookies);

// vue-toasted
Vue.use(Toasted)

Vue.use(VueLoading);

//쿠키의 만료일은 7일이다. (글로벌 세팅)
Vue.$cookies.config("7d");

// json dialog
Vue.use(VuetifyDialog, {
  context: {
    vuetify
  }
})

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')


Vue.toasted.register('errorToast',
  (payload) => {
      if(!payload.message) {
        return "알 수 없는 에러가 발생했습니다."
      }
      return payload.message;
  }, {
    type : 'error',
    icon : 'error',
    duration: 2000,
    theme: "outline", 
    position: "top-center", 
})

Vue.toasted.register('successToast',
  (payload) => {
      if(! payload.message) {
        return "정상처리되었습니다."
      }
      return payload.message;
  }, {
    type : 'success',
    icon : 'check',
    duration: 2000,
    theme: "outline", 
    position: "top-center", 
})