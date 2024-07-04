import { createApp } from 'vue'
import { createStore } from 'vuex'
import socket from "./modules/socket"
import axios from 'axios'

const debug = process.env.NODE_ENV !== "production"


const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Change to your API base URL
  // proxy: {
  //   host: '127.0.0.1', // Change to your proxy host
  //   port: 5173 // Change to your proxy port
  // }
});


const store = createStore({
  state: {
    requestData: []
  },
  mutations: {
    setRequestData(state, requestData) {
      state.requestData = requestData;
      localStorage.setItem("dialogue", JSON.stringify(requestData));
    },
    setPrivateKey(state, user) {
      localStorage.setItem("privateKey", JSON.stringify(user.key));
    }
  },
  actions: {
    async sendPostRequest(context, data) {
      try {
        const response = await axiosInstance.post('/completion', data);
        return response;
      } catch (error) {
        throw error;
      }
    },
    async login(context, userData) {
      try {
        const response = await axiosInstance.post('/mykey', { orderId: userData.key});
        // commit("setPrivateKey", userData);
        return response;
      } catch (error) {
        throw error;
      }
      
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
