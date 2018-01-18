import * as types from "../types";
import io from "socket.io-client";
const socket = io();

const state = {
  onlineUsers: [],
  msgs: [
      {
          msg: "socket聊天室demo",
          type: "s"
      }
  ]
};

const mutations = {
  [types.CHAT_PATCH_ONLINEUSER] (state, users) {
    state.onlineUsers = [];
    state.onlineUsers = users;
  },
  [types.CHAT_PATCH_MSGS] (state, { type, user, msg }) {
    const typeArray = ["u", "s"];
    if (!~typeArray.indexOf(type)) return;
    state.msgs.push({
        user, type, msg
    });
  }
};

const actions = {
  patchMsgs ({ commit }) {
    socket.on("message", (data) => {
      commit("CHAT_PATCH_MSGS", {
          user: data.name,
          type: "u",
          msg: data.msg
      });
    });
  },
  createMsg ({ commit, state }, msg) {
    if (msg === "") return window.$Message.info("请输入消息内容");
    socket.emit("message", {
      userId: this.state.user.id,
      name: this.state.user.name,
      msg: msg
    });
  },
  patchOnlineUser ({ commit, state }) {
    socket.on("online_user", (data) => {
      state.onlineUsers = [];
      commit("CHAT_PATCH_ONLINEUSER", data.users);
    });
  },
  userJoin ({ commit }) {
    socket.on("login", (data) => {
      commit("CHAT_PATCH_MSGS", {
          user: data.name,
          type: "s",
          msg: `${data.name}加入了聊天`
      });
    });
  },
  userLogin () {
    socket.emit("login", this.state.user);
  }
};

const getters = {};

export {
  state, mutations, actions, getters
};
