import Constant from "../../Constant";

const state = {
  msgData: [],
};

const getters = {};

const actions = {};

const mutations = {
  [Constant.PUSH_MSG_DATA]: ($state, $payload) => {
    $state.msgData.push($payload);
  },
  [Constant.CLEAR_MSG_DATA]: ($state) => {
    $state.msgData = [];
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
};
