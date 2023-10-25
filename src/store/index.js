import {createStore} from 'vuex'


const store = createStore({
  state: {
    userInfo:null,
    menu:null,
    route:null,
    nameFlag:false,
    msgBoxFlag:false,
    nowzz:null,
  },
  getters: {
    count(state) {
      return state.userInfo
    }
  },
  mutations: {
    setUserInfo(state, info) {
      state.userInfo = info
    },
    setMenu(state,menu){
      state.menu = menu
    },
    setRoute(state,route){
      state.route = route
    },
    setNameFlag(state,nameFlag){
      state.nameFlag = nameFlag
    },
    setMsgBoxFlag(state,msgBoxFlag){
      state.msgBoxFlag = msgBoxFlag
    },
    setNowzz(state,nowzz){
      state.nowzz = nowzz
    },
  },
  actions: {}
});
export default store;

