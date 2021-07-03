// Vuex 흐름 : View -[dispatch]-> Actions -[commit]-> Mutations -[change]-> state
import Vue from 'vue'
import Vuex from 'vuex'

// module
import App from './modules/App'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true, // mutation 을 이용해서만 state 변경가능
  modules: {
    App 
  }
})
 