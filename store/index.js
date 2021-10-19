import axios from "@/plugins/axios";

export const state = () => ({
  token: '',
  mainLoader: true,
  snackbar: {
    open: false,
    text: '',
    type: 'success'
  },
  activeYear: '',
  newYear: '',
  userStatusInfo: null,
  userIsAdmin: 'admin'
});
export const mutations = {
  SET_TOKEN(state, payload) {
    state.token = payload
    console.log(state.token)
  },
  SET_MAIN_LOADER(state, payload) {
    state.mainLoader = payload
  },
  SET_SNACK_BAR_SETTINGS(state, payload) {
    state.snackbar.text = payload.text
    state.snackbar.type = payload.type
  },
  SET_SNACKBAR(state, payload) {
    state.snackbar.open = payload
  },
  SET_ACTIVE_YEAR(state, payload) {
    state.activeYear = payload
  },
  SET_NEW_YEAR(state, payload) {
    state.newYear = payload
  },
  SET_USER_INFO(state, payload) {
    state.userStatusInfo = payload
  },
  SET_USER_ISADMIN(state, payload) {
    state.userIsAdmin = payload
  }
};
export const actions = {
  setUserIsAdmin({commit}, payload) {
    commit('SET_USER_ISADMIN', payload)
  },
  setUserInfo({commit}, payload) {
    commit('SET_USER_INFO', payload)
  },
  setToken({commit, state}, payload) {
    commit('SET_TOKEN', payload)
  },
  setMainLoader({commit}, payload) {
    commit('SET_MAIN_LOADER', payload)
  },
  openSnackbar({commit}, payload) {

    const text = payload.text !== undefined ? payload.text : '';
    const type = payload.type !== undefined ? payload.type : 'success';

    console.log('text', text)
    console.log('text', type)

    commit('SET_SNACKBAR', true)
    commit('SET_SNACK_BAR_SETTINGS', {
      text: text,
      type: type
    })
  },
  closeSnackBar({commit}) {
    commit('SET_SNACKBAR', false)
  },
  getActiveYear({commit}) {
    this.$axios.post('/year/active').then((res) => {
      commit('SET_NEW_YEAR', JSON.parse(res.data.data.results).newYearName)
      commit('SET_ACTIVE_YEAR', JSON.parse(res.data.data.results).yearName)

    })
  }
}
export const getters = {
  getList(state) {
    return state.list
  },
  getActiveYear(state) {
    return state.activeYear
  }
};
