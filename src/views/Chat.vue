<template>
  <div class="chat">
    <button class="floating-button" @click="clearChat">clear</button>
    <div class="chat__header">
    <a href="/#"> 
      <span class="chat__header__greetings">
        🍋Chatbot
      </span>
    </a>
      <span @click="showModal = true" class="chat__header__menu">
        ...
      </span>
      <div class="popup-container" v-if="showModal" @close="showModal = false">
        <div class="popup-header">
          <h5 class="popup-title">📝使用说明</h5>
          <div class="popup-close" @click="showModal = false"></div>
        </div>
        <div class="popup-content">
          <p>1.每天有免费额度次数限制,独立key按所有权限使用;</p>
          <p>2.如何获取独立key? 打赏作者：每1元获得100次;</p>
          <p>3.如何打赏? 按如下微信二维码支付, 根据转账单号查询你的专属key;</p>
          <p>4.打赏完之后, 获取key可能会有延迟, 如有紧急问题可直接微信联系.</p>
        </div>
        <div class="popup-divider">独立key查询
        <template v-if="total">
          (当前key剩余次数: {{ total }})
        </template>
        </div>
        <input
          id="input-username"
          class="popup-search"
          placeholder="请输入转账单号"
          type="text"
          v-model="orderNo"
          @keyup.enter="searchSubmit"
          required
        />
        <button class="login__button" @click="searchSubmit">search</button>
        <template v-if="key">
          <div class="popup-divider">你的key：
            {{ key }}
          </div>
        </template>
        <div class="chat__option">
          <h5>🔨设置 gpt model:</h5>
          <select id="options" v-model="gptModel" @change="handleSelectChange">
            <option v-for="item in option_data" :value="item.value">
            {{ item.label }}
            </option>
          </select>
        </div>
        <h5>💰打赏码:</h5>
        <img class="popup-image" src="../assets/receive.png" alt="Responsive image">
        <h5>🥂联系作者:</h5>
        <img class="popup-image" src="../assets/qr.png" alt="Responsive image">
        <div v-if="error" class="error-notice">
          <p>{{ error }}</p>
        </div>
      </div>
    </div>

    <chat-list :msgs="msgData"></chat-list>
    <chat-form @submitMessage="sendMessage" :placeholder="placeholder"></chat-form>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex";
import ChatList from "@/components/ChatList.vue";
import ChatForm from "@/components/ChatForm.vue";
import Constant from "@/Constant";

