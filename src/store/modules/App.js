// Vuex 흐름 : View -[dispatch]-> Actions -[commit]-> Mutations -[change]-> state
import {initTable, fineAllGlobalDataByType} from '../../util/DbAccessUtils'

// ---------------------------------------------------------------------------
// STATE
// ---------------------------------------------------------------------------
const state = {
  
  request : {
    id:"",
    name: "",
    method: "",
    url:"",
  
    parameter: [],
    header: [],
    body: []
  }
}

// ---------------------------------------------------------------------------
// GETTERS
// ---------------------------------------------------------------------------
const getters = {
  getGlobalParameter: state => {
    return state.globalParameter
  },
  getGlobalHeader: state => {
    return state.globalHeader
  },
  getGlobalBody: state => {
    return state.globalBody
  }
}

// ---------------------------------------------------------------------------
// MUTATIONS 동기 
// state 변경, commit 으로 호출된다.
// => store.commit('MUTATION_NAME', payload)
// ---------------------------------------------------------------------------
const mutations = {
  INIT_GLOBAL_DATA: (state, payload) => {
    console.log(payload)
    initTable();
    state.globalParameter = fineAllGlobalDataByType('01');
  },
}

// ---------------------------------------------------------------------------
// ACTIONS 비동기
// 서버API 호출하고, 응답결과를 커밋하여 mutation 호출, dispatch 로 호출된다.
// ---------------------------------------------------------------------------
const actions = {
}

export default {
  state,
  mutations,
  actions,
  getters
}