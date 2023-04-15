import { createApp } from 'vue'
import { createStore } from 'vuex'
import socket from "./modules/socket"
import axios from 'axios'

const debug = process.env.NODE_ENV !== "production"

const store = createStore({
  state: {
    requestData: null
  },
  mutations: {
    setRequestData(state, requestData) {
      state.requestData = requestData;
    },
    setPrivateKey(state, user) {
      localStorage.setItem("privateKey", JSON.stringify(user.key));
    }
  },
  actions: {
    async sendPostRequest(context, data) {
      try {
        const response = await axios.post('/completion', data);
        return response;
      } catch (error) {
        throw error;
      }
    },
    login({ commit }, userData) {
      commit("setPrivateKey", userData);
    }
  },
  // mutations: {
  //   LOGIN(state, userData) {
  //     state.user = userData;
  //     localStorage.setItem("user", JSON.stringify(userData));
  //   },
  //   LOGOUT() {
  //     localStorage.removeItem("user");
  //     location.reload();
  //   },
  // },
  // actions: {
  //   login({ commit }, userData) {
  //     commit("LOGIN", userData);
  //   },
  //   logout({ commit }) {
  //     commit("LOGOUT");
  //   },
  // },
  modules: {
    socket,
  },
  strict: debug,
  // plugins: debug ? [createLogger()] : []
});

export default store;