export default {
  data() {
    return {
      userData: null,
      key: null,
      error: null,
      showModal: false,
      total: 0,
      orderNo:"",
      gptModel: "gpt-4-turbo",
      placeholder: "Ask anything you like..",
      chat_msgs: [],
      sys_msg: {Role: "system",
                Content: "You are ChatGPT, Answer as concisely as possible."},
      option_data:[
                  {
                      value: 'gpt-4o',
                      label: 'gpt-4o'
                  },
                  {
                      value: 'gpt-4-turbo',
                      label: 'gpt-4'
                  },
                  {
                      value: 'gpt-3.5-turbo',
                      label: 'gpt-3.5'
                  }
              ]
    };
  },
  components: {
    ChatList,
    ChatForm,
  },
  computed: {
    ...mapState({
      msgData: (state) => state.socket.msgData,
      requestData: (state) => null,
    }),
  },
  created() {
    this.userData = this.$route.params.userData;
    this.key = JSON.parse(localStorage.getItem('privateKey'));
    // console.log(this.userData.userName)
  },

  mounted() {

    //   setTimeout(() => {
    //     const element = document.getElementById("chat__body");
    //     element.scrollTop = element.scrollHeight;
    //   }, 0);
    // });
  },

  methods: {
    ...mapActions(['sendPostRequest', 'login']),
    ...mapMutations({
      pushMsgData: Constant.PUSH_MSG_DATA,
      clearMsgData: Constant.CLEAR_MSG_DATA
    }),

    clearChat() {
      this.chat_msgs = [];
      this.clearMsgData();
    },

    setPlaceholder() {
      if (this.total == 0) {
        this.placeholder = "Ask anything you like.. 未登录"
      } else {
        this.placeholder = "Ask anything you like.. 剩余次数:" + this.total
      }
    },

    handleSelectChange(event) {
      const selectedValue = event.target.value;
      // console.log('Selected model:', selectedValue);
      this.gptModel = selectedValue
      this.error = "Success";
        setTimeout(() => {
          this.error = null;
        }, 1000);
    },

    addChatMsg(msg) {
      if (msg) {
        this.chat_msgs.push(msg); // Append the new item to the list
      } else {
        console.log("empty msg");
      }
    },

    async sendMessage(msg) {
      try {
        this.pushMsgData({
                    from: {
                      name: "DevplaCalledMe",
                      avatar: new URL(`../assets/user.png`, import.meta.url).href,
                    },
                    msg,
                  });
        if (this.chat_msgs.length === 0) {
            this.addChatMsg(this.sys_msg);
        };
        this.addChatMsg({
                    "role": "user",
                    "content": msg
                    });
        const response = await this.sendPostRequest({
                  messages: this.chat_msgs,
                  key: this.key,
                  model: this.gptModel
                          });
        if (response.data.code == 0) {
          this.$store.commit('setRequestData', response.data.data.messages);
          // console.log(this.$store.state.requestData)
          this.pushMsgData({
                      from: {
                        name: this.gptModel,
                        avatar: new URL(`../assets/gpt.png`, import.meta.url).href,
                      },
                      msg: response.data.data.reply,
                    });
          this.addChatMsg({
                    "role": "system",
                    "content": response.data.data.reply
                    });
          // console.log(this.$store.state.msgData)
          this.total = response.data.data.limit || 0;
          this.setPlaceholder()
        }
        // console.log(response.data.errorMsg)
      } catch (error) {
        console.log(error);
      }
      setTimeout(() => {
        const element = document.getElementById("chat__body");
        element.scrollTop = element.scrollHeight;
      }, 0);
    },

    async searchSubmit() {
      const userData = {
        key: this.orderNo
      };

      if (userData.key) {
        const response = await this.login(userData);

        // console.log(response.data.data)
        if (response.data.code == 200) {
          this.$store.commit('setPrivateKey', {"key": response.data.data.key});
          this.key = response.data.data.key
          this.total = response.data.data.balance || 0;
        } else {
          this.error = response.data.data;
          setTimeout(() => {
            this.error = null;
          }, 1500);
        }
      }
    },

    // sendMessage(msg) {
    //   const username = this.userData.userName;
    //   const avatar = this.userData.userImage;

    //   this.pushMsgData({
    //     from: {
    //       name: "DevplaCalledMe",
    //       avatar: avatar,
    //     },
    //     msg,
    //   });

    //   this.$sendMessage({
    //     name: username,
    //     msg,
    //     avatar: avatar,
    //   });

  },
};
</script>

<style scoped>
.chat {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.floating-button {
  position: fixed;
  top: 6.0rem;
  right: 20px;
  padding: 10px 20px;
  background-color: #fff0f1;
  color: #60605b;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  font-family: "Golden Plains - Demo";
}

.floating-button:active {
  transform: scale(0.95);
}

.floating-button:hover {
    background-color: #e6ccab;
    border-radius: 5px;
}

.chat__header {
  background: #ffffff;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.05);
  border-radius: 24px 24px 0px 0px;
  padding: 1.8rem;
  font-size: 16px;
  font-weight: 700;
}

.chat__header a {
  text-decoration: none;
}

.chat__header__greetings {
  color: #292929;
}
.chat__header__menu {
  color: #292929;
  float: right;
  font-weight: 700;
}

.chat__option {
  border: none;
}

.chat__option label {
      font-size: 12px;
      font-weight: bold;
      margin-bottom: 10px;
      display: block;
      color: #333;
    }

.chat__option select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.chat__option select:focus {
  border-color: #007BFF;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  outline: none;
}

.chat__option select option {
  padding: 10px;
}

.popup-container {
  position: fixed;
  z-index: 2;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 24px 24px 0px 0px;
  overflow-y: auto;
  height: 600px; 
}

.popup-title {
  text-align: center;
}
.popup-close {
  position: absolute;
  right: 2rem;
  top: 2rem;
  cursor: pointer;
}

.popup-close::before,
.popup-close::after {
  content: "";
  position: absolute;
  width: 2px;
  height: 16px;
  top: 2px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  background-color: #857d7d;
}

.popup-close::after {
  transform: translateX(-50%) rotate(-45deg);
}

.popup-content {
  font-size: 14px;
  line-height: 1.5;
  font-weight: 500;
}

.popup-image{
  position: relative;
  display: inline-block;
  overflow: hidden;
  border-style: none;
  max-width: 100%;
  height: auto;
}
.popup-search {
  padding: 0.4rem;
  border: none;
  border-bottom: 1.5px solid #afb4b8;
  text-align: center;
}

.popup-search:focus {
  outline: none;
}

.popup-divider {
    margin: 12px 0;
    font-size: .75rem;
    color: #999;
}

.error-notice {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  color: #155724;
  background-color: #d4edda;
  padding: 3px 10px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}
</style>
