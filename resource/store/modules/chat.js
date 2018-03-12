import * as types from "../types";
import io from "socket.io-client";
const socket = io();

const state = {
  onlineUsers: [],
  msgs: [
    {
      name: "Leo_李川",
      time: "10:30",
      msg: "哈哈哈,好看",
      dot: true,
      chatMember: 2,
      chatId: ""
    }, {
      name: "鑫儿",
      time: "9:30",
      msg: "我饿了要吃饭"
    }, {
      name: "喜悦",
      time: "11:30",
      msg: "起撸起撸起撸起撸起撸起撸起撸起撸起撸起"
    }, {
      name: "喜悦",
      time: "11:30",
      msg: "撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起\
        撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸\
        起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起\
        撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸\
        起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起\
        撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸\
        起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起\
        撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸\
        起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起\
        撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸\
        起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起\
        撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸\
        起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起撸起"
    }
  ],
  chatList: [
    {
      chat_id: "xxxx",
      user: {
        id: "xxxxx",
        name: "喜悦"
      }
    },
    {
      chat_id: "xxxx",
      user: {
        id: "xxxxx",
        name: "Leo"
      }
    },
    {
      chat_id: "xxxx",
      user: {
        id: "xxxxx",
        name: "小付"
      }
    }
  ],
  firends: []
};

const mutations = {
  [types.CHAT_ADD_FIREND] (state, users) {
    state.firends.push(...users);
  },

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
  addFirend ({ commit, state }, targetId) {
    this._vm.axios.post("/chat/creat_firend", {
      target_id: targetId,
      user_id: state.user.id
    }).then(resp => {
        const data = resp.data.data;
        commit(types.CHAT_ADD_FIREND, data);
    });
  },
  fetchFirends ({ commit, state }, userId) {
    this._vm.axios.get(`/chat/fetch_firends?user_id=${userId}`).then(resp => {
        const data = resp.data.data;
        commit(types.CHAT_ADD_FIREND, data);
    });
  },

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
  },
};

const getters = {};

export {
  state, mutations, actions, getters
};
