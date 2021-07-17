import Vue from 'vue'
import axios from "axios"

import { VueMaskDirective } from 'v-mask'
Vue.directive('mask', VueMaskDirective);

window.global = {
  test: '123'
}

export default (context, inject) => {

  const createRequest = (method, url = '', params = '', baseUrl = process.env.VUE_APP_URL) => {
    return axios[method](baseUrl + url, params)
  };

  const isLoggedIn = () => {
    return context.$auth.loggedIn;
  };

  const userInfo = () => {
    return context.$auth.user !== undefined && (context.$auth.user.length > 0) ? context.$auth.user[0] : {}
  };

  inject('createRequest', createRequest);
  inject('isLoggedIn', isLoggedIn);
  inject('userInfo', userInfo);
  context.$request = createRequest;
  context.$isLoggedIn = isLoggedIn;
  context.$userInfo = userInfo;
}
